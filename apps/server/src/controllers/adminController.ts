import { NextFunction, Request, Response } from "express";
import {
  asyncErrorHandler,
  httpError,
  httpResponse,
  SolanaAmountUtils,
} from "@workspace/utils";
import quicker from "../utils/quicker";
import { ErrorStatusCodes, SuccessStatusCodes } from "@workspace/constants";
import {
  AuthenticatedRequest,
  TaskSubmissionParamsSchema,
  TaskSubmissionSchema,
} from "@workspace/types";
import { adminDbService } from "../services/adminDbServices";

export default {
  getPreSignedUrl: asyncErrorHandler(async (req: Request, res: Response) => {
    const preSignedUrl = await quicker.generatePresignedUrl();
    httpResponse(req, res, SuccessStatusCodes.OK, "Data Generated", {
      timestamp: preSignedUrl.timestamp,
      signature: preSignedUrl.signature,
    });
  }),

  createTask: asyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const body = req.body;
      const params = req.params;

      const paramsSafeparse = TaskSubmissionParamsSchema.safeParse(params);

      if (!paramsSafeparse.success) {
        return httpError(
          next,
          new Error("Invalid request params"),
          req,
          ErrorStatusCodes.CLIENT_ERROR.BAD_REQUEST,
          paramsSafeparse.error.flatten()
        );
      }

      const safeParse = TaskSubmissionSchema.safeParse(body);

      if (!safeParse.success) {
        return httpError(
          next,
          new Error("Invalid request body"),
          req,
          ErrorStatusCodes.CLIENT_ERROR.BAD_REQUEST,
          safeParse.error.flatten()
        );
      }

      const task = adminDbService.createTask(
        safeParse.data,
        paramsSafeparse.data,
        (req as AuthenticatedRequest).id
      );

      if (!task) {
        return httpError(
          next,
          new Error("Failed to create task"),
          req,
          ErrorStatusCodes.SERVER_ERROR.INTERNAL_SERVER_ERROR
        );
      }

      httpResponse(
        req,
        res,
        SuccessStatusCodes.CREATED,
        "Task created successfully",
        task
      );
    }
  ),

  getAllTasks: asyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const adminId = (req as AuthenticatedRequest).id;
      const tasks = await adminDbService.getAllTasks(adminId);
      // console.log("Tasks fetched: ", tasks);
      if (!tasks) {
        return httpError(
          next,
          new Error("Failed to fetch tasks"),
          req,
          ErrorStatusCodes.SERVER_ERROR.INTERNAL_SERVER_ERROR
        );
      }

      const frontendTasks = tasks.map((task) => ({
        ...task,
        totalReward: SolanaAmountUtils.lamportsToSolStringFrontend(
          task.totalReward
        ),
      }));

      // console.log("Frontend Tasks: ", frontendTasks);

      httpResponse(
        req,
        res,
        SuccessStatusCodes.OK,
        "Tasks fetched successfully",
        {
          tasks: frontendTasks,
        }
      );
    }
  ),

  pauseTask: asyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const taskId = req.params.taskId;
      const adminId = (req as AuthenticatedRequest).id;

      const task = await adminDbService.pauseTask(Number(taskId), adminId);

      if (!task) {
        return httpError(
          next,
          new Error("Failed to pause task"),
          req,
          ErrorStatusCodes.SERVER_ERROR.INTERNAL_SERVER_ERROR
        );
      }

      httpResponse(
        req,
        res,
        SuccessStatusCodes.OK,
        "Task paused successfully",
        task
      );
    }
  ),

  getTask: asyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const taskId = req.params.taskId;
      const adminId = (req as AuthenticatedRequest).id;

      const task = await adminDbService.getTask(Number(taskId), adminId);

      if (!task) {
        return httpError(
          next,
          new Error("Failed to fetch task"),
          req,
          ErrorStatusCodes.SERVER_ERROR.INTERNAL_SERVER_ERROR
        );
      }

      const taskFrontend = {
        ...task,
        totalReward: SolanaAmountUtils.lamportsToSolStringFrontend(
          task.totalReward
        ),
      };
      httpResponse(
        req,
        res,
        SuccessStatusCodes.OK,
        "Task fetched successfully",
        {
          task: taskFrontend,
        }
      );
    }
  ),

  calculateAverageTime: asyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      // TODO: Validate taskId parameter
      const taskId = req.params.taskId;
      const adminId = (req as AuthenticatedRequest).id;
      let totalTimeValue = 0;
      let averageTimeValue = 0;
      const averageTime = await adminDbService.getTask(Number(taskId), adminId);

      if (!averageTime) {
        return httpError(
          next,
          new Error("Failed to calculate average time"),
          req,
          ErrorStatusCodes.SERVER_ERROR.INTERNAL_SERVER_ERROR
        );
      }

      if (averageTime.timeAnalytics.length === 0) {
        totalTimeValue = 0;
      } else {
        averageTime.timeAnalytics.map((time, index) => {
          totalTimeValue += time.timeTaken;
        });
        averageTimeValue = totalTimeValue / averageTime.timeAnalytics.length;
      }

      // console.log("Average Time Value: ", averageTimeValue);

      const updatedTask = await adminDbService.updateAverageTime(
        Number(taskId),
        adminId,
        averageTimeValue
      );
      // console.log("Updated Task: ", updatedTask);
      const updatedTaskFrontend = {
        ...updatedTask,
        totalReward: SolanaAmountUtils.lamportsToSolStringFrontend(
          updatedTask.totalReward
        ),
      };
      httpResponse(
        req,
        res,
        SuccessStatusCodes.OK,
        "Average time calculated successfully",
        { averageTime: averageTimeValue, updatedTask: updatedTaskFrontend }
      );
    }
  ),

  dashboard: asyncErrorHandler(async (req: Request, res: Response) => {
    // TODO: Validate adminId from request
    const adminId = (req as AuthenticatedRequest).id;
    const dashboardData = await adminDbService.getAllTasks(adminId);

    // TODO: Handle the case for average time calculation
    let totalTasks = 0;
    let userEngagement = 0;
    // let avgTime = 0;
    let solSpent = "0";

    if (dashboardData.length === 0) {
      return httpResponse(req, res, SuccessStatusCodes.OK, "No tasks found", {
        totalTasks: totalTasks,
        solSpent: SolanaAmountUtils.lamportsToSolStringFrontend(solSpent),
        userEngagement: userEngagement,
        // avgTime: avgTime,
      });
    }

    totalTasks = dashboardData.length;
    solSpent = dashboardData.reduce(
      (acc, task) => SolanaAmountUtils.addLamports(acc, task.totalReward),
      "0"
    );
    userEngagement = dashboardData.reduce(
      (acc, task) => acc + task.submissions.length,
      0
    );
    const totalSolSpent =
      SolanaAmountUtils.lamportsToSolStringFrontend(solSpent);
    // avgTime = dashboardData.reduce((acc, task) => acc + task.averageTime!, 0);
    // avgTime = avgTime / totalTasks;

    httpResponse(
      req,
      res,
      SuccessStatusCodes.OK,
      "Dashboard data fetched successfully",
      {
        totalTasks,
        solSpent: totalSolSpent,
        userEngagement,
        // avgTime,
      }
    );
  }),
};
