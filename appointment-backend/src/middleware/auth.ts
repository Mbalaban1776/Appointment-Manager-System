import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler';
import { Role } from '@prisma/client';
import { prisma } from '../lib/prisma';

interface JwtPayload {
  id: string;
  role: Role;
  iat: number;
  exp: number;
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'secret'
    ) as JwtPayload;

    // Check if user still exists
    const currentUser = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!currentUser) {
      return next(
        new AppError(
          'The user belonging to this token does no longer exist.',
          401
        )
      );
    }

    // Check if user changed password after the token was issued (optional, skip for now)

    // Grant access to protected route
    req.user = {
      id: currentUser.id,
      role: currentUser.role,
      email: currentUser.email,
    };
    next();
  } catch (error) {
    return next(new AppError('Invalid token. Please log in again!', 401));
  }
};

export const restrictTo = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};

