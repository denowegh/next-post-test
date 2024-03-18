-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "serialNumber" INTEGER,
    "isNew" BOOLEAN,
    "photo" TEXT,
    "title" TEXT,
    "type" TEXT,
    "specification" TEXT,
    "date" DATETIME,
    "guaranteeId" TEXT,
    "orderId" TEXT,
    "userId" TEXT,
    CONSTRAINT "Product_guaranteeId_fkey" FOREIGN KEY ("guaranteeId") REFERENCES "Guarantee" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Product_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Product_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("date", "guaranteeId", "id", "isNew", "orderId", "photo", "serialNumber", "specification", "title", "type") SELECT "date", "guaranteeId", "id", "isNew", "orderId", "photo", "serialNumber", "specification", "title", "type" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
