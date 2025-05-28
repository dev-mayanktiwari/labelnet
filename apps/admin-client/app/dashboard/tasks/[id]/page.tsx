"use client";
import { useParams } from "next/navigation";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { ArrowLeft, Download, Users, Clock, Wallet } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { adminService } from "@/lib/apiClient";
import { FullTask } from "@workspace/types";
import { formatDate } from "@workspace/ui/lib/utils";

export default function TaskDetailsPage() {
  const params = useParams();
  const taskId = params.id as string;
  const [task, setTask] = useState<FullTask | null>(null);

  useEffect(() => {
    // This effect can be used to fetch task details based on taskId
    // For now, we are using mock data

    if (!taskId) {
      console.error("Task ID is required to fetch task details.");
      return;
    }
    const fetchTaskDetails = async () => {
      try {
        // Replace with actual API call
        const response = await adminService.getAverageTimeTask(Number(taskId));
        // @ts-ignore
        console.log("Fetched task details:", response.data);
        // @ts-ignore
        setTask(response.data.updatedTask);
      } catch (error) {
        console.error("Error fetching task details:", error);
      }
    };

    fetchTaskDetails();
  }, [taskId]);

  // Mock task data
  // const task = {
  //   id: taskId,
  //   title: "Image Classification - Animals",
  //   description:
  //     "Classify the following images into categories: mammal, bird, reptile, amphibian, fish, or insect.",
  //   status: "active",
  //   participants: 24,
  //   maxParticipants: 50,
  //   reward: 0.5,
  //   createdAt: "2025-05-01",
  //   completionRate: 48,
  //   totalSpent: 12.0,
  //   averageTime: "1.2 min",
  //   images: [
  //     "/placeholder.svg?height=200&width=200&text=Image 1",
  //     "/placeholder.svg?height=200&width=200&text=Image 2",
  //     "/placeholder.svg?height=200&width=200&text=Image 3",
  //     "/placeholder.svg?height=200&width=200&text=Image 4",
  //   ],
  //   submissions: [
  //     {
  //       id: "sub1",
  //       user: "User1",
  //       timestamp: "2025-05-05 14:32",
  //       status: "completed",
  //     },
  //     {
  //       id: "sub2",
  //       user: "User2",
  //       timestamp: "2025-05-05 15:10",
  //       status: "completed",
  //     },
  //     {
  //       id: "sub3",
  //       user: "User3",
  //       timestamp: "2025-05-05 16:45",
  //       status: "completed",
  //     },
  //     {
  //       id: "sub4",
  //       user: "User4",
  //       timestamp: "2025-05-06 09:22",
  //       status: "completed",
  //     },
  //     {
  //       id: "sub5",
  //       user: "User5",
  //       timestamp: "2025-05-06 10:15",
  //       status: "completed",
  //     },
  //   ],
  // };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/tasks">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">{task?.title}</h1>
        <Badge variant={task?.isActive === true ? "default" : "secondary"}>
          {task?.isActive === true ? "Active" : "Completed"}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Task Details</CardTitle>
            <CardDescription>
              Information about this labeling task.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold">Description</h3>
              <p className="mt-2 text-muted-foreground">{task?.description}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Images</h3>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {task?.options.map((option, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-md border bg-muted"
                  >
                    <Image
                      src={option.url || "/placeholder.svg"}
                      alt={`Task image ${index + 1}`}
                      fill
                      className="rounded-md object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export Results
              </Button>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Download Images
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Task Stats</CardTitle>
            <CardDescription>
              Performance metrics for this task.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Completion
                </span>
                <span className="font-medium">{task.completionRate}%</span>
              </div>
              <Progress value={task.completionRate} />
            </div> */}

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Participants</p>
                  <p className="font-medium">
                    {task?.filledParticipants}/{task?.maxParticipants}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                  <Wallet className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                  <p className="font-medium">{task?.totalReward} SOL</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Average Time</p>
                  <p className="font-medium">{task?.averageTime}</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button variant="outline" className="w-full">
                {task?.isActive === true ? "Pause Task" : "Resume Task"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Submissions</CardTitle>
          <CardDescription>User submissions for this task.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="pt-4">
              <div className="rounded-md border">
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead>
                      <tr className="border-b transition-colors hover:bg-muted/50">
                        <th className="h-12 px-4 text-left align-middle font-medium">
                          User
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium">
                          Timestamp
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium">
                          Status
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium">
                          Reward
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {task?.submissions.map((submission) => (
                        <tr
                          key={submission?.submissionId}
                          className="border-b transition-colors hover:bg-muted/50"
                        >
                          <td className="p-4 align-middle">
                            {submission?.userId}
                          </td>
                          <td className="p-4 align-middle">
                            {formatDate(submission?.submittedAt)}
                          </td>
                          {/* <td className="p-4 align-middle">
                            {task.reward} SOL
                          </td> */}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="completed" className="pt-4">
              <div className="rounded-md border">
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead>
                      <tr className="border-b transition-colors hover:bg-muted/50">
                        <th className="h-12 px-4 text-left align-middle font-medium">
                          User
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium">
                          Timestamp
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium">
                          Status
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium">
                          Reward
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {task?.submissions.map((submission) => (
                        <tr
                          key={submission.submissionId}
                          className="border-b transition-colors hover:bg-muted/50"
                        >
                          <td className="p-4 align-middle">
                            {submission.userId}
                          </td>
                          <td className="p-4 align-middle">
                            {formatDate(submission.submittedAt)}
                          </td>
                          {/* <td className="p-4 align-middle">
                            <Badge variant="outline">{submission.s}</Badge>
                          </td> */}
                          {/* <td className="p-4 align-middle">
                            {task.to} SOL
                          </td> */}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="pending" className="pt-4">
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-muted-foreground">No pending submissions.</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
