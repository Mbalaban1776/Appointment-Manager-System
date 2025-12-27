import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { AppError } from './errorHandler';

export const validate = (schema: ZodSchema<any>) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      const messages = (error as any).errors.map((e: any) => e.message).join(', ');
      return next(new AppError(`Validation Error: ${messages}`, 400));
    }
    next(error);
  }
};
