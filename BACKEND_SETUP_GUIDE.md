# Backend Setup Guide - Step by Step

## Prerequisites

- Node.js 18+ (LTS version)
- PostgreSQL 14+ installed and running
- Redis installed and running (optional for initial setup)
- Git

## Step 1: Initialize Project

```bash
# Create project directory
mkdir appointment-backend
cd appointment-backend

# Initialize npm project
npm init -y

# Install TypeScript and development dependencies
npm install -D typescript @types/node @types/express @types/cors @types/bcrypt @types/jsonwebtoken ts-node nodemon

# Install core dependencies
npm install express cors helmet morgan dotenv
npm install express-validator
npm install jsonwebtoken bcrypt
npm install prisma @prisma/client
npm install socket.io
npm install redis ioredis
npm install bull
npm install winston
npm install swagger-jsdoc swagger-ui-express
npm install -D @types/swagger-jsdoc @types/swagger-ui-express
```

## Step 2: TypeScript Configuration

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

## Step 3: Environment Variables

Create `.env` file:

```env
# Server
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/appointments_db?schema=public"

# Redis
REDIS_URL="redis://localhost:6379"

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

Create `.env.example` (without sensitive values):

```env
NODE_ENV=development
PORT=3000
DATABASE_URL="postgresql://username:password@localhost:5432/appointments_db?schema=public"
REDIS_URL="redis://localhost:6379"
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_REFRESH_EXPIRES_IN=7d
FRONTEND_WEB_URL=http://localhost:3001
FRONTEND_MOBILE_URL=http://localhost
SENDGRID_API_KEY=your-sendgrid-api-key
EMAIL_FROM=noreply@appointmentsystem.com
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890
FIREBASE_SERVER_KEY=your-firebase-server-key
```

## Step 4: Initialize Prisma

```bash
# Initialize Prisma
npx prisma init

# This creates:
# - prisma/schema.prisma
# - .env (if not exists)
```

## Step 5: Database Schema

Update `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  firstName String
  lastName  String
  phoneNumber String?
  role      Role     @default(CLIENT)
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relations
  appointments Appointment[]
  schedules    Schedule[]
  notifications Notification[]
  
  @@index([email])
}

enum Role {
  CLIENT
  STAFF
  MANAGER
  ADMIN
}

model Resource {
  id        String   @id @default(uuid())
  name      String
  type      ResourceType
  status    ResourceStatus @default(AVAILABLE)
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relations
  allocations ResourceAllocation[]
  schedules   Schedule[]
  requirements ServiceResourceRequirement[]
  
  @@index([type])
  @@index([status])
}

enum ResourceType {
  PERSONNEL
  EQUIPMENT
}

enum ResourceStatus {
  AVAILABLE
  UNAVAILABLE
  MAINTENANCE
  BOOKED
}

model Personnel {
  id            String   @id @default(uuid())
  resourceId    String   @unique
  userId        String?  @unique
  employeeId    String   @unique
  qualifications String?
  hourlyRate    Decimal?
  maxCapacity   Int      @default(1)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  resource Resource @relation(fields: [resourceId], references: [id], onDelete: Cascade)
  user     User?    @relation(fields: [userId], references: [id])
  
  @@index([userId])
}

model Equipment {
  id              String    @id @default(uuid())
  resourceId      String    @unique
  model           String?
  serialNumber    String?   @unique
  maintenanceSchedule String?
  lastMaintenance DateTime?
  nextMaintenance DateTime?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  resource Resource @relation(fields: [resourceId], references: [id], onDelete: Cascade)
}

model Service {
  id          String   @id @default(uuid())
  name        String
  description String?
  duration    Int      // minutes
  price       Decimal
  categoryId  String?
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relations
  appointments Appointment[]
  requirements ServiceResourceRequirement[]
  waitlist     Waitlist[]
  
  category ServiceCategory? @relation(fields: [categoryId], references: [id])
  
  @@index([isActive])
  @@index([categoryId])
}

model ServiceCategory {
  id          String   @id @default(uuid())
  name        String   @unique
  description String?
  createdAt   DateTime @default(now())
  
  services Service[]
}

