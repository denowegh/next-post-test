/*
  Warnings:

  - You are about to alter the column `isNew` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Boolean`.
  - You are about to alter the column `isDefault` on the `Price` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Boolean`.

*/
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
    CONSTRAINT "Product_guaranteeId_fkey" FOREIGN KEY ("guaranteeId") REFERENCES "Guarantee" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Product_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("date", "guaranteeId", "id", "isNew", "orderId", "photo", "serialNumber", "specification", "title", "type") SELECT "date", "guaranteeId", "id", "isNew", "orderId", "photo", "serialNumber", "specification", "title", "type" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE TABLE "new_Price" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "value" REAL,
    "symbol" TEXT,
    "isDefault" BOOLEAN,
    "productId" TEXT NOT NULL,
    CONSTRAINT "Price_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Price" ("id", "isDefault", "productId", "symbol", "value") SELECT "id", "isDefault", "productId", "symbol", "value" FROM "Price";
DROP TABLE "Price";
ALTER TABLE "new_Price" RENAME TO "Price";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
