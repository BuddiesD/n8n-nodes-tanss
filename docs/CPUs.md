# CPUs Operations

## Create CPU

**API Endpoint:** POST /api/v1/cpus

Create a new CPU entry.

**Parameters:**
- **API Token** (required)
- **ID**
- **Name**

## Delete CPU

**API Endpoint:** DELETE /api/v1/cpus/{id}

Delete a CPU.

**Parameters:**
- **API Token** (required)
- **CPU ID**

## Get CPUs

**API Endpoint:** GET /api/v1/cpus

Retrieve a list of all CPUs.

**Parameters:**
- **API Token** (required)

## Get CPU

**API Endpoint:** GET /api/v1/cpus/{id}

Retrieve a specific CPU by its ID.

**Parameters:**
- **API Token** (required)
- **CPU ID**

## Update CPU

**API Endpoint:** PUT /api/v1/cpus/{id}

Update an existing CPU.

**Parameters:**
- **API Token** (required)
- **CPU ID**
- **ID**
- **Name**