# Entity Relationship Diagram (ERD)

## ERD Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                           USERS                                  │
├─────────────────────────────────────────────────────────────────┤
│ PK │ user_id (VARCHAR)                                         │
│    │ email (VARCHAR) UNIQUE                                    │
│    │ password_hash (VARCHAR)                                   │
│    │ first_name (VARCHAR)                                      │
│    │ last_name (VARCHAR)                                       │
│    │ phone_number (VARCHAR)                                    │
│    │ role (ENUM: CLIENT, STAFF, MANAGER, ADMIN)                │
│    │ is_active (BOOLEAN)                                       │
│    │ created_at (TIMESTAMP)                                    │
│    │ updated_at (TIMESTAMP)                                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ 1:1
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        PERSONNEL                                │
├─────────────────────────────────────────────────────────────────┤
│ PK │ personnel_id (VARCHAR)                                    │
│ FK │ user_id (VARCHAR) → USERS.user_id                         │
│    │ employee_id (VARCHAR) UNIQUE                              │
│    │ qualifications (TEXT)                                      │
│    │ hourly_rate (DECIMAL)                                     │
│    │ max_capacity (INTEGER)                                    │
│    │ created_at (TIMESTAMP)                                    │
│    │ updated_at (TIMESTAMP)                                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ 1:N
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         SCHEDULES                               │
├─────────────────────────────────────────────────────────────────┤
│ PK │ schedule_id (VARCHAR)                                     │
│ FK │ resource_id (VARCHAR) → RESOURCES.resource_id             │
│    │ date (DATE)                                               │
│    │ start_time (TIME)                                         │
│    │ end_time (TIME)                                           │
│    │ type (ENUM: SHIFT, BREAK, TIME_OFF, MAINTENANCE)          │
│    │ is_recurring (BOOLEAN)                                    │
│    │ recurrence_pattern (VARCHAR)                              │
│    │ notes (TEXT)                                              │
│    │ created_at (TIMESTAMP)                                    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                         RESOURCES                               │
├─────────────────────────────────────────────────────────────────┤
│ PK │ resource_id (VARCHAR)                                     │
│    │ name (VARCHAR)                                            │
│    │ type (ENUM: PERSONNEL, EQUIPMENT)                         │
│    │ status (ENUM: AVAILABLE, UNAVAILABLE, MAINTENANCE)        │
│    │ is_active (BOOLEAN)                                       │
│    │ created_at (TIMESTAMP)                                    │
│    │ updated_at (TIMESTAMP)                                    │
└─────────────────────────────────────────────────────────────────┘
        │                                    │
        │ 1:N                                │ 1:N
        │                                    │
        ▼                                    ▼
┌──────────────────────────┐   ┌──────────────────────────┐
│      EQUIPMENT           │   │   RESOURCE_ALLOCATIONS   │
├──────────────────────────┤   ├──────────────────────────┤
│ PK │ equipment_id       │   │ PK │ allocation_id        │
│ FK │ resource_id        │   │ FK │ appointment_id      │
│    │ model (VARCHAR)     │   │ FK │ resource_id         │
│    │ serial_number      │   │    │ start_time (TIMESTAMP)│
│    │ maintenance_schedule│  │    │ end_time (TIMESTAMP) │
│    │ last_maintenance   │   │    │ status (ENUM)        │
│    │ next_maintenance   │   │    │ created_at (TIMESTAMP)│
└──────────────────────────┘   └──────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                          CLIENTS                                │
├─────────────────────────────────────────────────────────────────┤
│ PK │ client_id (VARCHAR)                                       │
│ FK │ user_id (VARCHAR) → USERS.user_id                         │
│    │ preferences (JSON)                                        │
│    │ notes (TEXT)                                              │
│    │ total_appointments (INTEGER)                              │
│    │ last_visit (DATE)                                         │
│    │ created_at (TIMESTAMP)                                    │
│    │ updated_at (TIMESTAMP)                                    │
└─────────────────────────────────────────────────────────────────┘
        │
        │ 1:N
        │
        ▼
