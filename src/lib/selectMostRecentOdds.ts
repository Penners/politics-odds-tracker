import { db } from "@/database/client";

export const selectMostRecentOdds = async (
  eventId: string | number,
  marketId: string | number,
  bookmaker: string = "SKY_BET"
) => {
  const data = await db.query.LatestOdds.findMany({
    columns: {
      oddsDecimal: true,
      oddsFractional: true,
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
  });
  return data
    .map((row) => ({
      ...row,
      ...(typeof row.oddsDecimal === "number" ||
      typeof row.oddsDecimal === "bigint"
        ? { impliedPercent: (1 / row.oddsDecimal) * 100 }
        : {}),
    }))
    .sort((a, b) => {
      if (!a?.impliedPercent) return 1;
      if (!b?.impliedPercent) return 1;
      return b.impliedPercent - a.impliedPercent;
    });
};
