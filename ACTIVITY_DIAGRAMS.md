# Activity Diagrams - Key Processes

## AD-01: Book Appointment Process

```
[Start]
   │
   ▼
[Client Selects Service]
   │
   ▼
[System Displays Available Time Slots]
   │
   ▼
[Client Selects Date & Time]
   │
   ▼
[Client Optionally Selects Personnel]
   │
   ▼
[System Checks Resource Availability]
   │
   ├─[Resources Available?]──No──>[Display Error Message]
   │  │                                    │
   │  Yes                                  │
   │  │                                    │
   │  ▼                                    │
   │[System Checks Personnel Availability]│
   │  │                                    │
   │  ├─[Personnel Available?]──No─────────┘
   │  │  │
   │  Yes│
   │  │  │
   │  ▼  │
   │[Create Appointment Record]
   │  │  │
   │  ▼  │
   │[Allocate Resources]
   │  │  │
   │  ▼  │
   │[Update Availability Calendar]
   │  │  │
   │  ▼  │
   │[Send Confirmation Notification]
   │  │  │
   │  ▼  │
   │[Display Success Message]
   │  │  │
   │  ▼  │
   └───>[End]
```

## AD-02: Cancel Appointment Process

```
[Start]
   │
   ▼
[User Selects Appointment to Cancel]
   │
   ▼
[System Validates Cancellation Permission]
   │
   ├─[Authorized?]──No──>[Display Error]
   │  │                      │
   │  Yes                    │
   │  │                      │
   │  ▼                      │
   │[Display Confirmation Dialog]
   │  │                      │
   │  ├─[User Confirms?]──No─┘
   │  │  │
   │  Yes│
   │  │  │
   │  ▼  │
   │[Update Appointment Status to CANCELLED]
   │  │  │
   │  ▼  │
   │[Release Allocated Resources]
   │  │  │
   │  ▼  │
   │[Update Availability Calendar]
   │  │  │
   │  ▼  │
   │[Send Cancellation Notification]
   │  │  │
   │  ▼  │
   │[Check Waitlist for This Time Slot]
   │  │  │
   │  ├─[Waitlist Exists?]──No──>[End]
   │  │  │
   │  Yes│
   │  │  │
   │  ▼  │
   │[Get First Client from Waitlist]
   │  │  │
   │  ▼  │
   │[Create Appointment for Waitlist Client]
   │  │  │
   │  ▼  │
   │[Remove Client from Waitlist]
   │  │  │
   │  ▼  │
   │[Send Availability Notification]
   │  │  │
   │  ▼  │
   └───>[End]
```

## AD-03: Resource Availability Check Process

```
[Start]
   │
   ▼
[Receive Availability Request]
   │
   │  Parameters: Service, Date, Time, Duration
   │
   ▼
[Get Service Resource Requirements]
   │
   ▼
[For Each Required Resource]
   │
   ├─[Get Resource Schedule]
   │  │
   │  ▼
   │[Check for Overlapping Schedules]
   │  │
   │  ├─[Overlap Found?]──Yes──>[Mark Resource Unavailable]
   │  │  │                          │
   │  No│                          │
   │  │  │                          │
   │  ▼  │                          │
   │[Check Resource Status]        │
   │  │  │                          │
   │  ├─[Status = AVAILABLE?]──No──┘
   │  │  │
   │  Yes│
   │  │  │
   │  ▼  │
   │[Check Capacity Constraints]
   │  │  │
   │  ├─[Within Capacity?]──No──>[Mark Resource Unavailable]
   │  │  │                          │
   │  Yes│                          │
   │  │  │                          │
   │  ▼  │                          │
   │[Mark Resource Available]      │
   │  │  │                          │
   │  ▼  │                          │
   └───>[Next Resource]              │
        │                          │
        ├─[More Resources?]──Yes───┘
        │  │
        No│
        │ │
        ▼ │
   [All Resources Available?]
        │
        ├─[Yes]──>[Return Available = True]
        │
        └─[No]───>[Return Available = False]
                  │
                  ▼
              [End]
```

## AD-04: Personnel Schedule Management Process

