/*
  Warnings:

  - The primary key for the `Product` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Order` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Price` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "serialNumber" INTEGER,
    "isNew" INTEGER,
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
CREATE TABLE "new_Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT,
    "date" DATETIME,
    "description" TEXT,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Order" ("date", "description", "id", "title", "userId") SELECT "date", "description", "id", "title", "userId" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
CREATE TABLE "new_Price" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "value" REAL,
    "symbol" TEXT,
    "isDefault" INTEGER,
    "productId" TEXT NOT NULL,
    CONSTRAINT "Price_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Price" ("id", "isDefault", "productId", "symbol", "value") SELECT "id", "isDefault", "productId", "symbol", "value" FROM "Price";
DROP TABLE "Price";
ALTER TABLE "new_Price" RENAME TO "Price";
CREATE TABLE "new_Guarantee" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "start" TEXT,
    "end" TEXT
);
INSERT INTO "new_Guarantee" ("end", "id", "start") SELECT "end", "id", "start" FROM "Guarantee";
DROP TABLE "Guarantee";
ALTER TABLE "new_Guarantee" RENAME TO "Guarantee";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
