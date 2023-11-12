import { getOddsForEvent } from "@/clients/skybet";
import { db } from "@/database/client";
import { LatestOdds, Odds } from "@/database/schema";
import { desc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
const EVENT_ID = 30490503;
const MARKET_ID = 268249179;
export async function GET(request: NextRequest) {
  const data = await getOddsForEvent(EVENT_ID);
  const market = data.data?.markets.find(
    (market) => market.marketId === MARKET_ID
  );
  const dateToCheck = new Date(Date.now() - 60 * 1 * 1 * 1000);
  const lastUpdate = await db.query.Odds.findFirst({
    where: (Odds, { and, eq }) =>
      and(
        eq(Odds.marketId, String(MARKET_ID)),
        eq(Odds.eventId, String(EVENT_ID))
      ),
    orderBy: [desc(Odds.timestamp)],
  });

  if (lastUpdate?.timestamp) {
    const isOld = lastUpdate.timestamp < dateToCheck;
    if (isOld && market) {
      const inserted = await db.insert(Odds).values(
        market?.outcomes.map((outcome) => ({
          eventId: String(EVENT_ID),
          eventName: data.data?.desc,
          marketId: String(market.marketId),
          marketName: String(market.name),
          outcome: outcome.desc,
          outcomeId: String(outcome.outcomeId),
          oddsDecimal: outcome.lp_decimal,
          oddsFractional: outcome.lp_disp_fraction,
          bookmaker: "SKY_BET",
        }))
      );
      const latestOddsUpdate = await Promise.all(
        market.outcomes.map(async (outcome) => {
          return db
            .insert(LatestOdds)
            .values({
              eventId: String(EVENT_ID),
              eventName: data.data?.desc,
              marketId: String(market.marketId),
              marketName: String(market.name),
              outcome: outcome.desc,
              outcomeId: String(outcome.outcomeId),
              oddsDecimal: outcome.lp_decimal,
              oddsFractional: outcome.lp_disp_fraction,
              bookmaker: "SKY_BET",
            })
            .onConflictDoUpdate({
              target: [
                LatestOdds.eventId,
                LatestOdds.marketId,
                LatestOdds.outcomeId,
                LatestOdds.bookmaker,
              ],
              set: {
                oddsDecimal: outcome.lp_decimal,
                oddsFractional: outcome.lp_disp_fraction,
                timestamp: new Date(),
              },
            });
        })
      );
      return NextResponse.json({ inserted, latestOddsUpdate });
    }
  }

  return NextResponse.json({ lastUpdate: lastUpdate });
}
