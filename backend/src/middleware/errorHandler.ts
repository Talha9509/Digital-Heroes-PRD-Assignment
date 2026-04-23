// @ts-ignore
import type { NextFunction, Request, Response } from 'express';
import { env } from '../config/env.js';

interface AppError extends Error {
  statusCode?: number;
}

export function errorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  const status = err.statusCode ?? 500;
  const message =
    err.message ?? 'Something went wrong. Please try again later.';

  if (env.nodeEnv !== 'test') {
    console.error('Error:', {
      status,
      message,
      stack: err.stack,
    });
  }

  res.status(status).json({
    success: false,
    message,
    ...(env.nodeEnv === 'development' && { stack: err.stack }),
  });
}