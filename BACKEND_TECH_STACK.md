# Backend & Database Technology Stack Recommendations

## Overview

This document provides technology recommendations for the **backend API** that will serve both:
- **Web Application** (React)
- **Mobile Application** (Flutter)

The backend must be **client-agnostic** and provide a unified REST API with WebSocket support for real-time features.

---

## Recommended Backend Stack

### 🚀 Backend Framework: **Node.js with Express.js** (Recommended)

**Why Node.js + Express?**
- ✅ **Universal compatibility** - Works seamlessly with both React and Flutter
- ✅ **JavaScript/TypeScript** - Same language as web frontend (easier team collaboration)
- ✅ **Large ecosystem** - Massive npm package library
- ✅ **Real-time support** - Excellent WebSocket support (Socket.io)
- ✅ **Fast development** - Quick to build and iterate
- ✅ **Great for I/O operations** - Perfect for appointment management (lots of database queries)
- ✅ **Easy deployment** - Works well with cloud platforms
- ✅ **Active community** - Extensive documentation and support

**Alternative Options:**
- **NestJS** (TypeScript-first, more structured, enterprise-ready)
- **Fastify** (Faster than Express, similar API)
- **Java Spring Boot** (Enterprise-grade, but more verbose)
- **Python Django/FastAPI** (Good for data-heavy operations)

**Recommendation:** Start with **Express.js** for speed, consider **NestJS** if you need more structure.

---

### 📝 Language: **TypeScript**

**Why TypeScript?**
- ✅ Type safety reduces bugs
- ✅ Better IDE support
- ✅ Easier refactoring
- ✅ Can share types with React web app
- ✅ Better collaboration

---

### 🗄️ Database: **PostgreSQL** (Recommended) or **MongoDB** (Alternative)

#### **PostgreSQL** (Recommended)

**Why PostgreSQL?**
- ✅ **ACID compliance** - Critical for appointment booking (no double bookings)
- ✅ **Relational data** - Perfect for complex relationships (appointments, resources, services)
- ✅ **JSON support** - Can store flexible data (preferences, notes)
- ✅ **Full-text search** - Useful for searching clients, services
- ✅ **Triggers & functions** - Can handle business logic at DB level
- ✅ **Mature & stable** - Battle-tested for production
- ✅ **Excellent tooling** - Great admin tools (pgAdmin, DBeaver)
- ✅ **Free & open source**

**Alternative: MySQL/MariaDB**
- ✅ Similar features to PostgreSQL
- ✅ Slightly better performance for read-heavy workloads
- ⚠️ Less advanced features than PostgreSQL

#### **MongoDB** (Alternative - See MONGODB_ANALYSIS.md)

**When MongoDB can work:**
- ✅ Your team prefers NoSQL/MongoDB
- ✅ You're comfortable managing relationships in code
- ✅ You implement proper transactions (MongoDB 4.0+)
- ✅ You use Mongoose for schema validation

**Challenges with MongoDB:**
- ⚠️ More complex availability queries
- ⚠️ Need application-level data integrity
- ⚠️ Transactions are more expensive
- ⚠️ Less efficient for complex relational queries

**Recommendation:** 
- **PostgreSQL** - Best choice for this project (see MONGODB_ANALYSIS.md for detailed comparison)
- **MongoDB** - Acceptable if team preference, but requires more careful implementation

📖 **See `MONGODB_ANALYSIS.md` for detailed comparison and `MONGODB_SETUP_GUIDE.md` for MongoDB setup instructions.**

---

### 🔄 Database ORM/ODM

#### **For PostgreSQL: Prisma** (Recommended)

**Why Prisma?**
- ✅ **Type-safe** - Auto-generated TypeScript types
- ✅ **Great DX** - Excellent developer experience
- ✅ **Migration system** - Easy database schema management
- ✅ **Query builder** - Intuitive API
- ✅ **Works with PostgreSQL** - Excellent support
- ✅ **Auto-completion** - Full IDE support
- ✅ **Modern** - Active development

**Alternative: TypeORM**
- ✅ More features (Active Record pattern)
- ✅ More mature
- ⚠️ More complex, steeper learning curve

**Alternative: Sequelize**
- ✅ Very mature
- ⚠️ Less type-safe, older API

