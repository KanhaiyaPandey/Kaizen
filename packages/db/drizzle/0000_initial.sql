CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE "analysis_status" AS ENUM ('queued', 'processing', 'completed', 'failed');

CREATE TABLE "users" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "github_id" text NOT NULL UNIQUE,
  "username" text NOT NULL,
  "email" text,
  "avatar_url" text,
  "access_token_encrypted" text,
  "onboarding_completed" boolean NOT NULL DEFAULT false,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE "repositories" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "owner_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "github_repo_id" text NOT NULL UNIQUE,
  "full_name" text NOT NULL,
  "default_branch" text NOT NULL DEFAULT 'main',
  "primary_language" text,
  "open_issues_count" integer NOT NULL DEFAULT 0,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE "analyses" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "repository_id" uuid NOT NULL REFERENCES "repositories"("id") ON DELETE CASCADE,
  "status" "analysis_status" NOT NULL DEFAULT 'queued',
  "queue_job_id" text,
  "summary" text,
  "architecture" text,
  "setup_guide" text,
  "contribution_areas" jsonb NOT NULL DEFAULT '[]'::jsonb,
  "beginner_friendly_issue_count" integer NOT NULL DEFAULT 0,
  "metadata" jsonb NOT NULL DEFAULT '{}'::jsonb,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);
