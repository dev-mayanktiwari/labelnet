"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { BarChart3, Wallet, Users, Clock } from "lucide-react";
import { TaskList } from "@/components/dashboard/task-list";
import { useEffect, useState } from "react";
import { adminService } from "@/lib/apiClient";

export default async function DashboardPage() {
  const [solSpent, setSolSpent] = useState("");
  const [totalTasks, setTotalTasks] = useState(0);
  const [userEngagement, setUserEngagement] = useState(0);

  useEffect(() => {
    async function getDashboardData() {
      try {
        const response = await adminService.getDashboardData();
        // @ts-ignore
        const { totalTasks, solSpent, userEngagement } = response.data;
        setTotalTasks(totalTasks);
        setSolSpent(solSpent);
        setUserEngagement(userEngagement);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        return {
          totalTasks: 0,
          solSpent: 0,
          userEngagement: 0,
        };
      }
    }
    getDashboardData();
  }, []);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your labeling tasks and platform activity.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTasks}</div>
            {/* <p className="text-xs text-muted-foreground">+2 from last month</p> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SOL Spent</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{solSpent} SOL</div>
            {/* <p className="text-xs text-muted-foreground">
              +5.2 SOL from last month
            </p> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              User Engagement
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userEngagement}</div>
            {/* <p className="text-xs text-muted-foreground">
              +18% from last month
            </p> */}
          </CardContent>
        </Card>
        {/* <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Completion Time
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2 min</div>
            <p className="text-xs text-muted-foreground">
              -0.3 min from last month
            </p>
          </CardContent>
        </Card> */}
      </div>

      {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Recent Tasks</CardTitle>
            <CardDescription>
              Your most recently created labeling tasks.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TaskList />
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Task Completion</CardTitle>
            <CardDescription>Completion rate of your tasks.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              Chart will be displayed here
            </div>
          </CardContent>
        </Card>
      </div> */}
    </div>
  );
}
