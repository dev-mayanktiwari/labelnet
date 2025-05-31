/*
  Warnings:

  - You are about to alter the column `pendingAmount` on the `user` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `BigInt`.
  - You are about to alter the column `lockedAmount` on the `user` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `BigInt`.

*/
-- AlterTable
ALTER TABLE "user" ALTER COLUMN "pendingAmount" SET DEFAULT 0,
ALTER COLUMN "pendingAmount" SET DATA TYPE BIGINT,
ALTER COLUMN "lockedAmount" SET DEFAULT 0,
ALTER COLUMN "lockedAmount" SET DATA TYPE BIGINT;
