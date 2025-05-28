"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Eye, Search, Plus } from "lucide-react";
import Link from "next/link";
import { Input } from "@workspace/ui/components/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { adminService } from "@/lib/apiClient";
import { TaskCardProps } from "@workspace/types";
import { formatDate } from "@workspace/ui/lib/utils";

export default function TasksPage() {
  type task = TaskCardProps["task"];
  const [searchQuery, setSearchQuery] = useState("");
  const [tasks, setTasks] = useState<task[]>([]);

  // Fetch tasks from the API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await adminService.getAllTasks();
        // @ts-ignore
        setTasks(response.data.tasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  const filteredTasks = tasks?.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeTasks = filteredTasks?.filter((task) => task.isActive === true);
  const completedTasks = filteredTasks.filter(
    (task) => task.isActive === false
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Tasks</h1>
          <p className="text-muted-foreground">
            View and manage your labeling tasks.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/create-task">
            <Plus className="mr-2 h-4 w-4" />
            Create Task
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search tasks..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">
            All Tasks ({filteredTasks.length})
          </TabsTrigger>
          <TabsTrigger value="active">
            Active ({activeTasks.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedTasks.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 pt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTasks.map((task) => (
              <TaskCard key={task.taskId} task={task} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="active" className="space-y-4 pt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeTasks.map((task) => (
              <TaskCard key={task.taskId} task={task} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4 pt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {completedTasks.map((task) => (
              <TaskCard key={task.taskId} task={task} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function TaskCard({ task }: TaskCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{task.title}</CardTitle>
          <Badge variant={task.isActive === true ? "default" : "secondary"}>
            {task.isActive === true ? "Active" : "Completed"}
          </Badge>
        </div>
        <CardDescription>
          Created on {formatDate(task.createdAt)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Participants</span>
            <span className="font-medium">
              {task.filledParticipants}/{task.maxParticipants}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Reward</span>
            <span className="font-medium">{task.totalReward} SOL</span>
          </div>
          {/* <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Completion</span>
              <span className="font-medium">{task.completionRate}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${task.completionRate}%` }}
              />
            </div>
          </div> */}
          <Button variant="outline" className="w-full" asChild>
            <Link href={`/dashboard/tasks/${task.taskId}`}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
