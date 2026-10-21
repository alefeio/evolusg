-- Clinical date of the ultrasound examination. Additive only.
-- examDate is the day the exam was performed, not Exam.createdAt.
-- Existing rows stay NULL. No backfill.

ALTER TABLE "exam" ADD COLUMN "examDate" DATE;
