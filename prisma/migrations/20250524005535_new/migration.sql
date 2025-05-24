/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `licenseNumber` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `rentalDays` on the `Order` table. All the data in the column will be lost.
  - Added the required column `driversLicenseNumber` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderDate` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rentalPeriod` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "customerName" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "driversLicenseNumber" TEXT NOT NULL,
    "carVin" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "rentalPeriod" INTEGER NOT NULL,
    "totalPrice" REAL NOT NULL,
    "orderDate" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    CONSTRAINT "Order_carVin_fkey" FOREIGN KEY ("carVin") REFERENCES "Car" ("vin") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Order" ("carVin", "customerName", "email", "id", "phoneNumber", "startDate", "status", "totalPrice") SELECT "carVin", "customerName", "email", "id", "phoneNumber", "startDate", "status", "totalPrice" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
