import { getOddsForEvent } from "@/clients/skybet";
import { db } from "@/database/client";
import { Odds } from "@/database/schema";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
const EVENT_ID = 30490503;
const MARKET_ID = 268249179;
export async function GET(request: Request) {
  const data = await getOddsForEvent(EVENT_ID);
  const market = data.data?.markets.find(
    (market) => market.marketId === MARKET_ID
  );

  const lastUpdate = await db.query.Odds.findFirst({
    where: (Odds, { gt, and, eq }) =>
      and(
        gt(Odds.timestamp, new Date(Date.now() - 60 * 60 * 1 * 1000)),
        eq(Odds.marketId, String(MARKET_ID)),
        eq(Odds.eventId, String(EVENT_ID))
      ),
  });

  if (lastUpdate) {
    return NextResponse.json({ lastUpdate: lastUpdate });
  }
  let inserted;
  if (data.data && market?.outcomes) {
    inserted = await db.insert(Odds).values(
      market?.outcomes.map((outcome) => ({
        eventId: String(EVENT_ID),
        eventName: data.data?.desc,
        marketId: String(market.marketId),
        marketName: String(market.name),
        outcome: outcome.desc,
        outcomeId: String(outcome.outcomeId),
        oddsDecimal: outcome.lp_decimal,
        oddsFractional: outcome.lp_disp_fraction,
      }))
    );
  }

  return NextResponse.json({ inserted });
}
