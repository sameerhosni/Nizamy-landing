import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const incentiveSignupsTable = pgTable("incentive_signups", {
  id: serial("id").primaryKey(),
  intent: text("intent").notNull(),
  email: text("email").unique(),
  mobile: text("mobile").unique(),
  pointsAwarded: integer("points_awarded").notNull().default(5000),
  language: text("language").notNull().default("ar"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const insertIncentiveSignupSchema = createInsertSchema(
  incentiveSignupsTable,
).omit({
  id: true,
  createdAt: true,
});

export type InsertIncentiveSignup = z.infer<
  typeof insertIncentiveSignupSchema
>;
export type IncentiveSignup = typeof incentiveSignupsTable.$inferSelect;