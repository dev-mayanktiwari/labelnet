import { NextFunction, Request, Response } from "express";
import {
  asyncErrorHandler,
  httpError,
  httpResponse,
  SolanaAmountUtils,
} from "@workspace/utils";
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
import { SolanaService, solanaService } from "../services/solanaService";
import quicker from "../utils/quicker";
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

      const frontendTask = {
        ...task,
        totalReward: SolanaAmountUtils.lamportsToSolStringFrontend(
          task.totalReward
        ),
      };

      httpResponse(req, res, SuccessStatusCodes.OK, "Next Task", {
        task: frontendTask,
      });
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

      const doneTasksFrontend = doneTasks.map((task) => ({
        ...task,
        totalReward: SolanaAmountUtils.lamportsToSolStringFrontend(
          task.totalReward
        ),
      }));
      const undoneTasksFrontend = undoneTasks.map((task) => ({
        ...task,
        totalReward: SolanaAmountUtils.lamportsToSolStringFrontend(
          task.totalReward
        ),
      }));

      httpResponse(req, res, SuccessStatusCodes.OK, "All Tasks", {
        doneTasks: doneTasksFrontend,
        undoneTasks: undoneTasksFrontend,
      });
    }
  ),

  submitResponse: asyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      // console.log("Submitting response for user...");
      const userId = (req as AuthenticatedRequest).id;
      // console.log("User ID:", userId);
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

      // console.log("Transaction response:", txnResponse);

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
      // TODO You have to validate the amount if it is coming from frontend to the amount string in database
      // FOR NOW, we are just payouting the whole amount, irrespective of the amount coming from frontend / reques
      // const safeParse = PayoutSchema.safeParse(body);

      // if (!safeParse.success) {
      //   return httpError(
      //     next,
      //     new Error("Invalid input"),
      //     req,
      //     ErrorStatusCodes.CLIENT_ERROR.BAD_REQUEST,
      //     safeParse.error.flatten()
      //   );
      // }

      const userId = (req as AuthenticatedRequest).id;
      const user = await userDbService.findUser(userId);
      const amount = user?.pendingAmount; // Use the pending amount directly from the user object

      if (!user) {
        return httpError(
          next,
          new Error(ResponseMessage.NOT_FOUND),
          req,
          ErrorStatusCodes.CLIENT_ERROR.NOT_FOUND
        );
      }

      const { updatedUser, payout } = await payoutService.createPayout(
        userId,
        amount!
      );
      // console.log(
      //   "Updated user after payout creation: pending and locked",
      //   updatedUser.pendingAmount,
      //   updatedUser.lockedAmount
      // );
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
            lamports: parseInt(amount!),
          })
        );

        const signature = await solanaService.sendTransaction(transaction, [
          adminAccount,
        ]);

        // console.log("Transaction signature:", signature);
        const updatedPayout = await payoutService.updatePayoutWithTransaction(
          payout.payoutId,
          signature
        );

        // console.log("Updated payout:", updatedPayout);
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
        // await payoutService.failPayout(
        //   payout.payoutId,
        //   "Failed to process payout."
        // );
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

      const apiPayoutAmount = await user.pendingAmount;
      const payoutAmount =
        SolanaAmountUtils.lamportsToSolStringFrontend(apiPayoutAmount);

      httpResponse(req, res, SuccessStatusCodes.OK, "Payout Amount", {
        payoutAmount,
        apiPayoutAmount,
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

      let rewardPerTask = SolanaAmountUtils.divideLamports(
        task?.totalReward,
        task?.maxParticipants
      );
      
      rewardPerTask = SolanaAmountUtils.lamportsToSolStringFrontend(rewardPerTask);

      httpResponse(req, res, SuccessStatusCodes.OK, "Task details", {
        task,
        rewardPerTask,
      });
    }
  ),
};
