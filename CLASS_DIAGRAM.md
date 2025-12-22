# Class Diagram - Appointment Management System

## Class Diagram Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER (Abstract)                         │
├─────────────────────────────────────────────────────────────────┤
│ - userId: String                                                │
│ - email: String                                                 │
│ - password: String                                              │
│ - firstName: String                                             │
│ - lastName: String                                              │
│ - phoneNumber: String                                           │
│ - createdAt: DateTime                                           │
│ - updatedAt: DateTime                                           │
│ - isActive: Boolean                                             │
├─────────────────────────────────────────────────────────────────┤
│ + login(): Boolean                                              │
│ + logout(): void                                                │
│ + updateProfile(): void                                         │
│ + changePassword(): void                                        │
└─────────────────────────────────────────────────────────────────┘
                              ▲
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
┌───────┴────────┐   ┌────────┴────────┐   ┌───────┴────────┐
│     CLIENT    │   │      STAFF       │   │     ADMIN      │
├───────────────┤   ├──────────────────┤   ├────────────────┤
│ - clientId    │   │ - staffId        │   │ - adminId      │
│ - preferences │   │ - employeeId     │   │ - permissions  │
│ - notes       │   │ - role           │   │                │
├───────────────┤   │ - qualifications │   ├────────────────┤
│ + bookAppt()  │   │ - hourlyRate     │   │ + manageUsers()│
│ + cancelAppt()│   ├──────────────────┤   │ + configure()  │
│ + viewHistory()│  │ + viewSchedule() │   └────────────────┘
└───────────────┘   │ + requestTimeOff()│
                    └──────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        RESOURCE (Abstract)                      │
├─────────────────────────────────────────────────────────────────┤
│ - resourceId: String                                            │
│ - name: String                                                  │
│ - type: ResourceType                                            │
│ - status: ResourceStatus                                        │
│ - isActive: Boolean                                             │
│ - createdAt: DateTime                                           │
│ - updatedAt: DateTime                                           │
├─────────────────────────────────────────────────────────────────┤
│ + checkAvailability(): Boolean                                  │
│ + getSchedule(): Schedule                                       │
│ + updateStatus(): void                                          │
└─────────────────────────────────────────────────────────────────┘
                            ▲
                            │
        ┌────────────────────────────────────────┐
        │                   │                    │
