import { errorMiddleware } from '../../../src/middlewares/errors';
import { NextFunction, Request, Response } from 'express';

describe('Error Middleware', () => {
  test('should set response status code and send error JSON', () => {
    const error: any = new Error('Test error');
    error.statusCode = 400;

    const req: Request = {} as Request;
    const res: Response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(), // Mock the response json method
    } as unknown as Response;
    const next: NextFunction = jest.fn(); // Mock the next function

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    errorMiddleware(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: {
        message: 'Test error',
        stack: expect.any(String),
      },
    });

    // Check if console.error was called with the expected error message
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      '[Error middleware]:\n',
      error.stack
    );

    // Restore the original console.error function
    consoleErrorSpy.mockRestore();
  });
});
