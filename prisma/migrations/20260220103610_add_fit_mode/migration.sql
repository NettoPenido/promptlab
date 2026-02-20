/*
  Warnings:

  - The `fitMode` column on the `PromptItem` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "FitMode" AS ENUM ('cover', 'contain');

-- AlterTable
ALTER TABLE "PromptItem" DROP COLUMN "fitMode",
ADD COLUMN     "fitMode" "FitMode" NOT NULL DEFAULT 'cover';
