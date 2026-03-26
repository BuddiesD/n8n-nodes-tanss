# Periphery Operations

## Get Periphery

**API Endpoint:** GET /api/v1/peripheries/{id}

Retrieve a periphery device by its ID.

**Parameters:**

- **Periphery ID** (required)

## List Peripheries

**API Endpoint:** PUT /api/v1/peripheries

Retrieve a list of peripheries using filters.

**Parameters:**

- **Company ID**
- **Branches**
- **Active**
- **Periphery Type ID**

## Get Periphery Types

**API Endpoint:** GET /api/v1/peripheries/types

Retrieve available periphery types.

**Parameters:**

## Create Periphery Type

**API Endpoint:** POST /api/v1/peripheries/types

Create a new periphery type.

**Parameters:**

- **ID**
- **Name**
- **Image**

## Update Periphery Type

**API Endpoint:** PUT /api/v1/peripheries/types/{id}

Update an existing periphery type.

**Parameters:**

- **Periphery Type ID** (required)
- **ID**
- **Name**
- **Image**

## Delete Periphery Type

**API Endpoint:** DELETE /api/v1/peripheries/types/{id}

Delete a periphery type.

**Parameters:**

- **Periphery Type ID** (required)

## Assign Periphery

**API Endpoint:** POST /api/v1/peripheries/{peripheryId}/buildIn/{linkTypeId}/{linkId}

Assign a periphery to another entity.

**Parameters:**

- **Periphery ID** (required)
- **Link Type ID** (required)
- **Link ID** (required)

## Delete Periphery Assignment

**API Endpoint:** DELETE /api/v1/peripheries/{peripheryId}/buildIn/{linkTypeId}/{linkId}

Remove a periphery assignment.

**Parameters:**

- **Periphery ID** (required)
- **Link Type ID** (required)
- **Link ID** (required)

## Update Periphery

**API Endpoint:** PUT /api/v1/peripheries/{id}

Update an existing periphery.

**Parameters:**

- **Periphery ID** (required)
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

- **Periphery ID** (required)
