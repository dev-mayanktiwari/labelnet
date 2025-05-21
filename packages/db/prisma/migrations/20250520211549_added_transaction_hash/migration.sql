/*
  Warnings:

  - You are about to drop the column `usersNeeded` on the `task` table. All the data in the column will be lost.
  - Added the required column `trasactionHash` to the `task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "task" DROP COLUMN "usersNeeded",
ADD COLUMN     "maxParticipants" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "trasactionHash" TEXT NOT NULL;