#### **For MongoDB: Mongoose** (Required)

**Why Mongoose?**
- ✅ **Schema validation** - Enforce data structure
- ✅ **TypeScript support** - Type definitions available
- ✅ **Relationship management** - Handle references
- ✅ **Middleware hooks** - Pre/post save hooks
- ✅ **Better than raw driver** - Abstraction layer

**Recommendation:** 
- **PostgreSQL + Prisma** - Best developer experience
- **MongoDB + Mongoose** - Required for MongoDB (see MONGODB_SETUP_GUIDE.md)

---

### 🔌 Real-time Communication: **Socket.io**

**Why Socket.io?**
- ✅ **Works with both React and Flutter** - Has clients for both
- ✅ **Automatic fallback** - Falls back to polling if WebSocket unavailable
- ✅ **Room support** - Perfect for appointment updates per business
- ✅ **Reconnection handling** - Automatic reconnection logic
- ✅ **Event-based** - Easy to use API
- ✅ **Scalable** - Can use Redis adapter for multiple servers

**Flutter Integration:**
- `socket_io_client` package works perfectly
- Same events work for both web and mobile

**Recommendation:** **Socket.io** - Best choice for cross-platform real-time.

---

### 🔐 Authentication: **JWT (JSON Web Tokens)**

**Why JWT?**
- ✅ **Stateless** - No server-side session storage needed
- ✅ **Works with both clients** - React and Flutter can easily use JWT
- ✅ **Scalable** - Works across multiple servers
- ✅ **Standard** - Industry standard approach
- ✅ **Mobile-friendly** - Easy to store in Flutter secure storage

**Implementation:**
- Use `jsonwebtoken` library
- Store refresh tokens in database
- Implement token refresh mechanism

**Alternative: OAuth 2.0**
- ✅ More secure for third-party auth
- ⚠️ More complex setup
- Consider for Google/Facebook login

**Recommendation:** **JWT** for primary authentication, **OAuth 2.0** for social login.

---

### 📧 Notification Services

**Email:**
- **Nodemailer** (for sending)
- **SendGrid** or **AWS SES** (SMTP service)
- **Templates:** Handlebars or EJS

**SMS:**
- **Twilio** (most popular, reliable)
- Alternative: **AWS SNS**

**Push Notifications:**
- **Firebase Cloud Messaging (FCM)** - Works with both web and Flutter
- **OneSignal** - Alternative, easier setup

**Recommendation:** 
- Email: **Nodemailer + SendGrid**
- SMS: **Twilio**
- Push: **Firebase Cloud Messaging**

---

### 🗃️ Caching: **Redis**

**Why Redis?**
- ✅ **Fast** - In-memory storage
- ✅ **Session storage** - Store user sessions
- ✅ **Rate limiting** - Prevent API abuse
- ✅ **Real-time data cache** - Cache appointment availability
- ✅ **Pub/Sub** - For Socket.io scaling
- ✅ **Queue support** - Can use for background jobs

**Use Cases:**
- Cache frequently accessed data (services, resources)
- Store real-time availability calculations
- Session management
- Rate limiting
- Socket.io adapter for multi-server setup

**Recommendation:** **Redis** - Essential for performance and scaling.

---

### 📦 Background Jobs: **Bull Queue** (Redis-based)

**Why Bull?**
- ✅ **Redis-based** - Uses existing Redis infrastructure
- ✅ **Job scheduling** - Perfect for appointment reminders
- ✅ **Retry logic** - Built-in retry for failed jobs
- ✅ **Priority queues** - Can prioritize urgent notifications
- ✅ **Progress tracking** - Monitor job progress

**Use Cases:**
- Send appointment reminders (scheduled jobs)
- Generate daily reports
- Process bulk operations
- Email notifications

**Alternative: Agenda (MongoDB-based)**
- ⚠️ Requires MongoDB

**Recommendation:** **Bull Queue** - Best for Redis-based stack.

---

### 📊 API Documentation: **Swagger/OpenAPI**

**Why Swagger?**
- ✅ **Auto-generated docs** - From code annotations
- ✅ **Interactive testing** - Test API directly from docs
- ✅ **Client generation** - Can generate Flutter/React clients
- ✅ **Standard format** - OpenAPI 3.0 standard

