import { ErrorStatusCodes, ResponseMessage } from "@workspace/constants";
import { AuthenticatedRequest, TokenPayload } from "@workspace/types";
import { httpError } from "@workspace/utils";
import { Request, Response, NextFunction } from "express";
import { JsonWebTokenError, TokenExpiredError, verify } from "jsonwebtoken";
import { AppConfig } from "../config";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.authToken;
  console.log("Token: ", token);
  const request = req as AuthenticatedRequest;
  if (!token || !token.startsWith("Bearer ")) {
    return httpError(
      next,
      new Error(ResponseMessage.UNAUTHORIZED),
      req,
      ErrorStatusCodes.CLIENT_ERROR.UNAUTHORIZED
    );
  }

  const tokenValue = token.split(" ")[1];

  if (!tokenValue) {
    return httpError(
      next,
      new Error(ResponseMessage.UNAUTHORIZED),
      req,
      ErrorStatusCodes.CLIENT_ERROR.UNAUTHORIZED
    );
  }

  try {
    const decodedToken = verify(
      tokenValue,
      String(AppConfig.get("JWT_SECRET"))
    ) as TokenPayload;

    request.id = decodedToken.id;
    request.publicKey = decodedToken.publicKey;
    request.type = decodedToken.type;

    next();
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      return httpError(
        next,
        new Error("Invalid token."),
        req,
        ErrorStatusCodes.CLIENT_ERROR.UNAUTHORIZED
      );
    }

    if (error instanceof TokenExpiredError) {
      return httpError(
        next,
        new Error("Token expired."),
        req,
        ErrorStatusCodes.CLIENT_ERROR.UNAUTHORIZED
      );
    }

    return next(error);
  }
};

export default authMiddleware;
