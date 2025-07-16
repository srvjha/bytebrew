import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { logger } from "firebase-functions";

const grpcToHttpStatusMap: Record<string | number, number> = {
  "0": 200,
  "1": 499,
  "2": 500,
  "3": 400,
  "4": 504,
  "5": 404,
  "6": 409,
  "7": 403,
  "8": 429,
  "9": 412,
  "10": 409,
  "11": 400,
  "12": 501,
  "13": 500,
  "14": 503,
  "15": 500,
  "16": 401,
};

const sanitizeGrpcCode = (code: any): number => {
  if (typeof code === "number") return grpcToHttpStatusMap[code] || 500;

  if (typeof code === "string") {
    const numericCode = code.match(/\d+/)?.[0]; // extract only digits
    if (numericCode) {
      return grpcToHttpStatusMap[numericCode] || 500;
    }
  }

  return 500;
};

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let customError: ApiError;

  if (err instanceof ApiError) {
    customError = err;
  } else {
    const statusCode = sanitizeGrpcCode(err.code || err.statusCode);
    const message = err.message || "Internal Server Error";
    customError = new ApiError(statusCode,message);
  }

  // Log properly parsed status code
  logger.error(
    `${req.method} ${req.originalUrl} -> ${customError.message} [${customError.statusCode}]`
  );

  // Avoid sending invalid status code
  const safeStatus = Number.isInteger(customError.statusCode)
    ? customError.statusCode
    : 500;

  res.status(safeStatus).json({
    success: false,
    error: customError.message,
    data: customError.data || null,
    statusCode: safeStatus,
  });
};

export { errorHandler };
