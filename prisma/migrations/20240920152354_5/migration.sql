/*
  Warnings:

  - Added the required column `isRecomendation` to the `Menu` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Menu" ADD COLUMN     "isRecomendation" BOOLEAN NOT NULL,
ALTER COLUMN "price" SET DATA TYPE DOUBLE PRECISION;
