# Checklists Operations

## Assign Checklist

**API Endpoint:** POST /api/v1/checklists/assignment/{linkTypeId}/{linkId}/{checklistId}

Assign a checklist to a ticket.

**Parameters:**

- **Link Type ID** (required)
- **Link ID** (required)
- **Checklist ID** (required)

## Check Item

**API Endpoint:** PUT /api/v1/checklists/check

Mark or update the value of a checklist item.

**Parameters:**

- **Link Type ID** (required)
- **Link ID** (required)
- **Item ID**
- **Checklist ID**
- **Main Checklist ID**
- **Value**
- **Multi Select ID**
- **Vars**

## Copy Checklist

**API Endpoint:** POST /api/v1/checklists/copy/{checklistId}

Duplicates an existing checklist template — items, multi-select options, events and actions are all cloned into a brand-new checklist independent of the source.

**Parameters:**

- **Checklist ID** (required)

## Create New Version

**API Endpoint:** POST /api/v1/checklists/createNewVersion/{checklistId}

Creates a successor version of an existing checklist. The new checklist is linked to the source via predecessor/successor ids; the source is deactivated so that future ticket assignments pick up the latest version while in-flight processed instances keep referring to the old version.

**Parameters:**

- **Checklist ID** (required)
- **Update Included In Checklists** (optional) — If true, rewire parent checklists embedding the source to the new version

## Delete Checklist

**API Endpoint:** DELETE /api/v1/checklists/{id}

Deletes a checklist template along with its items, multi-select options, events and actions. Requires the DELETE_PROCESSES permission; a checklist that has a successor (i.e. a newer version) cannot be deleted.

**Parameters:**

- **Checklist ID** (required)

## Get Assigned Checklists

**API Endpoint:** GET /api/v1/checklists/assignment/{linkTypeId}/{linkId}

Retrieve all checklists assigned to a specific ticket.

**Parameters:**

- **Link Type ID** (required)
- **Link ID** (required)

## Get Checklist

**API Endpoint:** GET /api/v1/checklists/{id}

Loads a checklist in edit-mode — all fields (including hidden/disabled ones) are returned so that an administrator can modify the template. For the read-only processing view used inside a ticket, use the Get Checklist Process endpoint instead.

**Parameters:**

- **Checklist ID** (required)

## Get Checklist Process

**API Endpoint:** GET /api/v1/checklists/{checklistId}/process

Retrieve the process or progress information for a checklist linked to a ticket.

**Parameters:**

- **Link Type ID** (required)
- **Link ID** (required)
- **Checklist ID** (required)

## Get Checklists

**API Endpoint:** GET /api/v1/checklists

Gets a list of selectable checklists that can be assigned to a ticket.

**Parameters:**

- **Company ID** (optional)
- **Department ID** (optional)

## Remove Checklist

**API Endpoint:** DELETE /api/v1/checklists/assignment/{linkTypeId}/{linkId}/{checklistId}

Remove a checklist from a ticket.

**Parameters:**

- **Link Type ID** (required)
- **Link ID** (required)
- **Checklist ID** (required)

## Update Checklist

**API Endpoint:** PUT /api/v1/checklists/{id}

Updates an existing checklist template. The JSON body is merged using the "checked rights" mechanism — only fields the caller is allowed to change will be applied, anything else is silently ignored.

**Parameters:**

- **Checklist ID** (required)
- **ID**
- **Name**
- **Description**
- **Type** (CHECKLIST, TEMPLATE, ADHOC)
- **Creator ID**
- **Active**
- **Position** (DEFAULT, TOP)
- **Completed**

## Update Checklist Action

**API Endpoint:** PUT /api/v1/checklists/action

Updates the persisted state of a single checklist action (e.g. a button/event hook attached to a checklist item) for the given assignment. Restricted to technicians and freelancers, who must additionally have access both to the checklist assignment and to the action itself.

**Parameters:**

- **Link Type ID** (required)
- **Link ID** (required)
- **Checklist ID**
- **Checklist Main ID**
- **Checklist Item ID**
- **Value**
- **Date**
- **User ID**
- **Support ID**
- **Hidden**
