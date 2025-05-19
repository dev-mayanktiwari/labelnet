"use client";

import { useState } from "react";
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

export default function TasksPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data for tasks
  const tasks = [
    {
      id: "task-1",
      title: "Image Classification - Animals",
      status: "active",
      participants: 24,
      maxParticipants: 50,
      reward: 0.5,
      createdAt: "2025-05-01",
      completionRate: 48,
    },
    {
      id: "task-2",
      title: "Object Detection - Vehicles",
      status: "active",
      participants: 18,
      maxParticipants: 30,
      reward: 0.8,
      createdAt: "2025-05-03",
      completionRate: 60,
    },
    {
      id: "task-3",
      title: "Sentiment Analysis - Text",
      status: "completed",
      participants: 30,
      maxParticipants: 30,
      reward: 0.3,
      createdAt: "2025-04-28",
      completionRate: 100,
    },
    {
      id: "task-4",
      title: "Facial Recognition - Emotions",
      status: "active",
      participants: 12,
      maxParticipants: 40,
      reward: 0.6,
      createdAt: "2025-05-05",
      completionRate: 30,
    },
    {
      id: "task-5",
      title: "Product Categorization",
      status: "completed",
      participants: 25,
      maxParticipants: 25,
      reward: 0.4,
      createdAt: "2025-04-20",
      completionRate: 100,
    },
    {
      id: "task-6",
      title: "Landscape Classification",
      status: "active",
      participants: 8,
      maxParticipants: 20,
      reward: 0.7,
      createdAt: "2025-05-07",
      completionRate: 40,
    },
  ];

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeTasks = filteredTasks.filter((task) => task.status === "active");
  const completedTasks = filteredTasks.filter(
    (task) => task.status === "completed"
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
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="active" className="space-y-4 pt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4 pt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {completedTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    status: string;
    participants: number;
    maxParticipants: number;
    reward: number;
    createdAt: string;
    completionRate: number;
  };
}

function TaskCard({ task }: TaskCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{task.title}</CardTitle>
          <Badge variant={task.status === "active" ? "default" : "secondary"}>
            {task.status}
          </Badge>
        </div>
        <CardDescription>Created on {task.createdAt}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Participants</span>
            <span className="font-medium">
              {task.participants}/{task.maxParticipants}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Reward</span>
            <span className="font-medium">{task.reward} SOL</span>
          </div>
          <div className="space-y-2">
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
          </div>
          <Button variant="outline" className="w-full" asChild>
            <Link href={`/dashboard/tasks/${task.id}`}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
