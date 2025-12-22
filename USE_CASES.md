# Use Case Specifications

## Use Case Diagram Overview

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
       ├─── Register Account
       ├─── Browse Services
       ├─── Book Appointment
       ├─── View Booking History
       ├─── Cancel Appointment
       ├─── Update Profile
       └─── Receive Notifications
       │
┌──────┴──────┐
│   System    │
└─────────────┘

┌─────────────┐
│    Staff    │
└──────┬──────┘
       │
       ├─── View Personal Schedule
       ├─── Update Appointment Status
       ├─── View Client Information
       ├─── Request Time-Off
       └─── Receive Notifications
       │
┌──────┴──────┐
│   System    │
└─────────────┘

┌─────────────┐
│   Manager   │
└──────┬──────┘
       │
       ├─── View All Schedules
       ├─── Approve Appointments
       ├─── Manage Personnel Schedules
       ├─── Generate Reports
       ├─── Handle Cancellations
       ├─── Manage Services
       └─── View Resource Utilization
       │
┌──────┴──────┐
│   System    │
└─────────────┘

┌─────────────┐
│    Admin    │
└──────┬──────┘
       │
       ├─── Manage Resources (CRUD)
       ├─── Manage Services (CRUD)
       ├─── Manage Staff Accounts
       ├─── View System Reports
       ├─── Configure System Settings
       ├─── Manage User Roles
       └─── View Audit Logs
       │
┌──────┴──────┐
│   System    │
└─────────────┘
```

## Detailed Use Cases

### UC-01: Register Account
**Actor:** Client  
**Preconditions:** None  
**Main Flow:**
1. Client accesses registration page
2. Client enters personal information (name, email, phone)
3. Client sets password
4. System validates information
5. System creates account
6. System sends confirmation email
7. Use case ends

**Alternative Flows:**
- 4a. Invalid information → Display error, return to step 2
- 5a. Email already exists → Display error, return to step 2

**Postconditions:** Client account created and active

---

### UC-02: Book Appointment
**Actor:** Client, Staff  
**Preconditions:** Client is logged in, Services are available  
**Main Flow:**
1. Actor selects service
2. System displays available time slots
3. Actor selects date and time
4. Actor optionally selects preferred personnel
5. System checks resource availability
6. System checks personnel availability
7. System creates appointment
8. System allocates resources
9. System sends confirmation notification
10. Use case ends

**Alternative Flows:**
- 5a. Resources unavailable → Display message, return to step 2
- 6a. Personnel unavailable → Suggest alternatives or return to step 4
- 7a. Conflict detected → Display error, return to step 3

**Postconditions:** Appointment created, resources allocated, notifications sent

---

### UC-03: Manage Resources
**Actor:** Admin  
**Preconditions:** Admin is logged in  
**Main Flow:**
1. Admin navigates to resource management
2. Admin selects action (Create/Update/Delete)
3. Admin enters resource details
4. System validates information
5. System saves changes
6. System updates availability calendar
7. Use case ends

**Alternative Flows:**
- 4a. Invalid data → Display error, return to step 3
- 5a. Resource has active appointments → Display warning, require confirmation

**Postconditions:** Resource database updated

---

### UC-04: Manage Personnel Schedule
**Actor:** Manager, Admin  
**Preconditions:** Manager/Admin is logged in  
**Main Flow:**
1. Actor selects personnel
2. Actor views current schedule
3. Actor adds/modifies shifts
4. Actor sets breaks and time-off
5. System validates schedule conflicts
6. System updates schedule
7. System updates availability calendar
8. Use case ends

**Alternative Flows:**
- 5a. Schedule conflict → Display warning, allow override or return to step 3

**Postconditions:** Personnel schedule updated

---

### UC-05: Cancel Appointment
**Actor:** Client, Staff, Manager  
**Preconditions:** Appointment exists  
**Main Flow:**
1. Actor selects appointment
2. Actor confirms cancellation
3. System releases allocated resources
4. System updates availability
5. System sends cancellation notification
6. System checks waitlist
7. If waitlist exists, notify next client
8. Use case ends

**Postconditions:** Appointment cancelled, resources freed, notifications sent

---

### UC-06: Generate Reports
**Actor:** Manager, Admin  
**Preconditions:** Actor is logged in  
**Main Flow:**
1. Actor selects report type
2. Actor sets date range and filters
3. System generates report
4. System displays report
5. Actor can export report
6. Use case ends

**Report Types:**
- Daily bookings
- Resource utilization
- Revenue reports
- No-show reports
- Client statistics

---

### UC-07: Send Notifications
**Actor:** System  
**Preconditions:** Event triggered (booking, cancellation, reminder)  
**Main Flow:**
1. System identifies notification type
2. System retrieves recipient information
3. System selects notification template
4. System personalizes message
5. System sends via selected channel (Email/SMS/Push)
6. System logs notification
7. Use case ends

**Alternative Flows:**
- 5a. Delivery failure → Retry mechanism, log error

---

### UC-08: Manage Services
**Actor:** Admin, Manager  
**Preconditions:** Actor is logged in  
**Main Flow:**
1. Actor navigates to service management
2. Actor selects action (Create/Update/Delete)
3. Actor enters service details (name, duration, price, resources)
4. System validates information
5. System saves changes
6. Use case ends

**Alternative Flows:**
- 4a. Invalid data → Display error, return to step 3
- 5a. Service has active appointments → Display warning

**Postconditions:** Service catalog updated

