-- Batch 2: optional ductus venosus assessment. Additive only.
-- Existing rows with a stored IP are marked assessed because a clinical value already exists.
-- Rows without an IP stay null: no assessment is inferred.

ALTER TABLE "fetus" ADD COLUMN "ductusVenosusAssessed" BOOLEAN;

UPDATE "fetus"
SET "ductusVenosusAssessed" = true
WHERE "ductusVenosusPi" IS NOT NULL;
