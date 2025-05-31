-- AlterTable
ALTER TABLE "payout" ALTER COLUMN "amount" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "task" ALTER COLUMN "totalReward" SET DEFAULT '0',
ALTER COLUMN "totalReward" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "pendingAmount" SET DEFAULT '0',
ALTER COLUMN "pendingAmount" SET DATA TYPE TEXT,
ALTER COLUMN "lockedAmount" SET DEFAULT '0',
ALTER COLUMN "lockedAmount" SET DATA TYPE TEXT;
