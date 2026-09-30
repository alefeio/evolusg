-- Clinical pilot feedback batch 1. Additive only.
-- Existing drafts keep transducersUsed empty (no inferred convex).
-- Does not alter Better Auth tables.

CREATE TYPE "transducer_type" AS ENUM ('CONVEX_MULTIFREQUENCY', 'ENDOCAVITARY');

ALTER TABLE "exam"
ADD COLUMN "transducersUsed" "transducer_type"[] NOT NULL DEFAULT ARRAY[]::"transducer_type"[];

ALTER TYPE "laterality" ADD VALUE IF NOT EXISTS 'VARIABLE';
ALTER TYPE "placenta_grade" ADD VALUE IF NOT EXISTS 'GRADE_0';
