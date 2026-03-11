import { integer, jsonb, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { repositories } from "./repositories.js";

export const analysisStatusEnum = pgEnum("analysis_status", [
  "queued",
  "processing",
  "completed",
  "failed"
]);

export const analyses = pgTable("analyses", {
  id: uuid("id").defaultRandom().primaryKey(),
  repositoryId: uuid("repository_id")
    .notNull()
    .references(() => repositories.id, { onDelete: "cascade" }),
  status: analysisStatusEnum("status").notNull().default("queued"),
  queueJobId: text("queue_job_id"),
  summary: text("summary"),
  architecture: text("architecture"),
  setupGuide: text("setup_guide"),
  contributionAreas: jsonb("contribution_areas").$type<string[]>().notNull().default([]),
  beginnerFriendlyIssueCount: integer("beginner_friendly_issue_count").notNull().default(0),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().notNull().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
});
