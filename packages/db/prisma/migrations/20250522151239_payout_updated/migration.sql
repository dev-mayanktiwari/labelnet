/*
  Warnings:

  - Added the required column `updatedAt` to the `payout` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "payout" ADD COLUMN     "blockChainConfirmation" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "processedAt" TIMESTAMP(3),
ADD COLUMN     "retryCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
