# Sequence Diagrams - Key Use Cases

## SD-01: Book Appointment

```
Client          Web/Mobile App    AppointmentService    ResourceService    NotificationService    Database
  |                    |                    |                    |                    |              |
  |--Book Request----->|                    |                    |                    |              |
  |                    |--Create Request--->|                    |                    |              |
  |                    |                    |--Check Availability|                    |              |
  |                    |                    |<--Available--------|                    |              |
  |                    |                    |--Allocate Resources|                    |              |
  |                    |                    |<--Allocated--------|                    |              |
  |                    |                    |--Save Appointment->|                    |              |
  |                    |                    |                    |                    |              |--Save--|
  |                    |                    |                    |                    |              |<--OK---|
  |                    |                    |<--Success----------|                    |              |
  |                    |                    |--Send Notification-|                    |              |
  |                    |                    |                    |                    |--Send Email->|
  |                    |                    |                    |                    |<--Sent-------|
  |                    |<--Success----------|                    |                    |              |
  |<--Confirmation-----|                    |                    |                    |              |
```

## SD-02: Cancel Appointment

```
Client          Web/Mobile App    AppointmentService    ResourceService    NotificationService    WaitlistService    Database
  |                    |                    |                    |                    |                    |              |
  |--Cancel Request--->|                    |                    |                    |                    |              |
  |                    |--Cancel Request--->|                    |                    |                    |              |
  |                    |                    |--Get Appointment-->|                    |                    |              |
  |                    |                    |                    |                    |                    |--Query--|
  |                    |                    |                    |                    |                    |<--Data--|
  |                    |                    |<--Appointment------|                    |                    |              |
  |                    |                    |--Release Resources|                    |                    |              |
  |                    |                    |                    |--Release--------->|                    |              |
  |                    |                    |                    |<--Released--------|                    |              |
  |                    |                    |--Update Status--->|                    |                    |              |
  |                    |                    |                    |                    |                    |--Update-|
  |                    |                    |                    |                    |                    |<--OK----|
  |                    |                    |--Send Notification|                    |                    |              |
  |                    |                    |                    |                    |--Send Email---->|              |
  |                    |                    |                    |                    |<--Sent----------|              |
  |                    |                    |--Check Waitlist---|                    |                    |              |
  |                    |                    |                    |                    |                    |--Check--|
  |                    |                    |                    |                    |                    |<--Found-|
  |                    |                    |                    |                    |                    |              |
  |                    |                    |                    |                    |--Notify Client->|              |
  |                    |<--Success----------|                    |                    |                    |              |
  |<--Confirmation-----|                    |                    |                    |                    |              |
```

## SD-03: Manage Personnel Schedule

```
Manager         Web App           ScheduleService      ResourceService    Personnel          Database
  |                    |                    |                    |              |              |
  |--View Schedule----->|                    |                    |              |              |
  |                    |--Get Schedule----->|                    |              |              |
  |                    |                    |                    |              |              |--Query--|
  |                    |                    |                    |              |              |<--Data--|
  |                    |<--Schedule---------|                    |              |              |
  |<--Display Schedule-|                    |                    |              |              |
  |                    |                    |                    |              |              |
  |--Add Shift-------->|                    |                    |              |              |
  |                    |--Create Shift----->|                    |              |              |
  |                    |                    |--Validate-------->|              |              |
  |                    |                    |                    |              |--Check Conflicts|
  |                    |                    |                    |              |<--No Conflicts-|
  |                    |                    |<--Valid-----------|              |              |
  |                    |                    |--Save Schedule--->|              |              |
  |                    |                    |                    |              |              |--Save--|
  |                    |                    |                    |              |              |<--OK---|
  |                    |                    |--Update Availability|          |              |
  |                    |                    |                    |              |              |--Update|
  |                    |                    |                    |              |              |<--OK---|
  |                    |<--Success----------|                    |              |              |
  |<--Confirmation-----|                    |                    |              |              |
```

## SD-04: Real-time Synchronization

