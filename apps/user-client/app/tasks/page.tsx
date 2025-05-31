"use client";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
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
import { FullTask, TaskCardProps } from "@workspace/types";
import { userService } from "@/lib/apiClient";

export default function TasksPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [completedTasks, setCompletedTasks] = useState<FullTask[]>([]);
  const [pendingTasks, setPendingTasks] = useState<FullTask[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await userService.getAllTask();
        // @ts-ignore
        setCompletedTasks(response.data.doneTasks || []);
        // @ts-ignore
        setPendingTasks(response.data.undoneTasks || []);
        // @ts-ignore
        // console.log("Fetched tasks:", response.data.tasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchTasks();
  }, []); // Added dependency array

  // Combine all tasks for filtering
  const allTasks = [...completedTasks, ...pendingTasks];

  const filteredTasks = allTasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter tasks by completion status
  const filteredCompletedTasks = completedTasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPendingTasks = pendingTasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <TabsTrigger value="all">All Tasks ({allTasks.length})</TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedTasks.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({pendingTasks.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 pt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTasks.map((task) => (
              <TaskCard key={task.taskId} task={task} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4 pt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredCompletedTasks.map((task) => (
              <TaskCard key={task.taskId} task={task} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4 pt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredPendingTasks.map((task) => (
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
          {/* <Badge>{task.category}</Badge> */}
        </div>
        <CardDescription>{task.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Reward</span>
              <span className="font-medium">{task.totalReward} SOL</span>
            </div>
            {/* <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Time</span>
              <span className="font-medium">{task.estimatedTime}</span>
            </div> */}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Spots Left</span>
              <span className="font-medium">
                {task.filledParticipants}/{task.maxParticipants}
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary"
                style={{
                  width: `${(task.filledParticipants / task.maxParticipants) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" asChild>
          <Link href={`/tasks/${task.taskId}`}>Start Task</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
