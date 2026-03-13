# Manufacturers Operations

## Create Manufacturer

**API Endpoint:** POST /api/v1/manufacturers

Create a new manufacturer.

**Parameters:**

- **API Token** (required)
- **ID**
- **Name**

## Delete Manufacturer

**API Endpoint:** DELETE /api/v1/manufacturers/{id}

Delete a manufacturer.

**Parameters:**

- **API Token** (required)
- **Manufacturer ID**

## Get Manufacturers

**API Endpoint:** GET /api/v1/manufacturers

Retrieve a list of all manufacturers.

**Parameters:**

- **API Token** (required)

## Get Manufacturer

**API Endpoint:** GET /api/v1/manufacturers/{id}

Retrieve a specific manufacturer by its ID.

**Parameters:**

- **API Token** (required)
- **Manufacturer ID**

## Update Manufacturer

**API Endpoint:** PUT /api/v1/manufacturers/{id}

Update an existing manufacturer.

**Parameters:**

- **API Token** (required)
- **Manufacturer ID**
- **ID**
- **Name**
