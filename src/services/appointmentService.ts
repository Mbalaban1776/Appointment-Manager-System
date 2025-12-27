import { prisma } from '../server';
import { AppError } from '../middleware/errorHandler';

export const checkAvailability = async (
  serviceId: string,
  startDateTime: Date,
  endDateTime: Date
) => {
  // 1. Get service requirements
  const requirements = await prisma.serviceResourceRequirement.findMany({
    where: { serviceId },
  });

  if (requirements.length === 0) {
    // If no specific requirements, assume available (or require at least one generic staff?)
    // For now, return true
    return true;
  }

  // 2. For each requirement, find available resources
  const allocationMap: { resourceId: string }[] = [];

  for (const req of requirements) {
    // Find resources of this type that are NOT booked in this slot
    // This is a simplified check. In production, we'd need complex query to exclude booked resources
    const availableResources = await prisma.resource.findMany({
      where: {
        type: req.resourceType,
        status: 'AVAILABLE',
        isActive: true,
        allocations: {
          none: {
            OR: [
              {
                startTime: { lte: startDateTime },
                endTime: { gt: startDateTime },
              },
              {
                startTime: { lt: endDateTime },
                endTime: { gte: endDateTime },
              },
              {
                startTime: { gte: startDateTime },
                endTime: { lte: endDateTime },
              }
            ]
          }
        },
        // Also check Schedules (shifts, time off) - Skipping for MVP/Simplicity
      },
      take: req.quantity,
    });

    if (availableResources.length < req.quantity) {
      throw new AppError(`Not enough ${req.resourceType} resources available for this time slot.`, 409);
    }

    availableResources.forEach(r => allocationMap.push({ resourceId: r.id }));
  }

  return allocationMap;
};

