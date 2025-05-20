import { Request, Response } from "express";
import { asyncErrorHandler, httpResponse } from "@workspace/utils";
import quicker from "../utils/quicker";
import { SuccessStatusCodes } from "@workspace/constants";

export default {
  getPreSignedUrl: asyncErrorHandler(async (req: Request, res: Response) => {
    const preSignedUrl = await quicker.generatePresignedUrl();
    httpResponse(req, res, SuccessStatusCodes.OK, "Data Generated", {
      timestamp: preSignedUrl.timestamp,
      signature: preSignedUrl.signature,
    });
  }),
};
