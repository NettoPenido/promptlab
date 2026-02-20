-- CreateEnum
CREATE TYPE "FitMode" AS ENUM ('cover', 'contain');

-- AlterTable
ALTER TABLE "PromptItem" ADD COLUMN     "fitMode" "FitMode" NOT NULL DEFAULT 'cover';
