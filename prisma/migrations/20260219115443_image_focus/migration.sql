/*
  Warnings:

  - You are about to drop the `AccessRateLimit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AccessSession` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "AccessSession_deviceId_idx";

-- DropIndex
DROP INDEX "AccessSession_email_idx";

-- DropIndex
DROP INDEX "AccessSession_sessionToken_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "AccessRateLimit";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "AccessSession";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PromptItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "imageFocus" TEXT NOT NULL DEFAULT '50% 25%',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_PromptItem" ("category", "createdAt", "id", "image", "isActive", "prompt", "title", "updatedAt") SELECT "category", "createdAt", "id", "image", "isActive", "prompt", "title", "updatedAt" FROM "PromptItem";
DROP TABLE "PromptItem";
ALTER TABLE "new_PromptItem" RENAME TO "PromptItem";
CREATE INDEX "PromptItem_category_idx" ON "PromptItem"("category");
CREATE INDEX "PromptItem_isActive_idx" ON "PromptItem"("isActive");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
