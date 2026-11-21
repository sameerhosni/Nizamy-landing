import {
  boolean,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { sql } from "drizzle-orm";
import { z } from "zod/v4";

export const websiteFormSubmissionsTable = pgTable(
  "website_form_submissions",
  {
    requestId: text("request_id").primaryKey(),
    payloadHash: text("payload_hash").notNull(),
    normalizedEmail: text("normalized_email").notNull(),
    normalizedPhone: text("normalized_phone"),
    status: text("status").notNull().default("pending"),
    notificationEmailSent: boolean("notification_email_sent"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex("website_form_submissions_email_unique").on(
      table.normalizedEmail,
    ),
    uniqueIndex("website_form_submissions_phone_unique")
      .on(table.normalizedPhone)
      .where(sql`${table.normalizedPhone} is not null`),
  ],
);

export const insertWebsiteFormSubmissionSchema = createInsertSchema(
  websiteFormSubmissionsTable,
).omit({ createdAt: true, updatedAt: true });

export type InsertWebsiteFormSubmission = z.infer<
  typeof insertWebsiteFormSubmissionSchema
>;
export type WebsiteFormSubmission =
  typeof websiteFormSubmissionsTable.$inferSelect;