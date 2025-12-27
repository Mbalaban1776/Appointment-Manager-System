import { prisma } from '../lib/prisma';
import { getIO } from '../lib/socket';

export const sendNotification = async (
  recipientId: string,
  type: 'CONFIRMATION' | 'REMINDER' | 'CANCELLATION' | 'RESCHEDULE' | 'NO_SHOW',
  subject: string,
  message: string,
  appointmentId?: string
) => {
  try {
    // 1. Save to Database
    const notification = await prisma.notification.create({
      data: {
        recipientId,
        type,
        channel: 'EMAIL', // Defaulting for now
        subject,
        message,
        appointmentId,
        status: 'SENT',
        sentAt: new Date(),
      },
    });

    // 2. Emit Real-time via Socket.io
    const io = getIO();
    if (io) {
      io.to(`user:${recipientId}`).emit('notification', notification);
    }

    // 3. Send via Email/SMS (Mock)
    console.log(`[MOCK EMAIL] To: ${recipientId}, Subject: ${subject}, Body: ${message}`);

    return notification;
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};
