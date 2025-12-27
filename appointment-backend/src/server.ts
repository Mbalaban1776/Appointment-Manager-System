import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import app from './app';
// import { PrismaClient } from '@prisma/client';
import { initSocket } from './lib/socket';

// export const prisma = new PrismaClient(); // Moved to lib/prisma.ts

const PORT = process.env.PORT || 3000;

const httpServer = http.createServer(app);

// Initialize Socket.io
initSocket(httpServer);

const server = httpServer.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: any) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: any) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});
