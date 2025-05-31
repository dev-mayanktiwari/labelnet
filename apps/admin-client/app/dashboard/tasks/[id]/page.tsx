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
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Progress } from "@workspace/ui/components/progress";
import {
  ArrowLeft,
  Download,
  Users,
  Clock,
  Wallet,
  PauseCircle,
  PlayCircle,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { adminService } from "@/lib/apiClient";
import type { FullTask } from "@workspace/types";
import { formatDate } from "@workspace/ui/lib/utils";
import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { toast } from "sonner";

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

export default function TaskDetailsPage() {
  const params = useParams();
  const taskId = params.id as string;
  const [task, setTask] = useState<FullTask | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!taskId) {
      console.error("Task ID is required to fetch task details.");
      return;
    }

    const fetchTaskDetails = async () => {
      try {
        setIsLoading(true);
        const response = await adminService.getAverageTimeTask(Number(taskId));
        // @ts-ignore
        setTask(response.data.updatedTask);
      } catch (error) {
        console.error("Error fetching task details:", error);
        toast.error("Error", {
          description: "Failed to load task details. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTaskDetails();
  }, [taskId]);

  // Function to handle pausing/resuming task
  const handleToggleTaskStatus = async () => {
    if (!task) return;

    try {
      setIsLoading(true);
      await adminService.pauseTask(Number(taskId));
      setTask({
        ...task,
        isActive: !task.isActive,
      });

      toast.success("Success", {
        description: `Task ${task.isActive ? "paused" : "resumed"} successfully.`,
      });
    } catch (error) {
      console.error("Error toggling task status:", error);
      toast.error("Error", {
        description: "Failed to update task status. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate completion rate
  const completionRate = task
    ? Math.round((task.filledParticipants / task.maxParticipants) * 100)
    : 0;

  // Prepare data for option votes visualization
  const optionVotesData = useMemo(() => {
    if (!task) return null;

    // Count votes for each option
    const optionVotes = task.options.map((option) => {
      const votes = task.submissions.filter(
        (sub) => sub.optionId === option.id
      ).length;
      return {
        optionId: option.id,
        url: option.url,
        votes,
      };
    });

    // Prepare data for charts
    const labels = optionVotes.map((_, index) => `Option ${index + 1}`);
    const data = optionVotes.map((option) => option.votes);
    const backgroundColors = [
      "rgba(255, 99, 132, 0.6)",
      "rgba(54, 162, 235, 0.6)",
      "rgba(255, 206, 86, 0.6)",
      "rgba(75, 192, 192, 0.6)",
      "rgba(153, 102, 255, 0.6)",
      "rgba(255, 159, 64, 0.6)",
    ];

    return {
      optionVotes,
      chartData: {
        labels,
        datasets: [
          {
            label: "Votes",
            data,
            backgroundColor: backgroundColors.slice(0, data.length),
            borderColor: backgroundColors.map((color) =>
              color.replace("0.6", "1")
            ),
            borderWidth: 1,
          },
        ],
      },
    };
  }, [task]);

  if (!task && !isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Task not found or failed to load.</p>
      </div>
    );
  }

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
          {task?.isActive === true ? "Active" : "Paused"}
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
                    key={option.id}
                    className="relative aspect-square rounded-md border bg-muted"
                  >
                    <Image
                      src={option.url || "/placeholder.svg"}
                      alt={`Task image ${index + 1}`}
                      fill
                      className="rounded-md object-cover"
                    />
                    {optionVotesData && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-center py-1 text-sm">
                        {optionVotesData?.optionVotes[index]?.votes} votes
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* <div className="flex flex-col gap-4 sm:flex-row">
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export Results
              </Button>
            </div> */}
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
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Completion
                </span>
                <span className="font-medium">{completionRate}%</span>
              </div>
              <Progress value={completionRate} />
            </div>

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
                  <p className="font-medium">
                    {task?.averageTime
                      ? `${(task.averageTime / 1000).toFixed(1)} sec`
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* <div className="pt-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={handleToggleTaskStatus}
                disabled={task?.isActive}
              >
                <PauseCircle className="mr-2 h-4 w-4" />
                {task?.isActive ? "Pause Task" : "Task Already Paused"}
              </Button>
            </div> */}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Results Visualization</CardTitle>
          <CardDescription>
            Visual breakdown of user submissions by option.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {optionVotesData ? (
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="text-sm font-medium mb-4 text-center">
                  Distribution of Votes
                </h3>
                <div className="h-64">
                  <Doughnut
                    data={optionVotesData.chartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: "bottom",
                        },
                        tooltip: {
                          callbacks: {
                            label: (context) => {
                              const label = context.label || "";
                              const value = context.raw || 0;
                              const total = context.dataset.data.reduce(
                                (a: number, b: number) => a + b,
                                0
                              );
                              const percentage =
                                total > 0
                                  ? Math.round(
                                      ((value as number) / total) * 100
                                    )
                                  : 0;
                              return `${label}: ${value} votes (${percentage}%)`;
                            },
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-4 text-center">
                  Votes by Option
                </h3>
                <div className="h-64">
                  <Bar
                    data={optionVotesData.chartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            precision: 0,
                          },
                          title: {
                            display: true,
                            text: "Number of Votes",
                          },
                        },
                        x: {
                          title: {
                            display: true,
                            text: "Options",
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-muted-foreground">
                No submission data available yet.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {task?.timeAnalytics && task.timeAnalytics.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Time Analytics</CardTitle>
            <CardDescription>
              Time taken by users to complete this task.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead>
                    <tr className="border-b transition-colors hover:bg-muted/50">
                      <th className="h-12 px-4 text-left align-middle font-medium">
                        User
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium">
                        Time Taken
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {task.timeAnalytics.map((analytic) => (
                      <tr
                        key={analytic.id}
                        className="border-b transition-colors hover:bg-muted/50"
                      >
                        <td className="p-4 align-middle">{analytic.userId}</td>
                        <td className="p-4 align-middle">
                          {(analytic.timeTaken / 1000).toFixed(1)} sec
                        </td>
                        <td className="p-4 align-middle">
                          {formatDate(analytic.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
