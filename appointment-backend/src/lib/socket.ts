import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';

let io: Server;

export const initSocket = (httpServer: HttpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_WEB_URL || 'http://localhost:3001',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });
  return io;
};

export const getIO = () => {
  if (!io) {
    // Return a mock/dummy if not initialized to avoid crashes in some contexts, or throw
    // For now, allow it to return undefined or throw.
    // console.warn('Socket.io not initialized!');
    return undefined;
  }
  return io;
};

