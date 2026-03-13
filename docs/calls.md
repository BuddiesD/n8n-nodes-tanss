# Calls Operations

## Create / Import Call

**API Endpoint:** POST /api/v1/calls

Creates or imports a phone call into the database.

**Parameters:**

- **API Token** (required)
- **Use Raw Call JSON (Optional)**
- **Date (Timestamp)**
- **From Phone Number**
- **To Phone Number**
- **Direction**
- **Call ID**
- **Telephone System ID**
- **From Company ID**
- **From Company Percent**
- **From Employee ID**
- **To Company ID**
- **To Company Percent**
- **To Employee ID**
- **Connection Established**
- **Duration Total (Seconds)**
- **Duration Call (Seconds)**
- **Group**
- **Number Identify State**
- **Phone Participants JSON**
- **Participant**
- **Participant idString**
- **Participant Employee ID**

## Get Phone Calls

**API Endpoint:** PUT /api/v1/calls

Retrieve a list of phone calls using filter settings.

**Parameters:**

- **API Token** (required)
- **Use Raw Filter JSON (Optional)**
- **Timeframe From (Timestamp)**
- **Timeframe To (Timestamp)**
- **Show Tries As Well**
- **Number Filters (Comma Separated)**
- **Employee ID**
- **Company ID**
- **Number Infos**
- **Directions**

## Get Phone Call by ID

**API Endpoint:** GET /api/v1/calls/{id}

Retrieve a specific phone call by its ID.

**Parameters:**

- **API Token** (required)
- **Phone Call ID**

## Update Phone Call

**API Endpoint:** PUT /api/v1/calls/{id}

Update an existing phone call.

**Parameters:**

- **API Token** (required)
- **Phone Call ID**
- **Use Raw Call JSON (Optional)**
- **Date (Timestamp)**
- **From Phone Number**
- **To Phone Number**
- **Direction**
- **Call ID**
- **Telephone System ID**
- **From Company ID**
- **From Company Percent**
- **From Employee ID**
- **To Company ID**
- **To Company Percent**
- **To Employee ID**
- **Connection Established**
- **Duration Total (Seconds)**
- **Duration Call (Seconds)**
- **Group**
- **Number Identify State**
- **Phone Participants JSON**
- **Participant**
- **Participant idString**
- **Participant Employee ID**

## Identify Phone Call

**API Endpoint:** POST /api/v1/calls/identify

Identify a phone call and resolve company or employee IDs.

**Parameters:**

- **API Token** (required)
- **Use Raw Identify JSON (Optional)**
- **From Phone Number**
- **To Phone Number**

## Get Employee Assignments

**API Endpoint:** GET /api/v1/calls/employee-assignments

Retrieve all assignments between `idString` values and employees.

**Parameters:**

- **API Token** (required)

## Create Employee Assignment

**API Endpoint:** POST /api/v1/calls/employee-assignments

Create a new assignment between an `idString` and an employee.

**Parameters:**

- **API Token** (required)
- **Use Raw Employee Assignment JSON (Optional)**
- **Employee ID**
- **Username / idString**

## Delete Employee Assignment

**API Endpoint:** DELETE /api/v1/calls/employee-assignments

Delete an assignment between an `idString` and an employee.

**Parameters:**

- **API Token** (required)
- **Use Raw Employee Assignment JSON (Optional)**
- **Employee ID**
- **Username / idString**

## Create Call Notification

**API Endpoint:** POST /api/v1/calls/notifications

Generate a notification (popup) for an incoming or outgoing call.

**Parameters:**

- **API Token** (required)
- **Use Raw Notification JSON (Optional)**
- **ID**
- **Call ID**
- **Telephone System ID**
- **Date (Timestamp)**
- **From Phone Number**
- **From Phone Number Infos (JSON)**
- **To Phone Number**
- **To Phone Number Infos (JSON)**
- **Direction**
- **Connection Established**
- **Duration Total (Seconds)**
- **Duration Call (Seconds)**
- **Group**
- **Phone Participants JSON**
- **Participant**
- **Phone Call ID**
- **Participant idString**
- **Participant Employee ID**
