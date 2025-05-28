"use server";

import { adminService } from "@/lib/apiClient";

export async function getDashboardData() {
  try {
    const response = await adminService.getDashboardData();
    // @ts-ignore
    const { totalTasks, solSpent, userEngagement } = response.data;
    return {
      totalTasks,
      solSpent,
      userEngagement,
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return {
      totalTasks: 0,
      solSpent: 0,
      userEngagement: 0,
    };
  }
}
