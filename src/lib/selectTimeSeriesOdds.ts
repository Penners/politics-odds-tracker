import { db } from "@/database/client";
import { Odds } from "@/database/schema";
import { asc } from "drizzle-orm";

export const selectTimeSeriesOdds = async (
  eventId: string | number,
  marketId: string | number,
  bookmaker: string = "SKY_BET"
) => {
  const data = await db.query.Odds.findMany({
    columns: {
      oddsDecimal: true,
      outcome: true,
      timestamp: true,
    },
    where: (table, { eq, and }) => {
      return and(
        eq(table.eventId, String(eventId)),
        eq(table.marketId, String(marketId)),
        eq(table.bookmaker, bookmaker)
      );
    },
    orderBy: asc(Odds.timestamp),
  });
  return data.map((x) => ({
    ...x,
    oddsDecimal: x.oddsDecimal ?? 0,
  }));
};