model ServiceResourceRequirement {
  id          String       @id @default(uuid())
  serviceId   String
  resourceType ResourceType
  quantity    Int         @default(1)
  isExclusive Boolean     @default(false)
  createdAt   DateTime    @default(now())
  
  service Service @relation(fields: [serviceId], references: [id], onDelete: Cascade)
  
  @@index([serviceId])
}

model Appointment {
  id                String            @id @default(uuid())
  clientId          String
  serviceId         String
  startDateTime     DateTime
  endDateTime       DateTime
  status            AppointmentStatus @default(PENDING)
  notes             String?
  cancellationReason String?
  cancelledAt      DateTime?
  createdAt         DateTime          @default(now())
  updatedAt         DateTime          @updatedAt
  
  // Relations
  client  User     @relation(fields: [clientId], references: [id])
  service Service  @relation(fields: [serviceId], references: [id])
  allocations ResourceAllocation[]
  notifications Notification[]
  
  @@index([clientId])
  @@index([serviceId])
  @@index([startDateTime])
  @@index([status])
  @@index([startDateTime, endDateTime])
}

enum AppointmentStatus {
  PENDING
  CONFIRMED
  IN_PROGRESS
  COMPLETED
  CANCELLED
  NO_SHOW
}

model ResourceAllocation {
  id            String   @id @default(uuid())
  appointmentId String
  resourceId    String
  startTime     DateTime
  endTime       DateTime
  status        String   @default("ALLOCATED")
  createdAt     DateTime @default(now())
  
  appointment Appointment @relation(fields: [appointmentId], references: [id], onDelete: Cascade)
  resource     Resource   @relation(fields: [resourceId], references: [id])
  
  @@unique([resourceId, startTime, endTime])
  @@index([appointmentId])
  @@index([resourceId])
  @@index([startTime, endTime])
}

model Schedule {
  id            String       @id @default(uuid())
  resourceId   String
  date         DateTime
  startTime    DateTime
  endTime      DateTime
  type         ScheduleType
  isRecurring  Boolean      @default(false)
  recurrencePattern String?
  notes        String?
  createdAt    DateTime     @default(now())
  
  resource Resource @relation(fields: [resourceId], references: [id], onDelete: Cascade)
  
  @@index([resourceId])
  @@index([date])
  @@index([startTime, endTime])
}

enum ScheduleType {
  SHIFT
  BREAK
  TIME_OFF
  MAINTENANCE
}

model Waitlist {
  id            String   @id @default(uuid())
  clientId      String
  serviceId     String
  preferredDate DateTime
  preferredTime DateTime?
  priority      Int      @default(0)
  status        String   @default("ACTIVE")
  createdAt     DateTime @default(now())
  
  client  User    @relation(fields: [clientId], references: [id])
  service Service @relation(fields: [serviceId], references: [id])
  
  @@index([serviceId])
  @@index([status])
  @@index([priority])
}

model Notification {
  id            String             @id @default(uuid())
  recipientId   String
  appointmentId String?
  type          NotificationType
  channel       NotificationChannel
  subject       String?
  message       String
  status        NotificationStatus @default(PENDING)
  sentAt        DateTime?
  deliveredAt   DateTime?
  createdAt     DateTime           @default(now())
  
  recipient  User         @relation(fields: [recipientId], references: [id])
  appointment Appointment? @relation(fields: [appointmentId], references: [id])
  
  @@index([recipientId])
  @@index([status])
  @@index([createdAt])
}

enum NotificationType {
  CONFIRMATION
  REMINDER
  CANCELLATION
  RESCHEDULE
  NO_SHOW
}

enum NotificationChannel {
  EMAIL
  SMS
  PUSH
}

enum NotificationStatus {
  PENDING
  SENT
  DELIVERED
  FAILED
}

