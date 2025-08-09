import {
  numeric,
  pgTable,
  timestamp,
  uuid
} from "drizzle-orm/pg-core";

export const clicksTable = pgTable("clicks", {
  id: uuid().primaryKey().defaultRandom(),
  value: numeric().notNull(),
  created_at: timestamp().notNull().defaultNow(),
});
