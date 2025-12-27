import { Server, Socket } from 'socket.io';

export const setupSocket = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Join user-specific room for notifications
    socket.on('join:user', (userId: string) => {
      socket.join(`user:${userId}`);
      console.log(`Socket ${socket.id} joined user:${userId}`);
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
};

