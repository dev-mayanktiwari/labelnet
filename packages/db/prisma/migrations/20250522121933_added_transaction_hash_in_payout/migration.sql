/*
  Warnings:

  - Added the required column `transactionHash` to the `payout` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "payout" ADD COLUMN     "transactionHash" TEXT NOT NULL;
