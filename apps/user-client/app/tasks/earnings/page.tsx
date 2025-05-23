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
import { Button } from "@workspace/ui/components/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { Badge } from "@workspace/ui/components/badge";
import { Calendar, CheckCircle, Wallet } from "lucide-react";
import { toast } from "sonner";
import { useWallet } from "@solana/wallet-adapter-react";

export default function EarningsPage() {
  const { publicKey } = useWallet();
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  // Mock data for completed tasks
  const completedTasks = [
    {
      id: "task-1",
      title: "Image Classification - Animals",
      date: "2025-05-05",
      reward: 0.5,
      status: "paid",
    },
    {
      id: "task-2",
      title: "Object Detection - Vehicles",
      date: "2025-05-04",
      reward: 0.8,
      status: "paid",
    },
    {
      id: "task-3",
      title: "Facial Recognition - Emotions",
      date: "2025-05-03",
      reward: 0.6,
      status: "paid",
    },
    {
      id: "task-4",
      title: "Landscape Classification",
      date: "2025-05-02",
      reward: 0.7,
      status: "paid",
    },
    {
      id: "task-5",
      title: "Product Categorization",
      date: "2025-05-01",
      reward: 0.4,
      status: "paid",
    },
  ];

  // Calculate total earnings
  const totalEarnings = completedTasks.reduce(
    (sum, task) => sum + task.reward,
    0
  );

  // Group tasks by date
  const tasksByDate = completedTasks.reduce(
    (acc, task) => {
      const date = task.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(task);
      return acc;
    },
    {} as Record<string, typeof completedTasks>
  );

  const handleWithdraw = () => {
    setIsWithdrawing(true);

    // Simulate withdrawal
    setTimeout(() => {
      toast.success("Withdrawal successful!", {
        description: `${totalEarnings} SOL has been sent to your wallet.`,
      });
      setIsWithdrawing(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Earnings</h1>
        <p className="text-muted-foreground">
          Track your completed tasks and earnings.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalEarnings.toFixed(1)} SOL
            </div>
            <p className="text-xs text-muted-foreground">
              ≈ ${(totalEarnings * 100).toFixed(2)} USD
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tasks Completed
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTasks.length}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Reward</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(totalEarnings / completedTasks.length).toFixed(2)} SOL
            </div>
            <p className="text-xs text-muted-foreground">Per task</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Last Completed
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTasks[0]?.date}</div>
            <p className="text-xs text-muted-foreground">
              {completedTasks[0]?.title}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Earnings History</CardTitle>
          <CardDescription>Your completed tasks and rewards.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All Time</TabsTrigger>
              <TabsTrigger value="week">This Week</TabsTrigger>
              <TabsTrigger value="month">This Month</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="space-y-4 pt-4">
              {Object.entries(tasksByDate).map(([date, tasks]) => (
                <div key={date} className="space-y-2">
                  <h3 className="font-medium">{date}</h3>
                  <div className="rounded-md border">
                    <div className="relative w-full overflow-auto">
                      <table className="w-full caption-bottom text-sm">
                        <thead>
                          <tr className="border-b transition-colors hover:bg-muted/50">
                            <th className="h-12 px-4 text-left align-middle font-medium">
                              Task
                            </th>
                            <th className="h-12 px-4 text-left align-middle font-medium">
                              Reward
                            </th>
                            <th className="h-12 px-4 text-left align-middle font-medium">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {tasks.map((task) => (
                            <tr
                              key={task.id}
                              className="border-b transition-colors hover:bg-muted/50"
                            >
                              <td className="p-4 align-middle">{task.title}</td>
                              <td className="p-4 align-middle">
                                {task.reward} SOL
                              </td>
                              <td className="p-4 align-middle">
                                <Badge variant="outline" className="capitalize">
                                  {task.status}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>
            <TabsContent value="week" className="pt-4">
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-muted-foreground">
                  Showing this week's earnings.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="month" className="pt-4">
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-muted-foreground">
                  Showing this month's earnings.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            onClick={handleWithdraw}
            disabled={isWithdrawing}
          >
            {isWithdrawing ? "Processing..." : "Withdraw All Earnings"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
