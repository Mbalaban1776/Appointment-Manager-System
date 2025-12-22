# MongoDB Setup Guide for Appointment Management System

## Overview

This guide provides MongoDB-specific setup instructions if you choose to use MongoDB instead of PostgreSQL.

---

## Prerequisites

- Node.js 18+ (LTS version)
- MongoDB installed locally OR MongoDB Atlas account
- Git

---

## Step 1: Install MongoDB

### Option A: Local MongoDB

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu/Debian):**
```bash
# Follow official MongoDB installation guide
# https://www.mongodb.com/docs/manual/installation/
```

**Windows:**
- Download MongoDB Community Server from mongodb.com
- Run installer

### Option B: MongoDB Atlas (Cloud - Recommended for Development)

1. Sign up at https://www.mongodb.com/cloud/atlas
2. Create a free cluster (M0 - Free tier)
3. Get connection string

---

## Step 2: Initialize Project

```bash
# Create project directory
mkdir appointment-backend
cd appointment-backend

# Initialize npm project
npm init -y

# Install dependencies
npm install express cors helmet morgan dotenv
npm install mongoose
npm install -D typescript @types/node @types/express @types/cors ts-node nodemon
npm install express-validator
npm install jsonwebtoken bcrypt
npm install -D @types/jsonwebtoken @types/bcrypt
npm install socket.io
npm install redis ioredis
npm install bull
npm install winston
npm install swagger-jsdoc swagger-ui-express
npm install -D @types/swagger-jsdoc @types/swagger-ui-express
```

---

## Step 3: Environment Variables

Create `.env` file:

```env
# Server
NODE_ENV=development
PORT=3000

# MongoDB
# Local MongoDB
MONGODB_URI=mongodb://localhost:27017/appointments_db

# OR MongoDB Atlas
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/appointments_db?retryWrites=true&w=majority

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_REFRESH_EXPIRES_IN=7d

# CORS
FRONTEND_WEB_URL=http://localhost:3001
FRONTEND_MOBILE_URL=http://localhost

# Email (SendGrid)
SENDGRID_API_KEY=your-sendgrid-api-key
EMAIL_FROM=noreply@appointmentsystem.com

# SMS (Twilio)
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# Firebase (Push Notifications)
FIREBASE_SERVER_KEY=your-firebase-server-key
```

---

## Step 4: MongoDB Connection Setup

Create `src/config/database.ts`:

```typescript
import mongoose from 'mongoose';
import { logger } from '../utils/logger';

export const connectDatabase = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is not set');
    }

    await mongoose.connect(mongoUri, {
      // Options for MongoDB connection
    });

    logger.info('MongoDB connected successfully');

    // Handle connection events
    mongoose.connection.on('error', (error) => {
      logger.error('MongoDB connection error:', error);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('MongoDB connection closed');
      process.exit(0);
    });

  } catch (error) {
    logger.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};
```

---

## Step 5: Mongoose Schema Definitions

### User Schema

Create `src/models/User.ts`:

```typescript
import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: 'CLIENT' | 'STAFF' | 'MANAGER' | 'ADMIN';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      select: false, // Don't return password by default
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ['CLIENT', 'STAFF', 'MANAGER', 'ADMIN'],
      default: 'CLIENT',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Indexes
userSchema.index({ email: 1 });

export const User = mongoose.model<IUser>('User', userSchema);
```

### Resource Schema

Create `src/models/Resource.ts`:

```typescript
import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IResource extends Document {
  name: string;
  type: 'PERSONNEL' | 'EQUIPMENT';
  status: 'AVAILABLE' | 'UNAVAILABLE' | 'MAINTENANCE' | 'BOOKED';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const resourceSchema = new Schema<IResource>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['PERSONNEL', 'EQUIPMENT'],
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['AVAILABLE', 'UNAVAILABLE', 'MAINTENANCE', 'BOOKED'],
      default: 'AVAILABLE',
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
resourceSchema.index({ type: 1, status: 1 });

export const Resource = mongoose.model<IResource>('Resource', resourceSchema);
```

### Service Schema

Create `src/models/Service.ts`:

```typescript
import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IService extends Document {
  name: string;
  description?: string;
  duration: number; // minutes
  price: number;
  categoryId?: Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const serviceSchema = new Schema<IService>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    duration: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'ServiceCategory',
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
serviceSchema.index({ isActive: 1 });
serviceSchema.index({ categoryId: 1 });

export const Service = mongoose.model<IService>('Service', serviceSchema);
```

### Appointment Schema

Create `src/models/Appointment.ts`:

