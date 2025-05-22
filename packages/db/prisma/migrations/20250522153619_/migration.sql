/*
  Warnings:

  - The values [COMPLETED] on the enum `TxnStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TxnStatus_new" AS ENUM ('PENDING', 'PROCESSING', 'SUCCESS', 'FAILED', 'REFUNDED');
ALTER TABLE "payout" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "payout" ALTER COLUMN "status" TYPE "TxnStatus_new" USING ("status"::text::"TxnStatus_new");
ALTER TYPE "TxnStatus" RENAME TO "TxnStatus_old";
ALTER TYPE "TxnStatus_new" RENAME TO "TxnStatus";
DROP TYPE "TxnStatus_old";
ALTER TABLE "payout" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterTable
ALTER TABLE "payout" ADD COLUMN     "failureReason" TEXT;
