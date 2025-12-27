import { Request, Response, NextFunction } from 'express';
import { prisma } from '../server';
import { AppError } from '../middleware/errorHandler';
import { z } from 'zod';

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1),
    description: z.string().optional(),
  }),
});

export const createServiceSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    categoryId: z.string().uuid(),
    description: z.string().optional(),
    duration: z.number().int().positive(),
    price: z.number().positive(),
    isActive: z.boolean().optional(),
  }),
});

// Categories
export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await prisma.serviceCategory.findMany({
      include: { services: true },
    });
    res.status(200).json({ status: 'success', data: { categories } });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await prisma.serviceCategory.create({
      data: req.body,
    });
    res.status(201).json({ status: 'success', data: { category } });
  } catch (error) {
    next(error);
  }
};

// Services
export const getAllServices = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const services = await prisma.service.findMany({
      include: { category: true },
    });
    res.status(200).json({ status: 'success', data: { services } });
  } catch (error) {
    next(error);
  }
};

export const getService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const service = await prisma.service.findUnique({
      where: { id: req.params.id },
      include: { category: true },
    });

    if (!service) {
      return next(new AppError('No service found with that ID', 404));
    }

    res.status(200).json({ status: 'success', data: { service } });
  } catch (error) {
    next(error);
  }
};

export const createService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const service = await prisma.service.create({
      data: req.body,
    });
    res.status(201).json({ status: 'success', data: { service } });
  } catch (error) {
    next(error);
  }
};

export const updateService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const service = await prisma.service.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.status(200).json({ status: 'success', data: { service } });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Record to update not found')) {
         return next(new AppError('No service found with that ID', 404));
    }
    next(error);
  }
};

export const deleteService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await prisma.service.delete({
      where: { id: req.params.id },
    });
    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
      if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
         return next(new AppError('No service found with that ID', 404));
      }
    next(error);
  }
};