```
[Start]
   │
   ▼
[Manager Selects Personnel]
   │
   ▼
[Display Current Schedule]
   │
   ▼
[Manager Selects Action]
   │
   ├─[Add Shift]──────────────┐
   │                          │
   ├─[Modify Shift]───────────┤
   │                          │
   ├─[Add Break]──────────────┤
   │                          │
   ├─[Add Time-Off]───────────┤
   │                          │
   └─[Delete Schedule]─────────┤
                              │
                              ▼
                    [Enter Schedule Details]
                              │
                              ▼
                    [System Validates Schedule]
                              │
                              ├─[Valid?]──No──>[Display Error]
                              │  │                │
                              Yes│                │
                              │  │                │
                              ▼  │                │
                    [Check for Conflicts]        │
                              │  │                │
                              ├─[Conflict?]──Yes─┤
                              │  │                │
                              No│                │
                              │  │                │
                              ▼  │                │
                    [Save Schedule]              │
                              │  │                │
                              ▼  │                │
                    [Update Availability Calendar]│
                              │  │                │
                              ▼  │                │
                    [Notify Personnel]           │
                              │  │                │
                              ▼  │                │
                              └───>[End]
```

## AD-05: Notification Sending Process

```
[Start]
   │
   ▼
[Event Triggered]
   │
   │  Types: Booking, Cancellation, Reminder, Reschedule
   │
   ▼
[Identify Notification Type]
   │
   ▼
[Get Recipient Information]
   │
   ▼
[Select Notification Template]
   │
   ├─[Template Found?]──No──>[Use Default Template]
   │  │                          │
   Yes│                          │
   │  │                          │
   ▼  │                          │
[Personalize Message]           │
   │  │                          │
   │  │                          │
   ▼  │                          │
[Determine Notification Channels]
   │  │                          │
   │  │  Based on: User preferences, Notification type
   │  │
   ▼  │                          │
[For Each Channel]               │
   │  │                          │
   ├─[Email]──>[Send Email]      │
   │  │                          │
   ├─[SMS]───>[Send SMS]          │
   │  │                          │
   └─[Push]──>[Send Push Notification]
      │                          │
      ▼                          │
[Log Notification]              │
   │  │                          │
   ├─[Delivery Success?]──No───>[Retry Mechanism]
   │  │                          │
   Yes│                          │
   │  │                          │
   ▼  │                          │
[Update Notification Status]     │
   │  │                          │
   ▼  │                          │
   └───>[End]
```

## AD-06: Daily Reminder Process

```
[Start]
   │
   ▼
[System Scheduled Task (Daily at 6 AM)]
   │
   ▼
[Get All Appointments for Tomorrow]
   │
   ▼
[For Each Appointment]
   │
   ├─[Appointment Status = CONFIRMED?]──No──>[Skip]
   │  │                                        │
   Yes│                                        │
   │  │                                        │
   ▼  │                                        │
[Get Client Contact Information]
   │  │                                        │
   ▼  │                                        │
[Get Appointment Details]
   │  │                                        │
   │  Service, Time, Personnel, Location
   │  │
   ▼  │                                        │
[Prepare Reminder Message]
   │  │                                        │
   ▼  │                                        │
[Send Reminder via Preferred Channel]
   │  │                                        │
   │  Email, SMS, or Push
   │  │
   ▼  │                                        │
[Log Notification]
   │  │                                        │
   ▼  │                                        │
   └───>[Next Appointment]                     │
        │                                      │
        ├─[More Appointments?]──Yes────────────┘
        │  │
        No│
        │ │
        ▼ │
   [End]
```

## AD-07: Waitlist Management Process

```
[Start]
   │
   ▼
[Slot Becomes Available]
   │
   │  Due to: Cancellation, Resource freed, Time extended
   │
   ▼
[Get Waitlist for Service & Time Slot]
   │
   ├─[Waitlist Empty?]──Yes──>[End]
   │  │
   No│
   │ │
   ▼ │
[Sort Waitlist by Priority]
   │
   │  Factors: Creation time, Client loyalty, Service preference
   │
   ▼
[Get First Client from Waitlist]
   │
   ▼
[Check Client Contact Information]
   │
   ├─[Contact Info Valid?]──No──>[Skip to Next Client]
   │  │                          │
   Yes│                          │
   │  │                          │
   ▼  │                          │
[Send Availability Notification]
   │  │                          │
   │  "A slot has become available..."
   │  │
   ▼  │                          │
[Wait for Client Response]
   │  │                          │
   │  Timeout: 2 hours
   │  │
   ├─[Client Books?]──Yes──>[Create Appointment]
   │  │                      │
   │  │                      ▼
   │  │              [Remove from Waitlist]
   │  │                      │
   │  │                      ▼
   │  │              [End]
   │  │
   ├─[Client Declines?]──Yes──>[Remove from Waitlist]
   │  │                        │
   │  │                        ▼
   │  │                [Get Next Client]
   │  │                        │
   │  │                        │
   └─[Timeout]──>[Remove from Waitlist]
        │                        │
        │                        │
        ▼                        │
   [Get Next Client]             │
        │                        │
        ├─[More Clients?]──Yes──┘
        │  │
        No│
        │ │
        ▼ │
   [End]
```

