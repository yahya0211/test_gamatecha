/*
  Warnings:

  - Added the required column `address` to the `Cafe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `Cafe` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cafe" ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "phoneNumber" TEXT NOT NULL;
