import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { signToken, hashPassword, comparePassword } from '../utils/authUtils';
import { z } from 'zod';

// Zod Schemas
export const registerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8),
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    phoneNumber: z.string().optional(),
    role: z.enum(['CLIENT', 'STAFF', 'MANAGER', 'ADMIN']).optional(), // Usually only admin can set role, but for MVP/demo allowing it
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string(),
  }),
});

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, firstName, lastName, phoneNumber, role } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return next(new AppError('Email already in use', 400));
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phoneNumber,
        role: role || 'CLIENT',
      },
    });

    // If role is CLIENT, create Client profile
    if (newUser.role === 'CLIENT') {
      await prisma.client.create({
        data: {
          userId: newUser.id,
        },
      });
    }

    // If role is STAFF/MANAGER/ADMIN, create Personnel profile (basic)
    if (['STAFF', 'MANAGER', 'ADMIN'].includes(newUser.role)) {
       // We need a unique employee ID. For now, using timestamp/random
       const employeeId = `EMP${Date.now()}`;
       await prisma.personnel.create({
         data: {
           userId: newUser.id,
           employeeId,
         }
       })
    }

    const token = signToken(newUser.id, newUser.role);

    // Remove password from output
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: userWithoutPassword,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
      return next(new AppError('Please provide email and password!', 400));
    }

    // 2) Check if user exists && password is correct
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !(await comparePassword(password, user.password))) {
      return next(new AppError('Incorrect email or password', 401));
    }

    // 3) If everything ok, send token to client
    const token = signToken(user.id, user.role);

    // Remove password from output
    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({
      status: 'success',
      token,
      data: {
        user: userWithoutPassword,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await prisma.user.findUnique({
        where: { id: req.user?.id },
        include: {
            client: true,
            personnel: true
        }
    });

    if (!user) {
        return next(new AppError('User not found', 404));
    }

    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({
        status: 'success',
        data: {
            user: userWithoutPassword
        }
    });
  } catch (error) {
    next(error);
  }
};

