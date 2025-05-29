import { NextFunction, Request, Response } from "express";
import { asyncErrorHandler, httpError, httpResponse } from "@workspace/utils";
import {
  ResponseMessage,
  SuccessStatusCodes,
  ErrorStatusCodes,
} from "@workspace/constants";
import quicker from "../utils/quicker";
import { UserRegisterInput } from "@workspace/types";
import { userDbService } from "../services/userDbServices";
import { AppConfig } from "../config";
import { adminDbService } from "../services/adminDbServices";

export default {
  getNonce: asyncErrorHandler(async (req: Request, res: Response) => {
    const nonce = await quicker.generateVerifyToken();
    return httpResponse(req, res, SuccessStatusCodes.OK, "Nonce generated", {
      nonce,
    });
  }),

  authCheck: asyncErrorHandler(async (req: Request, res: Response) => {
    const token = req.cookies.authToken;

    return httpResponse(req, res, SuccessStatusCodes.OK, "Verified", {
      token: !!token,
    });
  }),

  register: asyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const safeParse = UserRegisterInput.safeParse(req.body);

      if (!safeParse.success) {
        return httpError(
          next,
          new Error(ResponseMessage.BAD_REQUEST),
          req,
          ErrorStatusCodes.CLIENT_ERROR.BAD_REQUEST,
          safeParse.error.format()
        );
      }

      const { publicKey, signature, userType, message } = safeParse.data;

      const isUserValid = await quicker.verifyWalletAddress(
        publicKey,
        signature,
        message
      );

      // console.log("Is user valid: ", isUserValid);

      if (!isUserValid) {
        return httpError(
          next,
          new Error(ResponseMessage.UNAUTHORIZED),
          req,
          ErrorStatusCodes.CLIENT_ERROR.UNAUTHORIZED
        );
      }

      let sendEntity;
      let token;
      if (userType == "user") {
        const user = await userDbService.createUser(publicKey);
        sendEntity = user;
        token = await quicker.generateJWTToken({
          publicKey,
          id: user.userId,
          type: "user",
        });
      } else if (userType == "admin") {
        const admin = await adminDbService.createAdmin(publicKey);
        sendEntity = admin;
        token = await quicker.generateJWTToken({
          publicKey,
          id: admin.adminId,
          type: "admin",
        });
      }

      const finalToken = "Bearer " + token;

      res.cookie("authToken", finalToken, {
        httpOnly: true,
        secure: AppConfig.get("SAFE_COOKIE") === "true",
        sameSite: "lax",
        path: "/api/v1",
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      });

      return httpResponse(
        req,
        res,
        SuccessStatusCodes.CREATED,
        "User registered successfully",
        {
          sendEntity,
        }
      );
    }
  ),

  logOut: asyncErrorHandler(async (req: Request, res: Response) => {
    // const userId = (req as AuthenticatedRequest).id;

    res.clearCookie("authToken", {
      httpOnly: true,
      secure: AppConfig.get("NODE_ENV") === "production",
      sameSite: "lax",
      path: "/api/v1",
    });

    httpResponse(
      req,
      res,
      SuccessStatusCodes.OK,
      ResponseMessage.LOGOUT_SUCCESS,
      {}
    );
  }),
};
