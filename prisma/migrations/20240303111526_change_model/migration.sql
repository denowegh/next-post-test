/*
  Warnings:

  - You are about to drop the column `date` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `defaultPriceId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `isNew` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `serialNumber` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `specification` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Order` table. All the data in the column will be lost.
  - Added the required column `productId` to the `Guarantee` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT,
    "type" TEXT,
    "guaranteeId" TEXT,
    "orderId" TEXT,
    CONSTRAINT "Product_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("guaranteeId", "id", "orderId", "title", "type") SELECT "guaranteeId", "id", "orderId", "title", "type" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE TABLE "new_Guarantee" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "start" TEXT,
    "end" TEXT,
    "productId" TEXT NOT NULL,
    CONSTRAINT "Guarantee_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Guarantee" ("end", "id", "start") SELECT "end", "id", "start" FROM "Guarantee";
DROP TABLE "Guarantee";
ALTER TABLE "new_Guarantee" RENAME TO "Guarantee";
CREATE UNIQUE INDEX "Guarantee_productId_key" ON "Guarantee"("productId");
CREATE TABLE "new_Price" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "value" REAL,
    "symbol" TEXT,
    "productId" TEXT NOT NULL DEFAULT '0',
    CONSTRAINT "Price_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Price" ("id", "productId", "symbol", "value") SELECT "id", "productId", "symbol", "value" FROM "Price";
DROP TABLE "Price";
ALTER TABLE "new_Price" RENAME TO "Price";
CREATE UNIQUE INDEX "Price_productId_key" ON "Price"("productId");
CREATE TABLE "new_Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT,
    "date" DATETIME,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Order" ("date", "id", "title", "userId") SELECT "date", "id", "title", "userId" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
