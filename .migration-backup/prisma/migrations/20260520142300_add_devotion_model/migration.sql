-- Expand devotions for scheduled daily content management.
UPDATE "Devotion" SET "verse" = 'Unspecified' WHERE "verse" IS NULL;
UPDATE "Devotion" SET "reflection" = 'No reflection provided.' WHERE "reflection" IS NULL;

ALTER TABLE "Devotion" ADD COLUMN "imageUrl" TEXT;
ALTER TABLE "Devotion" ADD COLUMN "publishedAt" TIMESTAMP(3);
ALTER TABLE "Devotion" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE "Devotion" ALTER COLUMN "verse" SET NOT NULL;
ALTER TABLE "Devotion" ALTER COLUMN "reflection" SET NOT NULL;
ALTER TABLE "Devotion" ALTER COLUMN "date" DROP DEFAULT;

CREATE UNIQUE INDEX "Devotion_date_key" ON "Devotion"("date");
