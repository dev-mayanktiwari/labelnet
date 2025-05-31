import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";
import {
  TTaskSubmissionSchema,
  TUserRegistrationInput,
} from "@workspace/types";
// Create a base axios instance
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:6969/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Generic API request function
export const apiRequest = async <T>(config: AxiosRequestConfig): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await apiClient(config);
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      // Extract error message from API response if available
      const errorMessage = error.response?.data?.message || error.message;
      throw new Error(errorMessage);
    }
    throw error;
  }
};

// API service functions
export const authService = {
  signup: (userData: TUserRegistrationInput) =>
    apiRequest({
      method: "POST",
      url: "/auth/register",
      data: userData,
    }),
  authCheck: () =>
    apiRequest({
      method: "GET",
      url: "/auth/auth-check",
    }),
  getNonce: () =>
    apiRequest({
      method: "GET",
      url: "/auth/get-nonce",
    }),
  logOut: () =>
    apiRequest({
      method: "POST",
      url: "/auth/logout",
    }),
};

export const adminService = {
  getPresignedURL: () =>
    apiRequest({
      method: "GET",
      url: "/admin/generate-presigned-url",
    }),
  createTask: (taskData: TTaskSubmissionSchema, params: string) =>
    apiRequest({
      method: "POST",
      url: `/admin/create-task/${params}`,
      data: taskData,
    }),
  getAllTasks: () =>
    apiRequest({
      method: "GET",
      url: "/admin/get-all-tasks",
    }),
  getTask: (taskId: number) =>
    apiRequest({
      method: "GET",
      url: `/admin/get-task/${taskId}`,
    }),
  getAverageTimeTask: (taskId: number) =>
    apiRequest({
      method: "GET",
      url: `/admin/get-average-time/${taskId}`,
    }),
  getDashboardData: () =>
    apiRequest({
      method: "GET",
      url: "/admin/dashboard",
    }),
  pauseTask: (taskId: number) =>
    apiRequest({
      method: "POST",
      url: `/admin/pause-task/${taskId}`,
    }),
};

export default apiClient;
