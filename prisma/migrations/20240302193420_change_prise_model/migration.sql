/*
  Warnings:

  - You are about to drop the column `isDefault` on the `Price` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN "defaultPriceId" TEXT;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Price" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "value" REAL,
    "symbol" TEXT,
    "productId" TEXT NOT NULL,
    CONSTRAINT "Price_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Price" ("id", "productId", "symbol", "value") SELECT "id", "productId", "symbol", "value" FROM "Price";
DROP TABLE "Price";
ALTER TABLE "new_Price" RENAME TO "Price";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
