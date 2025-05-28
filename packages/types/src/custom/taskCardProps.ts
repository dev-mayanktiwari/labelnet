import { Prisma, Task } from "@workspace/db";

export interface TaskCardProps {
  task: Task;
}

export type FullTask = Prisma.TaskGetPayload<{
  include: {
    options: true;
    submissions: true;
    timeAnalytics: true;
    admin: true;
  };
}>;