┌─────────────────────────────────────────────────────────────────┐
│                       APPOINTMENTS                              │
├─────────────────────────────────────────────────────────────────┤
│ PK │ appointment_id (VARCHAR)                                  │
│ FK │ client_id (VARCHAR) → CLIENTS.client_id                   │
│ FK │ service_id (VARCHAR) → SERVICES.service_id                │
│    │ start_date_time (TIMESTAMP)                               │
│    │ end_date_time (TIMESTAMP)                                 │
│    │ status (ENUM: PENDING, CONFIRMED, IN_PROGRESS,            │
│    │            COMPLETED, CANCELLED, NO_SHOW)                 │
│    │ notes (TEXT)                                              │
│    │ cancellation_reason (TEXT)                                │
│    │ cancelled_at (TIMESTAMP)                                  │
│    │ created_at (TIMESTAMP)                                    │
│    │ updated_at (TIMESTAMP)                                    │
└─────────────────────────────────────────────────────────────────┘
        │
        │ 1:N
        │
        ▼
┌─────────────────────────────────────────────────────────────────┐
│                  RECURRING_APPOINTMENTS                          │
├─────────────────────────────────────────────────────────────────┤
│ PK │ recurring_id (VARCHAR)                                    │
│ FK │ client_id (VARCHAR) → CLIENTS.client_id                   │
│ FK │ service_id (VARCHAR) → SERVICES.service_id                │
│    │ frequency (ENUM: DAILY, WEEKLY, MONTHLY)                  │
│    │ start_date (DATE)                                         │
│    │ end_date (DATE)                                           │
│    │ day_of_week (INTEGER)                                     │
│    │ time (TIME)                                               │
│    │ is_active (BOOLEAN)                                       │
│    │ created_at (TIMESTAMP)                                    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                         SERVICES                                 │
├─────────────────────────────────────────────────────────────────┤
│ PK │ service_id (VARCHAR)                                      │
│ FK │ category_id (VARCHAR) → SERVICE_CATEGORIES.category_id    │
│    │ name (VARCHAR)                                            │
│    │ description (TEXT)                                        │
│    │ duration (INTEGER) -- minutes                              │
│    │ price (DECIMAL)                                           │
│    │ is_active (BOOLEAN)                                       │
│    │ created_at (TIMESTAMP)                                    │
│    │ updated_at (TIMESTAMP)                                    │
└─────────────────────────────────────────────────────────────────┘
        │
        │ 1:N
        │
        ▼
