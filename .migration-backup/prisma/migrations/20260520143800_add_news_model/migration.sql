-- Expand news articles for admin publishing workflow.
UPDATE "News" SET "excerpt" = LEFT(COALESCE("excerpt", "title"), 160) WHERE "excerpt" IS NULL;
UPDATE "News" SET "content" = COALESCE("content", "excerpt", "title") WHERE "content" IS NULL;
UPDATE "News" SET "coverImage" = COALESCE("coverImage", '') WHERE "coverImage" IS NULL;
UPDATE "News" SET "category" = COALESCE("category", 'Ministry') WHERE "category" IS NULL;

ALTER TABLE "News" ADD COLUMN "author" TEXT;
ALTER TABLE "News" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE "News" ALTER COLUMN "excerpt" SET NOT NULL;
ALTER TABLE "News" ALTER COLUMN "content" SET NOT NULL;
ALTER TABLE "News" ALTER COLUMN "coverImage" SET NOT NULL;
ALTER TABLE "News" ALTER COLUMN "category" SET NOT NULL;
