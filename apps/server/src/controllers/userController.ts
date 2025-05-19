import { Request, Response, NextFunction } from "express";
import { asyncErrorHandler, httpError, httpResponse } from "@workspace/utils";
import { ErrorStatusCodes, SuccessStatusCodes } from "@workspace/constants";
import { UserRegistrationInput } from "@workspace/types";
import dbServices from "@/services/dbServices";

export default {
  register: asyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const body = req.body;
      const safeParse = UserRegistrationInput.safeParse(body);

      if (!safeParse.success) {
        return httpError(
          next,
          new Error("Invalid input"),
          req,
          ErrorStatusCodes.CLIENT_ERROR.BAD_REQUEST,
          safeParse.error.flatten()
        );
      }

      const { email, name } = safeParse.data;

      const user = await dbServices.createUser({
        email,
        name,
      });

      httpResponse(
        req,
        res,
        SuccessStatusCodes.OK,
        "User Created Successfully",
        {
          user,
        }
      );
    }
  ),
};
