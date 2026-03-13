# Operating Systems Operations

## Create OS

**API Endpoint:** POST /api/v1/os

Create a new operating system entry.

**Parameters:**

- **API Token** (required)
- **ID**
- **Name**
- **Server Operating System**
- **Active**
- **Article Number**

## Delete OS

**API Endpoint:** DELETE /api/v1/os/{id}

Delete a specific operating system.

**Parameters:**

- **API Token** (required)
- **OS ID** (required)

## Get Operating Systems

**API Endpoint:** GET /api/v1/os

Retrieve a list of all operating systems.

**Parameters:**

- **API Token** (required)

## Get OS

**API Endpoint:** GET /api/v1/os/{id}

Retrieve a specific operating system by its ID.

**Parameters:**

- **API Token** (required)
- **OS ID** (required)

## Update OS

**API Endpoint:** PUT /api/v1/os/{id}

Update an existing operating system.

**Parameters:**

- **API Token** (required)
- **OS ID** (required)
- **ID**
- **Name**
- **Server Operating System**
- **Active**
- **Article Number**
