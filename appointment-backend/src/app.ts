import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler, AppError } from './middleware/errorHandler';
import authRoutes from './routes/authRoutes';
import serviceRoutes from './routes/serviceRoutes';
import appointmentRoutes from './routes/appointmentRoutes';
import resourceRoutes from './routes/resourceRoutes';

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_WEB_URL || 'http://localhost:3001',
  credentials: true,
}));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/services', serviceRoutes);
app.use('/api/v1/appointments', appointmentRoutes);
app.use('/api/v1/resources', resourceRoutes);

// 404 Handler
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handler
app.use(errorHandler);

export default app;

