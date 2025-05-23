"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { Search, Clock, Wallet } from "lucide-react";
import Link from "next/link";

export default function TasksPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data for available tasks
  const tasks = [
    {
      id: "task-1",
      title: "Image Classification - Animals",
      description: "Classify images of animals into different categories.",
      reward: 0.5,
      estimatedTime: "2-3 min",
      category: "Classification",
      spotsLeft: 26,
      totalSpots: 50,
    },
    {
      id: "task-2",
      title: "Object Detection - Vehicles",
      description: "Identify different types of vehicles in images.",
      reward: 0.8,
      estimatedTime: "3-5 min",
      category: "Detection",
      spotsLeft: 12,
      totalSpots: 30,
    },
    {
      id: "task-3",
      title: "Facial Recognition - Emotions",
      description: "Identify emotions in facial expressions.",
      reward: 0.6,
      estimatedTime: "2-4 min",
      category: "Recognition",
      spotsLeft: 28,
      totalSpots: 40,
    },
    {
      id: "task-4",
      title: "Landscape Classification",
      description: "Classify different types of landscapes in images.",
      reward: 0.7,
      estimatedTime: "2-3 min",
      category: "Classification",
      spotsLeft: 12,
      totalSpots: 20,
    },
    {
      id: "task-5",
      title: "Product Categorization",
      description: "Categorize products in e-commerce images.",
      reward: 0.4,
      estimatedTime: "1-2 min",
      category: "Categorization",
      spotsLeft: 15,
      totalSpots: 25,
    },
    {
      id: "task-6",
      title: "Text Sentiment Analysis",
      description: "Analyze the sentiment of text snippets.",
      reward: 0.3,
      estimatedTime: "1-2 min",
      category: "Analysis",
      spotsLeft: 20,
      totalSpots: 30,
    },
  ];

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group tasks by category
  const categories = [...new Set(filteredTasks.map((task) => task.category))];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Available Tasks</h1>
        <p className="text-muted-foreground">
          Browse and complete tasks to earn SOL rewards.
        </p>
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
          {categories.map((category) => (
            <TabsTrigger key={category} value={category}>
              {category} (
              {
                filteredTasks.filter((task) => task.category === category)
                  .length
              }
              )
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="space-y-4 pt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </TabsContent>

        {categories.map((category) => (
          <TabsContent
            key={category}
            value={category}
            className="space-y-4 pt-4"
          >
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTasks
                .filter((task) => task.category === category)
                .map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    description: string;
    reward: number;
    estimatedTime: string;
    category: string;
    spotsLeft: number;
    totalSpots: number;
  };
}

function TaskCard({ task }: TaskCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{task.title}</CardTitle>
          <Badge>{task.category}</Badge>
        </div>
        <CardDescription>{task.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Reward</span>
              <span className="font-medium">{task.reward} SOL</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Time</span>
              <span className="font-medium">{task.estimatedTime}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Spots Left</span>
              <span className="font-medium">
                {task.spotsLeft}/{task.totalSpots}
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary"
                style={{
                  width: `${(task.spotsLeft / task.totalSpots) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" asChild>
          <Link href={`/tasks/${task.id}`}>Start Task</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
