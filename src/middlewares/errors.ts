import { NextFunction, Request, Response } from 'express';

export function errorMiddleware(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error('[Error middleware]:\n', err.stack);
  res.status(err.statusCode || 500);

  // Send the error response
  res.json({
    success: false,
    error: {
      message: err.message,
      stack:
        process.env.NODE_ENV === 'production'
          ? 'Sorry, an error occurred.'
          : err.stack, // Show the error stack only in development mode
    },
  });
}