**Implementation:**
- Use `swagger-jsdoc` and `swagger-ui-express`
- Document all endpoints
- Share with Flutter team for integration

**Recommendation:** **Swagger/OpenAPI** - Essential for team collaboration.

---

### 🧪 Testing

**Unit/Integration:**
- **Jest** - Test framework
- **Supertest** - API endpoint testing

**E2E:**
- **Postman/Newman** - API testing
- **Jest** - Integration tests

**Recommendation:** **Jest + Supertest** for comprehensive testing.

---

### 🔒 Security

**Libraries:**
- **helmet** - Security headers
- **express-rate-limit** - Rate limiting
- **bcrypt** - Password hashing
- **express-validator** - Input validation
- **cors** - CORS configuration

**Recommendation:** Use all of the above for comprehensive security.

---

### 📝 Logging & Monitoring

**Logging:**
- **Winston** - Structured logging
- **Morgan** - HTTP request logging

**Monitoring:**
- **PM2** - Process manager
- **Sentry** - Error tracking
- **Prometheus + Grafana** - Metrics (optional)

**Recommendation:** **Winston + Morgan** for logging, **PM2** for process management.

---

## Complete Backend Tech Stack

```yaml
Runtime:
  - Node.js 18+ (LTS)

Framework:
  - Express.js (or NestJS)

Language:
  - TypeScript

Database:
  - PostgreSQL 14+

ORM:
  - Prisma

Real-time:
  - Socket.io

Authentication:
  - JWT (jsonwebtoken)
  - bcrypt (password hashing)

Caching:
  - Redis

Background Jobs:
  - Bull Queue (Redis-based)

Email:
  - Nodemailer + SendGrid

SMS:
  - Twilio

Push Notifications:
  - Firebase Cloud Messaging

API Documentation:
  - Swagger/OpenAPI

Testing:
  - Jest + Supertest

Security:
  - helmet
  - express-rate-limit
  - express-validator
  - cors

Logging:
  - Winston
  - Morgan

Process Manager:
  - PM2
```

---

## Database Schema Considerations

### Key Design Principles

1. **Normalization:** Properly normalized to avoid data redundancy
2. **Indexes:** Strategic indexes for performance
3. **Constraints:** Foreign keys, unique constraints, check constraints
4. **Transactions:** Use transactions for multi-step operations (booking)
5. **Audit Trail:** Track all changes for accountability

### Important Tables

- `users` - All system users (clients, staff, admins)
- `resources` - Personnel and equipment
- `services` - Service catalog
- `appointments` - Bookings
- `schedules` - Personnel/equipment schedules
- `notifications` - Notification log
- `audit_logs` - Change tracking

See `ER_DIAGRAM.md` for complete schema.

---

## API Design Principles

### RESTful API Structure

```
Base URL: https://api.appointmentsystem.com/v1

Endpoints:
GET    /api/v1/appointments          # List appointments
POST   /api/v1/appointments          # Create appointment
GET    /api/v1/appointments/:id     # Get appointment
PUT    /api/v1/appointments/:id     # Update appointment
DELETE /api/v1/appointments/:id     # Cancel appointment

GET    /api/v1/resources             # List resources
POST   /api/v1/resources             # Create resource
GET    /api/v1/resources/:id         # Get resource
PUT    /api/v1/resources/:id        # Update resource
DELETE /api/v1/resources/:id        # Delete resource

GET    /api/v1/services              # List services
POST   /api/v1/services              # Create service
GET    /api/v1/services/:id         # Get service
PUT    /api/v1/services/:id         # Update service
DELETE /api/v1/services/:id         # Delete service

GET    /api/v1/clients               # List clients
POST   /api/v1/clients               # Create client
GET    /api/v1/clients/:id          # Get client
PUT    /api/v1/clients/:id          # Update client

POST   /api/v1/auth/login           # Login
POST   /api/v1/auth/register        # Register
POST   /api/v1/auth/refresh         # Refresh token
POST   /api/v1/auth/logout          # Logout

GET    /api/v1/availability          # Check availability
POST   /api/v1/notifications         # Send notification
```

### Response Format

