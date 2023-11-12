import { sql } from "drizzle-orm";
import {
  index,
  integer,
  primaryKey,
  real,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

export const Odds = sqliteTable(
  "odds",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    eventId: text("event_id").notNull(),
    eventName: text("event_name"),
    marketId: text("market_id").notNull(),
    marketName: text("market_name"),
    outcomeId: text("outcome_id").notNull(),
    outcome: text("outcome").notNull(),
    oddsDecimal: real("odds_decimal"),
    oddsFractional: text("odds_fractional"),
    timestamp: integer("timestamp", { mode: "timestamp_ms" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    bookmaker: text("bookmaker"),
  },
  (table) => {
    return {
      plot_history_for_market: index("plot_history_for_market").on(
        table.eventId,
        table.marketId,
        table.timestamp
      ),
    };
  }
);

export const LatestOdds = sqliteTable(
  "latest_odds",
  {
    eventId: text("event_id").notNull(),
    eventName: text("event_name"),
    marketId: text("market_id").notNull(),
    marketName: text("market_name"),
    outcomeId: text("outcome_id").notNull(),
    outcome: text("outcome").notNull(),
    oddsDecimal: real("odds_decimal"),
    oddsFractional: text("odds_fractional"),
    timestamp: integer("timestamp", { mode: "timestamp_ms" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    bookmaker: text("bookmaker").notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({
        columns: [
          table.eventId,
          table.marketId,
          table.outcomeId,
          table.bookmaker,
        ],
      }),
    };
  }
);