```
Client A        Web App A         Backend API          WebSocket Server    Client B        Web App B
  |                    |                    |                    |              |                    |
  |--Book Appointment->|                    |                    |              |                    |
  |                    |--API Request------>|                    |              |                    |
  |                    |                    |--Process--------->|              |                    |
  |                    |                    |--Save to DB------>|              |                    |
  |                    |                    |<--Success---------|              |                    |
  |                    |                    |--Broadcast Event-->|              |                    |
  |                    |                    |                    |--Push Update->|                    |
  |                    |<--Success----------|                    |              |                    |
  |<--Confirmation-----|                    |                    |              |                    |
  |                    |                    |                    |              |<--Update Received|
  |                    |                    |                    |              |--Refresh UI------>|
  |                    |                    |                    |              |<--Updated---------|
```

## SD-05: Send Notification (Reminder)

```
System          NotificationService    NotificationTemplate    EmailService    SMSService    PushService    Database
  |                    |                    |                    |              |              |              |
  |--Trigger Reminder-->|                    |                    |              |              |              |
  |                    |--Get Appointments->|                    |              |              |              |
  |                    |                    |                    |              |              |              |--Query--|
  |                    |                    |                    |              |              |              |<--Data--|
  |                    |<--Appointments------|                    |              |              |              |
  |                    |                    |                    |              |              |              |
  |                    |--For Each Appointment|                  |              |              |              |
  |                    |  --Get Template---->|                  |              |              |              |
  |                    |  <--Template--------|                  |              |              |              |
  |                    |  --Render Message--|                  |              |              |              |
  |                    |  <--Message---------|                  |              |              |              |
  |                    |  --Send Email------>|                  |              |              |              |
  |                    |                      |--Send----------->|              |              |              |
  |                    |                      |<--Sent-----------|              |              |              |
  |                    |  --Send SMS--------->|                  |              |              |              |
  |                    |                      |                  |--Send-------->|              |              |
  |                    |                      |                  |<--Sent--------|              |              |
  |                    |  --Send Push-------->|                  |              |              |              |
  |                    |                      |                  |              |--Send-------->|              |
  |                    |                      |                  |              |<--Sent--------|              |
  |                    |  --Log Notification|                  |              |              |              |
  |                    |                      |                  |              |              |              |--Save--|
  |                    |                      |                  |              |              |              |<--OK---|
  |                    |<--Completed----------|                  |              |              |              |
  |<--Success----------|                    |                    |              |              |              |
```

## SD-06: Check Resource Availability

```
AppointmentService    ResourceService    ScheduleService    Resource          Database
  |                    |                    |              |              |
  |--Check Availability|                    |              |              |
  |                    |--Get Resources---->|              |              |
  |                    |                    |              |              |--Query--|
  |                    |                    |              |              |<--Data--|
  |                    |<--Resources--------|              |              |
  |                    |                    |              |              |
  |                    |--For Each Resource|              |              |
  |                    |  --Get Schedule--->|              |              |
  |                    |                    |--Query------>|              |
  |                    |                    |              |              |--Query--|
  |                    |                    |              |              |<--Data--|
  |                    |                    |<--Schedule---|              |
  |                    |  --Check Conflicts|              |              |
  |                    |  --Check Capacity-|              |              |
  |                    |  <--Available------|              |              |
  |                    |<--All Available----|              |              |
  |<--Availability Result|                  |              |              |
```

## SD-07: Waitlist Management

```
System          WaitlistService    AppointmentService    NotificationService    Client          Database
  |                    |                    |                    |              |              |
  |--Slot Available---->|                    |                    |              |              |
  |                    |--Get Waitlist----->|                    |              |              |
  |                    |                    |                    |              |              |--Query--|
  |                    |                    |                    |              |              |<--Data--|
  |                    |<--Waitlist---------|                    |              |              |
  |                    |                    |                    |              |              |
  |                    |--Sort by Priority-|                    |              |              |
  |                    |--Get First Client->|                    |              |              |
  |                    |                    |                    |              |              |
  |                    |--Create Appointment|                   |              |              |
  |                    |                    |--Create---------->|              |              |
  |                    |                    |<--Created---------|              |              |
  |                    |--Remove from Waitlist|                 |              |              |
  |                    |                    |                    |              |              |--Delete-|
  |                    |                    |                    |              |              |<--OK---|
  |                    |--Send Notification-|                    |              |              |
  |                    |                    |--Notify Client---->|              |              |
  |                    |                    |                    |--Send Email-->|              |
  |                    |                    |                    |<--Sent--------|              |
  |                    |                    |                    |              |<--Notification|
  |<--Completed--------|                    |                    |              |              |
```

