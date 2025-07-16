import { SafeParseReturnType } from "zod";
import { ApiError } from "./ApiError";

export const handleZodError = <T>(result: SafeParseReturnType<unknown, T>): T => {
  if (!result.success) {
    const firstIssue = result.error.issues[0];
    const path = firstIssue.path.join(".");

    if (firstIssue.code === "invalid_type" && firstIssue.received === "undefined") {
      throw new ApiError(400, path ? `Missing '${path}' field` : "Missing required fields");
    }

    const message = path ? firstIssue.message : firstIssue.message;

    throw new ApiError(422, message);
  }

  return result.data;
};
