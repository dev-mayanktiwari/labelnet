import { NextFunction, Request, Response } from "express";
import { asyncErrorHandler, httpError, httpResponse } from "@workspace/utils";
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

      if (!tasks) {
        return httpError(
          next,
          new Error("Failed to fetch tasks"),
          req,
          ErrorStatusCodes.SERVER_ERROR.INTERNAL_SERVER_ERROR
        );
      }

      httpResponse(
        req,
        res,
        SuccessStatusCodes.OK,
        "Tasks fetched successfully",
        {
          tasks,
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

      httpResponse(
        req,
        res,
        SuccessStatusCodes.OK,
        "Task fetched successfully",
        task
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

      console.log("Average Time Value: ", averageTimeValue);
      
      const updatedTask = await adminDbService.updateAverageTime(
        Number(taskId),
        adminId,
        averageTimeValue
      );
      console.log("Updated Task: ", updatedTask);
      httpResponse(
        req,
        res,
        SuccessStatusCodes.OK,
        "Average time calculated successfully",
        { averageTime: averageTimeValue, updatedTask }
      );
    }
  ),
};
