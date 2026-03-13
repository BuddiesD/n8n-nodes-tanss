# IPs Operations

## Get IPs

**API Endpoint:** GET /api/v1/ips/{assignmentType}/{assignmentId}

Retrieve all IP addresses assigned to a device.

**Parameters:**

- **API Token** (required)
- **Assignment Type** (required)
- **Assignment ID** (required)

## Create IP

**API Endpoint:** POST /api/v1/ips/{assignmentType}/{assignmentId}

Create a new IP address assignment.

**Parameters:**

- **API Token** (required)
- **Assignment Type** (required)
- **Assignment ID** (required)
- **IP**
- **MAC**
- **Remark**
- **DHCP**

## Update IP

**API Endpoint:** PUT /api/v1/ips/{id}

Update an existing IP address.

**Parameters:**

- **API Token** (required)
- **IP ID** (required)
- **IP**
- **MAC**
- **Remark**
- **DHCP**

## Delete IP

**API Endpoint:** DELETE /api/v1/ips/{id}

Delete an IP address.

**Parameters:**

- **API Token** (required)
- **IP ID** (required)