```typescript
// Success Response
{
  "success": true,
  "data": { ... },
  "message": "Appointment created successfully"
}

// Error Response
{
  "success": false,
  "error": {
    "code": "APPOINTMENT_CONFLICT",
    "message": "Time slot already booked",
    "details": { ... }
  }
}
```

### Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict (e.g., booking conflict)
- `500` - Server Error

---

## Flutter Integration Considerations

### 1. **HTTP Client**
Flutter uses `http` or `dio` package - both work with REST APIs

### 2. **WebSocket**
Flutter uses `socket_io_client` - same Socket.io protocol

### 3. **Authentication**
- Store JWT in Flutter Secure Storage
- Include token in Authorization header
- Handle token refresh

### 4. **Error Handling**
- Consistent error response format
- Proper HTTP status codes
- Clear error messages

### 5. **Data Format**
- Use JSON (standard, works everywhere)
- Consistent date format (ISO 8601)
- Pagination for lists

### 6. **Real-time Events**
```javascript
// Backend emits
socket.emit('appointment:created', appointmentData);
socket.emit('appointment:updated', appointmentData);
socket.emit('appointment:cancelled', appointmentId);

// Both React and Flutter listen to same events
```

---

## Project Structure

```
backend/
├── src/
│   ├── config/              # Configuration files
│   │   ├── database.ts
│   │   ├── redis.ts
│   │   └── env.ts
│   ├── controllers/         # Route controllers
│   │   ├── appointmentController.ts
│   │   ├── resourceController.ts
│   │   ├── serviceController.ts
│   │   └── authController.ts
│   ├── services/            # Business logic
│   │   ├── appointmentService.ts
│   │   ├── resourceService.ts
│   │   ├── notificationService.ts
│   │   └── schedulingService.ts
│   ├── models/              # Prisma models (auto-generated)
│   ├── routes/              # API routes
│   │   ├── appointmentRoutes.ts
│   │   ├── resourceRoutes.ts
│   │   └── authRoutes.ts
│   ├── middleware/          # Custom middleware
│   │   ├── auth.ts
│   │   ├── validation.ts
│   │   └── errorHandler.ts
│   ├── utils/               # Utility functions
│   │   ├── logger.ts
│   │   └── helpers.ts
│   ├── types/               # TypeScript types
│   ├── jobs/                # Background jobs (Bull)
│   │   └── reminderJob.ts
│   ├── websocket/           # Socket.io handlers
│   │   └── socketHandler.ts
│   └── app.ts              # Express app setup
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── migrations/         # Database migrations
├── tests/                   # Test files
├── .env
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

---

## Getting Started

### Step 1: Initialize Project

```bash
# Create project
mkdir appointment-backend
cd appointment-backend
npm init -y

# Install dependencies
npm install express cors helmet morgan dotenv
npm install -D typescript @types/node @types/express @types/cors ts-node nodemon

# Install Prisma
npm install prisma @prisma/client
npx prisma init
```

### Step 2: Install Core Packages

```bash
# Database
npm install @prisma/client
npm install -D prisma

# Authentication
npm install jsonwebtoken bcrypt
npm install -D @types/jsonwebtoken @types/bcrypt

# Real-time
npm install socket.io

# Validation
npm install express-validator zod

# Security
npm install helmet express-rate-limit

# Caching
npm install redis ioredis

# Background Jobs
npm install bull

# Email
npm install nodemailer
npm install -D @types/nodemailer

# Logging
npm install winston

# API Docs
npm install swagger-jsdoc swagger-ui-express
npm install -D @types/swagger-jsdoc @types/swagger-ui-express
```

### Step 3: Setup Prisma Schema

```prisma
// prisma/schema.prisma
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
  role      Role     @default(CLIENT)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  appointments Appointment[]
  schedules    Schedule[]
}

enum Role {
  CLIENT
  STAFF
  MANAGER
  ADMIN
}

model Appointment {
  id            String            @id @default(uuid())
  clientId      String
  serviceId     String
  startDateTime DateTime
  endDateTime   DateTime
  status        AppointmentStatus @default(PENDING)
  notes         String?
  createdAt     DateTime          @default(now())
  updatedAt     DateTime          @updatedAt
  
  client  User     @relation(fields: [clientId], references: [id])
  service Service  @relation(fields: [serviceId], references: [id])
  
  @@index([startDateTime])
  @@index([clientId])
}

