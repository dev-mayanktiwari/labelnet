/*
  Warnings:

  - You are about to alter the column `amount` on the `payout` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `BigInt`.
  - You are about to alter the column `totalReward` on the `task` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `BigInt`.

*/
-- AlterTable
ALTER TABLE "payout" ALTER COLUMN "amount" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "task" ALTER COLUMN "totalReward" SET DEFAULT 0,
ALTER COLUMN "totalReward" SET DATA TYPE BIGINT;
