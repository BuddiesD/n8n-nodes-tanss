# Services Operations

## Create Service

**API Endpoint:** POST /api/v1/services

Creates a service.

**Parameters:**

- **Create Service Fields** supports `id`, `text`, `symbol`, `command`, `active`, and `callType`

## Get All Services

**API Endpoint:** GET /api/v1/services

Gets a list of all defined services.

## Get Service

**API Endpoint:** GET /api/v1/services/{id}

Gets a service by ID.

**Parameters:**

- **Service ID** (required)

## Update Service

**API Endpoint:** PUT /api/v1/services/{id}

Updates a service.

**Parameters:**

- **Service ID** (required)
- **Update Service Fields** supports `id`, `text`, `symbol`, `command`, `active`, and `callType`

## Delete Service

**API Endpoint:** DELETE /api/v1/services/{id}

Deletes a service.

**Parameters:**

- **Service ID** (required)
