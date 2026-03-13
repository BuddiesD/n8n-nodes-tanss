# Remote Supports Operations

## Create / Import Remote Support

**API Endpoint:** POST /api/remoteSupports/v1

Create or import a remote support entry into the database.

**Parameters:**

- **API Token** (required)
- **Remote Maintenance ID**
- **User ID**
- **User Name**
- **Employee ID**
- **Device ID**
- **Device Name**
- **Company ID**
- **Link Type ID**
- **Link ID**
- **Start Time (Timestamp)**
- **End Time (Timestamp)**
- **Comment**

## Get Remote Supports

**API Endpoint:** PUT /api/remoteSupports/v1

Retrieve a list of remote supports using filter settings.

**Parameters:**

- **API Token** (required)
- **Timeframe From (Timestamp)**
- **Timeframe To (Timestamp)**
- **Employee ID**
- **Company ID**
- **Type ID**
- **Text**

## Get Remote Support by ID

**API Endpoint:** GET /api/remoteSupports/v1/{id}

Retrieve a specific remote support by its ID.

**Parameters:**

- **API Token** (required)
- **Remote Support ID**

## Update Remote Support

**API Endpoint:** PUT /api/remoteSupports/v1/{id}

Update an existing remote support by its ID.

**Parameters:**

- **API Token** (required)
- **Remote Support ID**
- **Remote Maintenance ID**
- **User ID**
- **User Name**
- **Employee ID**
- **Device ID**
- **Device Name**
- **Company ID**
- **Link Type ID**
- **Link ID**
- **Start Time (Timestamp)**
- **End Time (Timestamp)**
- **Comment**

## Delete Remote Support

**API Endpoint:** DELETE /api/remoteSupports/v1/{id}

Delete a remote support by its ID.

**Parameters:**

- **API Token** (required)
- **Remote Support ID**

## Get Device Assignments

**API Endpoint:** GET /api/remoteSupports/v1/assignDevice

Retrieve all device assignments for remote supports.

**Parameters:**

- **API Token** (required)

## Create Device Assignment

**API Endpoint:** POST /api/remoteSupports/v1/assignDevice

Create a new device assignment.

**Parameters:**

- **API Token** (required)
- **Device ID**
- **Company ID**
- **Link Type ID**
- **Link ID**

## Delete Device Assignment

**API Endpoint:** DELETE /api/remoteSupports/v1/assignDevice

Delete an existing device assignment.

**Parameters:**

- **API Token** (required)
- **Device ID**
- **Company ID**
- **Link Type ID**
- **Link ID**

## Get Technician Assignments

Retrieve all technician assignments for the remote support type.

**Parameters:**

- **API Token** (required)

## Create Technician Assignment

Create an assignment mapping a `userId` to an `employeeId`.

**Parameters:**

- **API Token** (required)
- **User ID**
- **Employee ID**

## Delete Technician Assignment

Delete a technician assignment by `userId`.

**Parameters:**

- **API Token** (required)
- **User ID**
- **Employee ID**
