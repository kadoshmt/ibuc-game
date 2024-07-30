/*
  Warnings:

  - Added the required column `mode` to the `Ranking` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Ranking" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "playerName" TEXT NOT NULL,
    "totalScore" INTEGER NOT NULL,
    "totalTime" INTEGER NOT NULL,
    "mode" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Ranking" ("createdAt", "id", "playerName", "totalScore", "totalTime") SELECT "createdAt", "id", "playerName", "totalScore", "totalTime" FROM "Ranking";
DROP TABLE "Ranking";
ALTER TABLE "new_Ranking" RENAME TO "Ranking";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
