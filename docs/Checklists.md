# Checklists Operations

## Assign Checklist

**API Endpoint:** POST /api/v1/checklists/assignment/{linkTypeId}/{linkId}/{checklistId}

Assign a checklist to a ticket.

**Parameters:**

- **API Token** (required)
- **Link Type ID** (required)
- **Link ID** (required)
- **Checklist ID** (required)

## Remove Checklist

**API Endpoint:** DELETE /api/v1/checklists/assignment/{linkTypeId}/{linkId}/{checklistId}

Remove a checklist from a ticket.

**Parameters:**

- **API Token** (required)
- **Link Type ID** (required)
- **Link ID** (required)
- **Checklist ID** (required)

## Get Assigned Checklists

**API Endpoint:** GET /api/v1/checklists/assignment/{linkTypeId}/{linkId}

Retrieve all checklists assigned to a specific ticket.

**Parameters:**

- **API Token** (required)
- **Link Type ID** (required)
- **Link ID** (required)

## Get Checklist Process

**API Endpoint:** GET /api/v1/checklists/{checklistId}/process

Retrieve the process or progress information for a checklist linked to a ticket.

**Parameters:**

- **API Token** (required)
- **Link Type ID** (required)
- **Link ID** (required)
- **Checklist ID** (required)

## Check Item

**API Endpoint:** PUT /api/v1/checklists/check

Mark or update the value of a checklist item.

**Parameters:**

- **API Token** (required)
- **Item ID**
- **Checklist ID**
- **Main Checklist ID**
- **Link Type ID**
- **Link ID**
- **Value**
- **Multi Select ID**
- **Vars**