```typescript
import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IAppointment extends Document {
  clientId: Types.ObjectId;
  serviceId: Types.ObjectId;
  startDateTime: Date;
  endDateTime: Date;
  status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  notes?: string;
  cancellationReason?: string;
  cancelledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const appointmentSchema = new Schema<IAppointment>(
  {
    clientId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    serviceId: {
      type: Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
      index: true,
    },
    startDateTime: {
      type: Date,
      required: true,
      index: true,
    },
    endDateTime: {
      type: Date,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW'],
      default: 'PENDING',
      index: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    cancellationReason: {
      type: String,
      trim: true,
    },
    cancelledAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for availability queries
appointmentSchema.index({ startDateTime: 1, endDateTime: 1 });
appointmentSchema.index({ clientId: 1, startDateTime: 1 });
appointmentSchema.index({ serviceId: 1, status: 1 });

// Validation: endDateTime must be after startDateTime
appointmentSchema.pre('save', function (next) {
  if (this.endDateTime <= this.startDateTime) {
    next(new Error('endDateTime must be after startDateTime'));
  } else {
    next();
  }
});

export const Appointment = mongoose.model<IAppointment>('Appointment', appointmentSchema);
```

### Resource Allocation Schema

Create `src/models/ResourceAllocation.ts`:

```typescript
import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IResourceAllocation extends Document {
  appointmentId: Types.ObjectId;
  resourceId: Types.ObjectId;
  startTime: Date;
  endTime: Date;
  status: string;
  createdAt: Date;
}

const resourceAllocationSchema = new Schema<IResourceAllocation>(
  {
    appointmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Appointment',
      required: true,
      index: true,
    },
    resourceId: {
      type: Schema.Types.ObjectId,
      ref: 'Resource',
      required: true,
      index: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      default: 'ALLOCATED',
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Compound index to prevent double booking
resourceAllocationSchema.index(
  { resourceId: 1, startTime: 1, endTime: 1 },
  { unique: true }
);

// Index for availability queries
resourceAllocationSchema.index({ startTime: 1, endTime: 1 });

export const ResourceAllocation = mongoose.model<IResourceAllocation>(
  'ResourceAllocation',
  resourceAllocationSchema
);
```

### Schedule Schema

Create `src/models/Schedule.ts`:

```typescript
import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ISchedule extends Document {
  resourceId: Types.ObjectId;
  date: Date;
  startTime: Date;
  endTime: Date;
  type: 'SHIFT' | 'BREAK' | 'TIME_OFF' | 'MAINTENANCE';
  isRecurring: boolean;
  recurrencePattern?: string;
  notes?: string;
  createdAt: Date;
}

const scheduleSchema = new Schema<ISchedule>(
  {
    resourceId: {
      type: Schema.Types.ObjectId,
      ref: 'Resource',
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    type: {
      type: String,
      enum: ['SHIFT', 'BREAK', 'TIME_OFF', 'MAINTENANCE'],
      required: true,
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurrencePattern: {
      type: String,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Indexes for availability queries
scheduleSchema.index({ resourceId: 1, date: 1 });
scheduleSchema.index({ startTime: 1, endTime: 1 });

export const Schedule = mongoose.model<ISchedule>('Schedule', scheduleSchema);
```

---

## Step 6: Transaction Example for Appointment Booking

Create `src/services/appointmentService.ts`:

```typescript
import mongoose from 'mongoose';
import { Appointment } from '../models/Appointment';
import { ResourceAllocation } from '../models/ResourceAllocation';
import { Resource } from '../models/Resource';

export const createAppointment = async (appointmentData: {
  clientId: string;
  serviceId: string;
  startDateTime: Date;
  endDateTime: Date;
  resourceIds: string[];
}) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Check resource availability
    const conflicts = await ResourceAllocation.find({
      resourceId: { $in: appointmentData.resourceIds },
      $or: [
        {
          startTime: { $lt: appointmentData.endDateTime },
          endTime: { $gt: appointmentData.startDateTime },
        },
      ],
      status: { $ne: 'CANCELLED' },
    }).session(session);

    if (conflicts.length > 0) {
      throw new Error('Resources not available at requested time');
    }

    // 2. Create appointment
    const appointment = new Appointment({
      clientId: appointmentData.clientId,
      serviceId: appointmentData.serviceId,
      startDateTime: appointmentData.startDateTime,
      endDateTime: appointmentData.endDateTime,
      status: 'CONFIRMED',
    });
    await appointment.save({ session });

    // 3. Allocate resources
    const allocations = appointmentData.resourceIds.map((resourceId) => ({
      appointmentId: appointment._id,
      resourceId,
      startTime: appointmentData.startDateTime,
      endTime: appointmentData.endDateTime,
      status: 'ALLOCATED',
    }));

    await ResourceAllocation.insertMany(allocations, { session });

    // 4. Update resource status
    await Resource.updateMany(
      { _id: { $in: appointmentData.resourceIds } },
      { $set: { status: 'BOOKED' } },
      { session }
    );

    // Commit transaction
    await session.commitTransaction();

    // Populate references
    await appointment.populate('clientId serviceId');
    await appointment.populate({
      path: 'allocations',
      populate: { path: 'resourceId' },
    });

    return appointment;
  } catch (error) {
    // Abort transaction on error
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};
```