┌───────┴────────┐   ┌──────┴────────┐
│   PERSONNEL    │   │   EQUIPMENT   │
├────────────────┤   ├───────────────┤
│ - personnelId  │   │ - equipmentId │
│ - userId       │   │ - model       │
│ - qualifications│  │ - serialNumber│
│ - hourlyRate   │   │ - maintenance │
│ - maxCapacity  │   │   Schedule    │
├────────────────┤   ├───────────────┤
│ + getShifts()  │   │ + scheduleMain│
│ + requestOff() │   │   tenance()   │
└────────────────┘   └───────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                           SERVICE                                │
├─────────────────────────────────────────────────────────────────┤
│ - serviceId: String                                             │
│ - name: String                                                  │
│ - description: String                                           │
│ - duration: Integer (minutes)                                   │
│ - price: Decimal                                                │
│ - category: ServiceCategory                                     │
│ - isActive: Boolean                                             │
│ - createdAt: DateTime                                           │
│ - updatedAt: DateTime                                           │
├─────────────────────────────────────────────────────────────────┤
│ + getRequiredResources(): List<ResourceRequirement>            │
│ + calculatePrice(): Decimal                                     │
│ + isAvailable(): Boolean                                        │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        APPOINTMENT                               │
├─────────────────────────────────────────────────────────────────┤
│ - appointmentId: String                                        │
│ - clientId: String                                              │
│ - serviceId: String                                             │
│ - startDateTime: DateTime                                       │
│ - endDateTime: DateTime                                         │
│ - status: AppointmentStatus                                     │
│ - notes: String                                                 │
│ - createdAt: DateTime                                           │
│ - updatedAt: DateTime                                           │
│ - cancelledAt: DateTime                                         │
│ - cancellationReason: String                                    │
├─────────────────────────────────────────────────────────────────┤
│ + checkAvailability(): Boolean                                 │
│ + allocateResources(): void                                     │
│ + cancel(): void                                                │
│ + reschedule(): Boolean                                         │
│ + sendReminder(): void                                          │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    RESOURCE_ALLOCATION                           │
├─────────────────────────────────────────────────────────────────┤
│ - allocationId: String                                         │
│ - appointmentId: String                                         │
│ - resourceId: String                                            │
│ - startTime: DateTime                                           │
│ - endTime: DateTime                                             │
│ - status: AllocationStatus                                      │
├─────────────────────────────────────────────────────────────────┤
│ + release(): void                                               │
│ + isConflicting(): Boolean                                      │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    RESOURCE_REQUIREMENT                          │
├─────────────────────────────────────────────────────────────────┤
│ - requirementId: String                                        │
│ - serviceId: String                                             │
│ - resourceType: ResourceType                                    │
│ - quantity: Integer                                             │
│ - isExclusive: Boolean                                          │
├─────────────────────────────────────────────────────────────────┤
│ + validateAvailability(): Boolean                              │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                          SCHEDULE                                │
├─────────────────────────────────────────────────────────────────┤
│ - scheduleId: String                                            │
│ - resourceId: String                                            │
│ - date: Date                                                    │
│ - startTime: Time                                               │
│ - endTime: Time                                                 │
│ - type: ScheduleType (SHIFT, BREAK, TIME_OFF, MAINTENANCE)     │
│ - isRecurring: Boolean                                          │
├─────────────────────────────────────────────────────────────────┤
│ + isAvailable(): Boolean                                        │
│ + overlaps(): Boolean                                           │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      RECURRING_APPOINTMENT                       │
├─────────────────────────────────────────────────────────────────┤
│ - recurringId: String                                          │
│ - clientId: String                                              │
│ - serviceId: String                                             │
│ - frequency: RecurrenceFrequency                                │
│ - startDate: Date                                               │
│ - endDate: Date                                                 │
│ - dayOfWeek: Integer                                            │
│ - time: Time                                                    │
│ - isActive: Boolean                                             │
├─────────────────────────────────────────────────────────────────┤
│ + generateAppointments(): List<Appointment>                    │
│ + cancel(): void                                                │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                         WAITLIST                                 │
├─────────────────────────────────────────────────────────────────┤
│ - waitlistId: String                                            │
│ - clientId: String                                              │
│ - serviceId: String                                             │
│ - preferredDate: Date                                           │
│ - preferredTime: Time                                           │
│ - priority: Integer                                             │
│ - createdAt: DateTime                                           │
├─────────────────────────────────────────────────────────────────┤
│ + notifyAvailability(): void                                   │
│ + promoteToAppointment(): Appointment                          │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                       NOTIFICATION                               │
├─────────────────────────────────────────────────────────────────┤
│ - notificationId: String                                        │
│ - recipientId: String                                           │
│ - type: NotificationType                                        │
│ - channel: NotificationChannel                                  │
│ - subject: String                                               │
│ - message: String                                               │
│ - status: NotificationStatus                                    │
│ - sentAt: DateTime                                              │
│ - deliveredAt: DateTime                                         │
├─────────────────────────────────────────────────────────────────┤
│ + send(): Boolean                                               │
│ + markDelivered(): void                                         │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      NOTIFICATION_TEMPLATE                       │
├─────────────────────────────────────────────────────────────────┤
│ - templateId: String                                            │
│ - type: NotificationType                                        │
│ - channel: NotificationChannel                                  │
│ - subject: String                                               │
│ - body: String                                                  │
│ - variables: Map<String, String>                                │
├─────────────────────────────────────────────────────────────────┤
│ + render(): String                                              │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                          AUDIT_LOG                               │
├─────────────────────────────────────────────────────────────────┤
│ - logId: String                                                 │
│ - userId: String                                                │
│ - entityType: String                                            │
│ - entityId: String                                              │
│ - action: String                                                │
│ - oldValue: String                                              │
│ - newValue: String                                              │
│ - timestamp: DateTime                                           │
│ - ipAddress: String                                             │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        APPOINTMENT_SERVICE                      │
├─────────────────────────────────────────────────────────────────┤
│ + createAppointment(): Appointment                              │
│ + cancelAppointment(): Boolean                                  │
│ + rescheduleAppointment(): Boolean                              │
│ + checkAvailability(): Boolean                                 │
│ + allocateResources(): void                                     │
│ + sendNotifications(): void                                     │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      RESOURCE_SERVICE                            │
├─────────────────────────────────────────────────────────────────┤
│ + createResource(): Resource                                    │
│ + updateResource(): Resource                                    │
│ + deleteResource(): Boolean                                     │
│ + checkAvailability(): Boolean                                 │
│ + getSchedule(): List<Schedule>                                │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      NOTIFICATION_SERVICE                        │
├─────────────────────────────────────────────────────────────────┤
│ + sendEmail(): Boolean                                          │
│ + sendSMS(): Boolean                                            │
│ + sendPush(): Boolean                                           │
│ + scheduleReminder(): void                                      │
└─────────────────────────────────────────────────────────────────┘
```

## Relationships

### Associations
- **User** → **Appointment** (1 to many)
- **Client** → **Appointment** (1 to many)
- **Service** → **Appointment** (1 to many)
- **Service** → **ResourceRequirement** (1 to many)
- **Appointment** → **ResourceAllocation** (1 to many)
- **Resource** → **ResourceAllocation** (1 to many)
- **Resource** → **Schedule** (1 to many)
- **Client** → **Waitlist** (1 to many)
- **User** → **Notification** (1 to many)
- **Personnel** → **User** (1 to 1)

### Inheritance
- **User** ← **Client**, **Staff**, **Admin**
- **Resource** ← **Personnel**, **Equipment**

### Composition
- **Appointment** contains **ResourceAllocation**
- **Service** contains **ResourceRequirement**

## Enumerations

```java
enum ResourceType {
    PERSONNEL, EQUIPMENT
}

enum ResourceStatus {
    AVAILABLE, UNAVAILABLE, MAINTENANCE, BOOKED
}

enum AppointmentStatus {
    PENDING, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED, NO_SHOW
}

enum NotificationType {
    CONFIRMATION, REMINDER, CANCELLATION, RESCHEDULE, NO_SHOW
}

enum NotificationChannel {
    EMAIL, SMS, PUSH
}

enum NotificationStatus {
    PENDING, SENT, DELIVERED, FAILED
}

enum ScheduleType {
    SHIFT, BREAK, TIME_OFF, MAINTENANCE
}

enum RecurrenceFrequency {
    DAILY, WEEKLY, MONTHLY
}
```