model AuditLog {
  id         String   @id @default(uuid())
  userId     String?
  entityType String
  entityId   String
  action     String
  oldValue   Json?
  newValue   Json?
  ipAddress  String?
  timestamp  DateTime @default(now())
  
  @@index([userId])
  @@index([entityType, entityId])
  @@index([timestamp])
}
```

## Step 6: Create Database

```bash
# Create database migration
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate
```

## Step 7: Project Structure

Create the following structure:

```
src/
├── config/
│   ├── database.ts
│   ├── redis.ts
│   └── env.ts
├── controllers/
│   ├── appointmentController.ts
│   ├── resourceController.ts
│   ├── serviceController.ts
│   ├── clientController.ts
│   └── authController.ts
├── services/
│   ├── appointmentService.ts
│   ├── resourceService.ts
│   ├── notificationService.ts
│   ├── schedulingService.ts
│   └── authService.ts
├── routes/
│   ├── appointmentRoutes.ts
│   ├── resourceRoutes.ts
│   ├── serviceRoutes.ts
│   ├── clientRoutes.ts
│   └── authRoutes.ts
├── middleware/
│   ├── auth.ts
│   ├── validation.ts
│   ├── errorHandler.ts
│   └── rateLimiter.ts
├── utils/
│   ├── logger.ts
│   ├── helpers.ts
│   └── constants.ts
├── types/
│   └── index.ts
├── jobs/
│   └── reminderJob.ts
├── websocket/
│   └── socketHandler.ts
└── app.ts
```

## Step 8: Basic App Setup

Create `src/app.ts`:

```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';

// Load environment variables
dotenv.config();

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: [
    process.env.FRONTEND_WEB_URL || 'http://localhost:3001',
    process.env.FRONTEND_MOBILE_URL || 'http://localhost',
  ],
  credentials: true,
}));

// Logging
app.use(morgan('combined', {
  stream: { write: (message: string) => logger.info(message.trim()) }
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes (to be added)
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

## Step 9: Package.json Scripts

Update `package.json`:

```json
{
  "scripts": {
    "dev": "nodemon --exec ts-node src/app.ts",
    "build": "tsc",
    "start": "node dist/app.js",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio",
    "test": "jest",
    "lint": "eslint src/**/*.ts",
    "format": "prettier --write src/**/*.ts"
  }
}
```

## Step 10: Run Development Server

```bash
# Start PostgreSQL (if not running)
# On macOS: brew services start postgresql
# On Linux: sudo systemctl start postgresql
# On Windows: Start PostgreSQL service

# Start Redis (if using)
# On macOS: brew services start redis
# On Linux: sudo systemctl start redis
# On Windows: Start Redis service

# Run migrations
npm run prisma:migrate

# Start development server
npm run dev
```

## Next Steps

1. **Implement Authentication**
   - JWT token generation
   - Login/Register endpoints
   - Password hashing with bcrypt

2. **Create API Endpoints**
   - CRUD for appointments
   - CRUD for resources
   - CRUD for services
   - Availability checking

3. **Setup WebSocket**
   - Socket.io server
   - Real-time event handlers

4. **Background Jobs**
   - Bull queue setup
   - Reminder job scheduling

5. **Testing**
   - Unit tests
   - Integration tests
   - API endpoint tests

## Useful Commands

```bash
# Development
npm run dev              # Start dev server with hot reload

# Database
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run migrations
npm run prisma:studio    # Open Prisma Studio (DB GUI)

# Production
npm run build            # Build TypeScript
npm start                # Start production server

# Testing
npm test                 # Run tests
```

## Integration with Flutter

### API Endpoints
Flutter will use the same REST endpoints as the web app:
- Base URL: `http://your-api-url/api/v1`
- Authentication: JWT token in `Authorization: Bearer <token>` header
- Response format: JSON

### WebSocket
Flutter uses `socket_io_client` package:
```dart
import 'package:socket_io_client/socket_io_client.dart';

final socket = io('http://your-api-url', <String, dynamic>{
  'transports': ['websocket'],
  'autoConnect': false,
});

socket.connect();
socket.on('appointment:created', (data) {
  // Handle event
});
```

### Error Handling
Backend should return consistent error format:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message"
  }
}
```

Both React and Flutter can handle this format consistently.

