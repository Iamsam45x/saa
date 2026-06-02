import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request data',
        details: err.flatten().fieldErrors,
      },
    });
  }

  console.error('Unhandled error:', err);

  return res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: err.message || 'An unexpected error occurred',
    },
  });
}
