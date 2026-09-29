-- Clinical draft foundation (Sprint 2). Additive only.
-- Does NOT alter Better Auth tables (user/session/account/verification columns).
-- FICTIONAL DATA ONLY — temporary shared database topology.

CREATE TYPE "exam_protocol" AS ENUM ('OBSTETRIC_DOPPLER');
CREATE TYPE "exam_status" AS ENUM ('DRAFT');
CREATE TYPE "fetal_lie" AS ENUM ('LONGITUDINAL', 'TRANSVERSE');
CREATE TYPE "fetal_presentation" AS ENUM ('CEPHALIC', 'PELVIC', 'CORMIC');
CREATE TYPE "laterality" AS ENUM ('RIGHT', 'LEFT');
CREATE TYPE "placenta_location" AS ENUM ('ANTERIOR', 'POSTERIOR', 'FUNDAL', 'LATERAL');
CREATE TYPE "placenta_grade" AS ENUM ('I', 'II', 'III');
CREATE TYPE "amniotic_method" AS ENUM ('MBV', 'ILA');

CREATE TABLE "patient" (
    "id" TEXT NOT NULL,
    "ownerUserId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patient_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "pregnancy_episode" (
    "id" TEXT NOT NULL,
    "ownerUserId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "lmp" TIMESTAMP(3),
    "gravidity" INTEGER,
    "parity" INTEGER,
    "abortions" INTEGER,
    "datingUltrasoundDate" TIMESTAMP(3),
    "datingUltrasoundGaWeeks" INTEGER,
    "datingUltrasoundGaDays" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pregnancy_episode_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "exam" (
    "id" TEXT NOT NULL,
    "ownerUserId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "pregnancyEpisodeId" TEXT NOT NULL,
    "protocol" "exam_protocol" NOT NULL,
    "status" "exam_status" NOT NULL DEFAULT 'DRAFT',
    "comorbidities" TEXT,
    "continuousMedications" TEXT,
    "placentaLocation" "placenta_location",
    "placentaGrade" "placenta_grade",
    "amnioticMethod" "amniotic_method",
    "amnioticValue" DOUBLE PRECISION,
    "uterineArteryRightPi" DOUBLE PRECISION,
    "uterineArteryLeftPi" DOUBLE PRECISION,
    "uterineArteryRightNotch" BOOLEAN,
    "uterineArteryLeftNotch" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exam_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "fetus" (
    "id" TEXT NOT NULL,
    "examId" TEXT NOT NULL,
    "ordinal" INTEGER NOT NULL DEFAULT 0,
    "lie" "fetal_lie",
    "presentation" "fetal_presentation",
    "spineSide" "laterality",
    "cephalicPoleSide" "laterality",
    "heartRateBpm" INTEGER,
    "bodyMovementsPresent" BOOLEAN,
    "swallowingPresent" BOOLEAN,
    "biparietalDiameterMm" DOUBLE PRECISION,
    "headCircumferenceMm" DOUBLE PRECISION,
    "abdominalCircumferenceMm" DOUBLE PRECISION,
    "femurLengthMm" DOUBLE PRECISION,
    "umbilicalArteryPi" DOUBLE PRECISION,
    "middleCerebralArteryPi" DOUBLE PRECISION,
    "ductusVenosusPi" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fetus_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "patient_ownerUserId_idx" ON "patient"("ownerUserId");
CREATE INDEX "patient_ownerUserId_fullName_idx" ON "patient"("ownerUserId", "fullName");
CREATE INDEX "pregnancy_episode_ownerUserId_idx" ON "pregnancy_episode"("ownerUserId");
CREATE INDEX "pregnancy_episode_patientId_idx" ON "pregnancy_episode"("patientId");
CREATE INDEX "exam_ownerUserId_idx" ON "exam"("ownerUserId");
CREATE INDEX "exam_patientId_idx" ON "exam"("patientId");
CREATE INDEX "exam_pregnancyEpisodeId_idx" ON "exam"("pregnancyEpisodeId");
CREATE INDEX "exam_ownerUserId_status_idx" ON "exam"("ownerUserId", "status");
CREATE INDEX "fetus_examId_idx" ON "fetus"("examId");
CREATE UNIQUE INDEX "fetus_examId_ordinal_key" ON "fetus"("examId", "ordinal");

ALTER TABLE "patient" ADD CONSTRAINT "patient_ownerUserId_fkey" FOREIGN KEY ("ownerUserId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "pregnancy_episode" ADD CONSTRAINT "pregnancy_episode_ownerUserId_fkey" FOREIGN KEY ("ownerUserId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "pregnancy_episode" ADD CONSTRAINT "pregnancy_episode_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "exam" ADD CONSTRAINT "exam_ownerUserId_fkey" FOREIGN KEY ("ownerUserId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "exam" ADD CONSTRAINT "exam_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "exam" ADD CONSTRAINT "exam_pregnancyEpisodeId_fkey" FOREIGN KEY ("pregnancyEpisodeId") REFERENCES "pregnancy_episode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "fetus" ADD CONSTRAINT "fetus_examId_fkey" FOREIGN KEY ("examId") REFERENCES "exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;