enum AppointmentStatus {
  PENDING
  CONFIRMED
  IN_PROGRESS
  COMPLETED
  CANCELLED
  NO_SHOW
}

model Service {
  id          String   @id @default(uuid())
  name        String
  description String?
  duration    Int      // minutes
  price       Decimal
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  appointments Appointment[]
}

// ... more models
```

### Step 4: Basic Express Setup

```typescript
// src/app.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './middleware/errorHandler';
import appointmentRoutes from './routes/appointmentRoutes';
import authRoutes from './routes/authRoutes';

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
  credentials: true,
}));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/appointments', appointmentRoutes);

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

---

## Environment Variables

```env
# .env
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/appointments_db"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRES_IN=7d

# Frontend URLs
FRONTEND_WEB_URL=http://localhost:3001
FRONTEND_MOBILE_URL=http://localhost

# Email (SendGrid)
SENDGRID_API_KEY=your-api-key
EMAIL_FROM=noreply@appointmentsystem.com

# SMS (Twilio)
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# Firebase (Push Notifications)
FIREBASE_SERVER_KEY=your-server-key

# Socket.io
SOCKET_IO_CORS_ORIGIN=http://localhost:3001
```

---

## Deployment Considerations

### Recommended Platforms

1. **Heroku** - Easy deployment, good for MVP
2. **AWS (EC2/ECS)** - Scalable, production-ready
3. **DigitalOcean** - Simple, cost-effective
4. **Railway** - Modern, easy setup
5. **Render** - Simple, good free tier

### Database Hosting

1. **AWS RDS** - Managed PostgreSQL
2. **Heroku Postgres** - Easy setup
3. **DigitalOcean Managed Databases** - Cost-effective
4. **Supabase** - Open-source Firebase alternative

### Redis Hosting

1. **Redis Cloud** - Managed Redis
2. **AWS ElastiCache** - AWS managed
3. **Upstash** - Serverless Redis

---

## Performance Optimization

1. **Database Indexing** - Index frequently queried columns
2. **Query Optimization** - Use Prisma query optimization
3. **Caching** - Cache frequently accessed data in Redis
4. **Connection Pooling** - Configure Prisma connection pool
5. **API Pagination** - Paginate large result sets
6. **Compression** - Use gzip compression
7. **CDN** - For static assets (if any)

---

## Security Best Practices

1. **HTTPS** - Always use HTTPS in production
2. **Environment Variables** - Never commit secrets
3. **Input Validation** - Validate all inputs
4. **SQL Injection** - Prisma handles this, but be careful with raw queries
5. **Rate Limiting** - Prevent API abuse
6. **CORS** - Configure CORS properly
7. **Helmet** - Security headers
8. **Password Hashing** - Use bcrypt with salt rounds
9. **JWT Security** - Use strong secrets, set expiration
10. **Audit Logging** - Log all sensitive operations

---

## Testing Strategy

### Unit Tests
- Test individual functions/services
- Mock database calls
- Use Jest

### Integration Tests
- Test API endpoints
- Use test database
- Use Supertest

### E2E Tests
- Test complete flows
- Use Postman/Newman

---

## Timeline Estimate

- **Week 1-2:** Project setup, database schema, Prisma setup
- **Week 3-4:** Authentication, basic CRUD APIs
- **Week 5-6:** Appointment booking logic, conflict resolution
- **Week 7-8:** Real-time WebSocket, notifications
- **Week 9-10:** Background jobs, optimization, testing
- **Week 11-12:** Documentation, deployment, bug fixes

---

## Resources

- [Express.js Documentation](https://expressjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Socket.io Documentation](https://socket.io/docs)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)

---

## Conclusion

**Recommended Stack:**
- **Backend:** Node.js + Express.js + TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Real-time:** Socket.io
- **Caching:** Redis
- **Jobs:** Bull Queue

This stack provides:
- ✅ Excellent compatibility with both React and Flutter
- ✅ Fast development velocity
- ✅ Scalable architecture
- ✅ Type safety with TypeScript
- ✅ Modern tooling and best practices
- ✅ Great developer experience

