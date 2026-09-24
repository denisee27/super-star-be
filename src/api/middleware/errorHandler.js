import { AppError } from "../../core/errors/httpErrors.js";
import { logger } from "../../infra/logger/index.js";

export function errorHandler(err, req, res, next) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ success: false, error: err.message });
  }

  logger.error({ err }, "Unexpected error");
  const message = process.env.NODE_ENV === "production" ? "Internal server error" : err.message;
  res.status(500).json({ success: false, error: message });
}
