/*
  Warnings:

  - The `fitMode` column on the `PromptItem` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "PromptItem" DROP COLUMN "fitMode",
ADD COLUMN     "fitMode" TEXT NOT NULL DEFAULT 'cover';

-- DropEnum
DROP TYPE "FitMode";
