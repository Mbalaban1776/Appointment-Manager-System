import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { z } from 'zod';

export const createEquipmentSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    model: z.string().optional(),
    serialNumber: z.string().optional(),
  }),
});

export const createPersonnelResourceSchema = z.object({
  body: z.object({
    personnelId: z.string().uuid(),
    name: z.string().optional(), // Can override name or take from User
  }),
});

export const getAllResources = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const resources = await prisma.resource.findMany({
      include: {
        personnel: {
            include: { user: true }
        },
        equipment: true,
      },
    });
    res.status(200).json({ status: 'success', data: { resources } });
  } catch (error) {
    next(error);
  }
};

export const createEquipment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, model, serialNumber } = req.body;

    // Transaction to create Resource and Equipment
    const result = await prisma.$transaction(async (tx) => {
      const resource = await tx.resource.create({
        data: {
          name,
          type: 'EQUIPMENT',
          status: 'AVAILABLE',
        },
      });

      const equipment = await tx.equipment.create({
        data: {
          resourceId: resource.id,
          model,
          serialNumber,
        },
      });

      return { resource, equipment };
    });

    res.status(201).json({ status: 'success', data: result });
  } catch (error) {
    next(error);
  }
};

export const createPersonnelResource = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { personnelId, name } = req.body;

    const personnel = await prisma.personnel.findUnique({
      where: { id: personnelId },
      include: { user: true },
    });

    if (!personnel) {
      return next(new AppError('Personnel not found', 404));
    }

    // Check if resource already exists for this personnel
    const existing = await prisma.resource.findFirst({
        where: { personnelId }
    });
    if (existing) {
        return next(new AppError('Resource already exists for this personnel', 400));
    }

    const resourceName = name || `${personnel.user.firstName} ${personnel.user.lastName}`;

    const resource = await prisma.resource.create({
      data: {
        name: resourceName,
        type: 'PERSONNEL',
        personnelId,
        status: 'AVAILABLE',
      },
    });

    res.status(201).json({ status: 'success', data: { resource } });
  } catch (error) {
    next(error);
  }
};

export const deleteResource = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await prisma.resource.delete({
      where: { id: req.params.id },
    });
    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    next(error);
  }
};

