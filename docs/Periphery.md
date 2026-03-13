# Periphery Operations

## Get Periphery

**API Endpoint:** GET /api/v1/peripheries/{id}

Retrieve a periphery device by its ID.

**Parameters:**

- **API Token** (required)
- **Periphery ID**

## List Peripheries

**API Endpoint:** PUT /api/v1/peripheries

Retrieve a list of peripheries using filters.

**Parameters:**

- **API Token** (required)
- **Company ID**
- **Branches**
- **Active**
- **Periphery Type ID**

## Get Periphery Types

**API Endpoint:** GET /api/v1/peripheries/types

Retrieve available periphery types.

**Parameters:**

- **API Token** (required)

## Create Periphery Type

**API Endpoint:** POST /api/v1/peripheries/types

Create a new periphery type.

**Parameters:**

- **API Token** (required)
- **ID**
- **Name**
- **Image**

## Update Periphery Type

**API Endpoint:** PUT /api/v1/peripheries/types/{id}

Update an existing periphery type.

**Parameters:**

- **API Token** (required)
- **Periphery Type ID**
- **ID**
- **Name**
- **Image**

## Delete Periphery Type

**API Endpoint:** DELETE /api/v1/peripheries/types/{id}

Delete a periphery type.

**Parameters:**

- **API Token** (required)
- **Periphery Type ID**

## Assign Periphery

**API Endpoint:** POST /api/v1/peripheries/{peripheryId}/buildIn/{linkTypeId}/{linkId}

Assign a periphery to another entity.

**Parameters:**

- **API Token** (required)
- **Periphery ID**
- **Link Type ID**
- **Link ID**

## Delete Periphery Assignment

**API Endpoint:** DELETE /api/v1/peripheries/{peripheryId}/buildIn/{linkTypeId}/{linkId}

Remove a periphery assignment.

**Parameters:**

- **API Token** (required)
- **Periphery ID**
- **Link Type ID**
- **Link ID**

## Update Periphery

**API Endpoint:** PUT /api/v1/peripheries/{id}

Update an existing periphery.

**Parameters:**

- **API Token** (required)
- **Periphery ID**
- **Company ID**
- **Date (Timestamp)**
- **Periphery Type ID**
- **Manufacturer ID**
- **Type**
- **Location**
- **Remark**
- **Internal Remark**
- **Serial Number**
- **Inventory Number**
- **Version**
- **Active**
- **Employee ID**
- **PC ID**
- **Billing Number**
- **Article Number**
- **Storage ID**
- **Purchase Price**
- **Selling Price**
- **Ownage Type**
- **Name**
- **Description**
- **Manufacturer Number**
- **Additional Field ID**
- **Title**
- **Value**
- **IP Assignment ID**
- **IP Assignment Type**
- **DHCP**
- **IP**
- **MAC**
- **Service ID**
- **Guarantee**
- **Link Type ID**
- **Link ID**
- **Purchase Date (Timestamp)**
- **Guarantee Month**
- **Guarantee Expire**
- **Warranty Month**
- **Warranty Expire**

## Create Periphery

**API Endpoint:** POST /api/v1/peripheries

Create a new periphery.

**Parameters:**

- **API Token** (required)
- **ID**
- **Company ID**
- **Date (Timestamp)**
- **Periphery Type ID**
- **Manufacturer ID**
- **Type**
- **Location**
- **Remark**
- **Internal Remark**
- **Serial Number**
- **Inventory Number**
- **Version**
- **Active**
- **Employee ID**
- **PC ID**
- **Billing Number**
- **Article Number**
- **Storage ID**
- **Purchase Price**
- **Selling Price**
- **Ownage Type**
- **Name**
- **Description**
- **Manufacturer Number**
- **Additional Field ID**
- **Title**
- **Value**
- **IP Assignment ID**
- **IP Assignment Type**
- **DHCP**
- **IP**
- **MAC**
- **Service ID**
- **Guarantee**
- **Link Type ID**
- **Link ID**
- **Purchase Date (Timestamp)**
- **Guarantee Month**
- **Guarantee Expire**
- **Warranty Month**
- **Warranty Expire**

## Delete Periphery

**API Endpoint:** DELETE /api/v1/peripheries/{id}

Delete a periphery.

**Parameters:**

- **API Token** (required)
- **Periphery ID**