---

## Step 7: Availability Check Query

Create `src/services/availabilityService.ts`:

```typescript
import { Appointment } from '../models/Appointment';
import { ResourceAllocation } from '../models/ResourceAllocation';
import { Schedule } from '../models/Schedule';

export const checkAvailability = async (
  resourceIds: string[],
  startDateTime: Date,
  endDateTime: Date
): Promise<boolean> => {
  // Check for conflicting appointments
  const conflictingAppointments = await Appointment.find({
    status: { $in: ['CONFIRMED', 'PENDING'] },
    $or: [
      {
        startDateTime: { $lt: endDateTime },
        endDateTime: { $gt: startDateTime },
      },
    ],
  });

  // Get resource allocations for these appointments
  const appointmentIds = conflictingAppointments.map((apt) => apt._id);
  const conflictingAllocations = await ResourceAllocation.find({
    appointmentId: { $in: appointmentIds },
    resourceId: { $in: resourceIds },
    $or: [
      {
        startTime: { $lt: endDateTime },
        endTime: { $gt: startDateTime },
      },
    ],
  });

  if (conflictingAllocations.length > 0) {
    return false; // Not available
  }

  // Check schedules (shifts, breaks, maintenance)
  const conflictingSchedules = await Schedule.find({
    resourceId: { $in: resourceIds },
    type: { $in: ['BREAK', 'TIME_OFF', 'MAINTENANCE'] },
    $or: [
      {
        startTime: { $lt: endDateTime },
        endTime: { $gt: startDateTime },
      },
    ],
  });

  if (conflictingSchedules.length > 0) {
    return false; // Not available
  }

  return true; // Available
};
```

---

## Step 8: Update App.ts

```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: [
    process.env.FRONTEND_WEB_URL || 'http://localhost:3001',
    process.env.FRONTEND_MOBILE_URL || 'http://localhost',
  ],
  credentials: true,
}));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Connect to MongoDB
connectDatabase();

// Routes (to be added)
// app.use('/api/v1/auth', authRoutes);
// app.use('/api/v1/appointments', appointmentRoutes);

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV}`);
});
```

---

## Step 9: Package.json Scripts

```json
{
  "scripts": {
    "dev": "nodemon --exec ts-node src/app.ts",
    "build": "tsc",
    "start": "node dist/app.js",
    "test": "jest"
  }
}
```

---

## Key Differences from PostgreSQL

### 1. No Migrations
- MongoDB doesn't require migrations
- Schema changes are flexible
- Use Mongoose validation instead

### 2. ObjectId Instead of UUID
- MongoDB uses ObjectId by default
- Can use UUID if preferred: `type: Schema.Types.UUID`

### 3. References Instead of Foreign Keys
- Use `ref` in schema
- Populate when needed: `await appointment.populate('clientId')`

### 4. Transactions
- Must use sessions
- More expensive than PostgreSQL
- Use for critical operations only

### 5. Queries
- Use Mongoose methods or aggregation pipeline
- No SQL joins - use populate or aggregation

---

## Best Practices for MongoDB

1. **Always use transactions for booking operations**
2. **Create proper indexes** (as shown in schemas)
3. **Use populate sparingly** - can be slow
4. **Validate at application level** - no DB constraints
5. **Use aggregation pipeline** for complex queries
6. **Monitor query performance** - use explain()
7. **Handle connection errors** gracefully

---

## Testing MongoDB Connection

```typescript
// Test script: src/scripts/testConnection.ts
import { connectDatabase } from '../config/database';
import { User } from '../models/User';

const testConnection = async () => {
  try {
    await connectDatabase();
    
    // Test query
    const userCount = await User.countDocuments();
    console.log(`Connected! User count: ${userCount}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Connection test failed:', error);
    process.exit(1);
  }
};

testConnection();
```

Run: `npx ts-node src/scripts/testConnection.ts`

---

## Conclusion

MongoDB setup is complete. Key points:
- ✅ Use Mongoose for schema management
- ✅ Implement transactions for critical operations
- ✅ Create proper indexes
- ✅ Handle relationships with references
- ✅ Validate at application level

Remember: MongoDB requires more application-level logic compared to PostgreSQL, but offers more flexibility.