┌─────────────────────────────────────────────────────────────────┐
│              RESOURCE_REQUIREMENTS                               │
├─────────────────────────────────────────────────────────────────┤
│ PK │ requirement_id (VARCHAR)                                  │
│ FK │ service_id (VARCHAR) → SERVICES.service_id                │
│    │ resource_type (ENUM: PERSONNEL, EQUIPMENT)                │
│    │ quantity (INTEGER)                                        │
│    │ is_exclusive (BOOLEAN)                                    │
│    │ created_at (TIMESTAMP)                                    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    SERVICE_CATEGORIES                            │
├─────────────────────────────────────────────────────────────────┤
│ PK │ category_id (VARCHAR)                                     │
│    │ name (VARCHAR)                                            │
│    │ description (TEXT)                                        │
│    │ created_at (TIMESTAMP)                                    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                         WAITLIST                                 │
├─────────────────────────────────────────────────────────────────┤
│ PK │ waitlist_id (VARCHAR)                                     │
│ FK │ client_id (VARCHAR) → CLIENTS.client_id                   │
│ FK │ service_id (VARCHAR) → SERVICES.service_id                │
│    │ preferred_date (DATE)                                     │
│    │ preferred_time (TIME)                                     │
│    │ priority (INTEGER)                                        │
│    │ status (ENUM: ACTIVE, NOTIFIED, CANCELLED)                │
│    │ created_at (TIMESTAMP)                                    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                       NOTIFICATIONS                              │
├─────────────────────────────────────────────────────────────────┤
│ PK │ notification_id (VARCHAR)                                 │
│ FK │ recipient_id (VARCHAR) → USERS.user_id                    │
│ FK │ appointment_id (VARCHAR) → APPOINTMENTS.appointment_id  │
│ FK │ template_id (VARCHAR) → NOTIFICATION_TEMPLATES.template_id│
│    │ type (ENUM: CONFIRMATION, REMINDER, CANCELLATION,          │
│    │            RESCHEDULE, NO_SHOW)                            │
│    │ channel (ENUM: EMAIL, SMS, PUSH)                          │
│    │ subject (VARCHAR)                                         │
│    │ message (TEXT)                                            │
│    │ status (ENUM: PENDING, SENT, DELIVERED, FAILED)           │
│    │ sent_at (TIMESTAMP)                                       │
│    │ delivered_at (TIMESTAMP)                                  │
│    │ created_at (TIMESTAMP)                                    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                  NOTIFICATION_TEMPLATES                          │
├─────────────────────────────────────────────────────────────────┤
│ PK │ template_id (VARCHAR)                                     │
│    │ type (ENUM: CONFIRMATION, REMINDER, CANCELLATION, etc.)    │
│    │ channel (ENUM: EMAIL, SMS, PUSH)                          │
│    │ subject (VARCHAR)                                         │
│    │ body (TEXT)                                               │
│    │ variables (JSON)                                           │
│    │ is_active (BOOLEAN)                                       │
│    │ created_at (TIMESTAMP)                                    │
│    │ updated_at (TIMESTAMP)                                    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        AUDIT_LOGS                               │
├─────────────────────────────────────────────────────────────────┤
│ PK │ log_id (VARCHAR)                                          │
│ FK │ user_id (VARCHAR) → USERS.user_id                         │
│    │ entity_type (VARCHAR)                                     │
│    │ entity_id (VARCHAR)                                        │
│    │ action (VARCHAR)                                           │
│    │ old_value (JSON)                                           │
│    │ new_value (JSON)                                           │
│    │ ip_address (VARCHAR)                                       │
│    │ timestamp (TIMESTAMP)                                      │
└─────────────────────────────────────────────────────────────────┘
```

## Relationship Summary

### One-to-One (1:1)
- **USERS** ↔ **PERSONNEL** (via user_id)
- **USERS** ↔ **CLIENTS** (via user_id)
- **RESOURCES** ↔ **EQUIPMENT** (via resource_id)

### One-to-Many (1:N)
- **USERS** → **NOTIFICATIONS** (recipient)
- **CLIENTS** → **APPOINTMENTS**
- **CLIENTS** → **WAITLIST**
- **CLIENTS** → **RECURRING_APPOINTMENTS**
- **SERVICES** → **APPOINTMENTS**
- **SERVICES** → **RESOURCE_REQUIREMENTS**
- **SERVICE_CATEGORIES** → **SERVICES**
- **APPOINTMENTS** → **RESOURCE_ALLOCATIONS**
- **APPOINTMENTS** → **NOTIFICATIONS**
- **RESOURCES** → **SCHEDULES**
- **RESOURCES** → **RESOURCE_ALLOCATIONS**
- **PERSONNEL** → **SCHEDULES**
- **NOTIFICATION_TEMPLATES** → **NOTIFICATIONS**

### Many-to-Many (M:N)
- **APPOINTMENTS** ↔ **RESOURCES** (via RESOURCE_ALLOCATIONS)
- **SERVICES** ↔ **RESOURCES** (via RESOURCE_REQUIREMENTS)

## Key Constraints

1. **Foreign Key Constraints:**
   - All FK relationships enforce referential integrity
   - Cascade delete rules for dependent entities

2. **Unique Constraints:**
   - user_id, email in USERS
   - employee_id in PERSONNEL
   - serial_number in EQUIPMENT

3. **Check Constraints:**
   - end_date_time > start_date_time in APPOINTMENTS
   - end_time > start_time in SCHEDULES
   - price >= 0 in SERVICES
   - quantity > 0 in RESOURCE_REQUIREMENTS

4. **Indexes:**
   - Primary keys (all tables)
   - Foreign keys (all FK columns)
   - start_date_time, end_date_time in APPOINTMENTS
   - date, start_time, end_time in SCHEDULES
   - email in USERS
   - status in APPOINTMENTS, RESOURCES

