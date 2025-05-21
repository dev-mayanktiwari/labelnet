-- CreateTable
CREATE TABLE "time_analytics" (
    "id" SERIAL NOT NULL,
    "timeTaken" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "taskId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "time_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "time_analytics_userId_taskId_key" ON "time_analytics"("userId", "taskId");

-- AddForeignKey
ALTER TABLE "time_analytics" ADD CONSTRAINT "time_analytics_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "time_analytics" ADD CONSTRAINT "time_analytics_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "task"("taskId") ON DELETE RESTRICT ON UPDATE CASCADE;
