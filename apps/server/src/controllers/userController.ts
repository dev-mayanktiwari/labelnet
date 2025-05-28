import { NextFunction, Request, Response } from "express";
import { asyncErrorHandler, httpError, httpResponse } from "@workspace/utils";
import {
  ErrorStatusCodes,
  ResponseMessage,
  SuccessStatusCodes,
} from "@workspace/constants";
import {
  AuthenticatedRequest,
  PayoutSchema,
  ResponseSubmissionSchema,
} from "@workspace/types";
import { userDbService } from "../services/userDbServices";
import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { AppConfig } from "../config";
import { payoutService } from "../services/payoutDbService";
import { solanaService } from "../services/solanaService";
const bs58 = require("bs58").default;

export default {
  getNextTask: asyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = (req as AuthenticatedRequest).id;
      const task = await userDbService.getNextTask(userId);
      if (!task) {
        return httpError(
          next,
          new Error("No task found"),
          req,
          ErrorStatusCodes.CLIENT_ERROR.NOT_FOUND
        );
      }
      httpResponse(req, res, SuccessStatusCodes.OK, "Next Task", task);
    }
  ),

  getAllTasks: asyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = (req as AuthenticatedRequest).id;

      const doneTasks = await userDbService.getDoneTasks(userId);
      const undoneTasks = await userDbService.getUndoneTasks(userId);

      if (doneTasks.length === 0 && undoneTasks.length === 0) {
        return httpError(
          next,
          new Error("No tasks found"),
          req,
          ErrorStatusCodes.CLIENT_ERROR.NOT_FOUND
        );
      }

      httpResponse(req, res, SuccessStatusCodes.OK, "All Tasks", {
        doneTasks,
        undoneTasks,
      });
    }
  ),

  submitResponse: asyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      console.log("Submitting response for user...");
      const userId = (req as AuthenticatedRequest).id;
      console.log("User ID:", userId);
      const body = req.body;
      const safeParse = ResponseSubmissionSchema.safeParse(body);

      if (!safeParse.success) {
        return httpError(
          next,
          new Error("Invalid request body"),
          req,
          ErrorStatusCodes.CLIENT_ERROR.BAD_REQUEST,
          safeParse.error.flatten()
        );
      }

      const txnResponse = await userDbService.submitResponse(
        safeParse.data,
        userId
      );

      console.log("Transaction response:", txnResponse);

      const nextTask = userDbService.getNextTask(userId);

      return httpResponse(
        req,
        res,
        SuccessStatusCodes.OK,
        "Response submmitted successfully.",
        {
          nextTask,
        }
      );
    }
  ),

  payout: asyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const body = req.body;
      const safeParse = PayoutSchema.safeParse(body);

      if (!safeParse.success) {
        return httpError(
          next,
          new Error("Invalid input"),
          req,
          ErrorStatusCodes.CLIENT_ERROR.BAD_REQUEST,
          safeParse.error.flatten()
        );
      }

      const userId = (req as AuthenticatedRequest).id;
      const amount = safeParse.data.amount;
      const user = await userDbService.findUser(userId);

      if (!user) {
        return httpError(
          next,
          new Error(ResponseMessage.NOT_FOUND),
          req,
          ErrorStatusCodes.CLIENT_ERROR.NOT_FOUND
        );
      }

      const payout = await payoutService.createPayout(userId, amount);

      try {
        const userPublicKey = user.walletAddress;
        const privateKeyAdmin = new Uint8Array(
          bs58.decode(String(AppConfig.get("ADMIN_PRIVATE_KEY")))
        );
        const adminAccount = Keypair.fromSecretKey(privateKeyAdmin);

        const transaction = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey: adminAccount.publicKey,
            toPubkey: new PublicKey(userPublicKey),
            lamports: safeParse.data.amount * LAMPORTS_PER_SOL,
          })
        );

        const signature = await solanaService.sendTransaction(transaction, [
          adminAccount,
        ]);

        await payoutService.updatePayoutWithTransaction(
          payout.payoutId,
          signature
        );

        return httpResponse(
          req,
          res,
          SuccessStatusCodes.OK,
          "Payout initiated successfully.",
          {
            payoutId: payout.payoutId,
            transactionHash: signature,
          }
        );
      } catch (error) {
        console.error("Error processing payout:", error);
        await payoutService.failPayout(
          payout.payoutId,
          "Failed to process payout."
        );
        return httpError(
          next,
          new Error("Failed to process payout."),
          req,
          ErrorStatusCodes.SERVER_ERROR.INTERNAL_SERVER_ERROR
        );
      }
    }
  ),

  getPayoutAmoutn: asyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = (req as AuthenticatedRequest).id;
      const user = await userDbService.findUser(userId);

      if (!user) {
        return httpError(
          next,
          new Error(ResponseMessage.NOT_FOUND),
          req,
          ErrorStatusCodes.CLIENT_ERROR.NOT_FOUND
        );
      }

      const payoutAmount = await user.pendingAmount;

      httpResponse(req, res, SuccessStatusCodes.OK, "Payout Amount", {
        payoutAmount,
      });
    }
  ),
  
  getTaskById: asyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = (req as AuthenticatedRequest).id;
      const taskId = req.params.taskId;

      const task = await userDbService.getTaskById(userId, Number(taskId));

      if (!task) {
        return httpError(
          next,
          new Error("Task not found"),
          req,
          ErrorStatusCodes.CLIENT_ERROR.NOT_FOUND
        );
      }

      httpResponse(req, res, SuccessStatusCodes.OK, "Task details", { task });
    }
  ),
};
