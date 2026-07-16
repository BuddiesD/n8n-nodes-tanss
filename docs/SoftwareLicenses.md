# Software Licenses Operations

## Get Software Licenses

**API Endpoint:** PUT /api/v1/softwarelicenses

Retrieve a list of software licenses based on filter settings.

**Parameters:**

- **Company ID**
- **Branches**
- **Active**
- **Software License Type ID**
- **Link Type ID**
- **Link ID**
- **Include Sub Types**
- **Expiry Filter**
- **Only Overlicenced**

## Create Software License

**API Endpoint:** POST /api/v1/softwarelicenses

Create a new software license.

**Parameters:**

- **ID**
- **Company ID**
- **Remark**
- **Internal Remark**
- **Serial Number**
- **Inventory Number**
- **Software License Type ID**
- **Expiration Date (Timestamp)**
- **Renew**
- **Date (Timestamp)**
- **Max Number Of Install**
- **Number Of Volumes**
- **Active**
- **Employee ID**
- **Article Number**
- **Contract Price**
- **Assignments**

## Get Software License by ID

**API Endpoint:** GET /api/v1/softwarelicenses/{id}

Retrieve a single software license by its ID.

**Parameters:**

- **Software License ID** (required)

## Update Software License

**API Endpoint:** PUT /api/v1/softwarelicenses/{id}

Update an existing software license.

**Parameters:**

- **Software License ID** (required)
- **ID**
- **Company ID**
- **Remark**
- **Internal Remark**
- **Serial Number**
- **Inventory Number**
- **Software License Type ID**
- **Expiration Date (Timestamp)**
- **Renew**
- **Date (Timestamp)**
- **Max Number Of Install**
- **Number Of Volumes**
- **Active**
- **Employee ID**
- **Article Number**
- **Contract Price**
- **Assignments**

## Delete Software License

**API Endpoint:** DELETE /api/v1/softwarelicenses/{id}

Delete a software license.

**Parameters:**

- **Software License ID** (required)

## Get Software License Types

**API Endpoint:** GET /api/v1/softwarelicenses/types

Retrieve all software license types.

**Parameters:**

## Create Software License Type

**API Endpoint:** POST /api/v1/softwarelicenses/types

Create a new software license type.

**Parameters:**

- **ID**
- **Manufacturer Number**
- **Name**
- **Comment**
- **Previous ID**
- **Active**
- **Standard Running Time**
- **Standard Renew**
- **Standard Max Number Of Installations**
- **Article Number**
- **Path (JSON Array)**

## Get Software License Type

**API Endpoint:** GET /api/v1/softwarelicenses/types/{id}

Retrieve a single software license type by ID.

**Parameters:**

- **Software License Type ID** (required)

## Update Software License Type

**API Endpoint:** PUT /api/v1/softwarelicenses/types/{id}

Update an existing software license type.

**Parameters:**

- **Software License Type ID** (required)
- **ID**
- **Manufacturer Number**
- **Name**
- **Comment**
- **Previous ID**
- **Active**
- **Standard Running Time**
- **Standard Renew**
- **Standard Max Number Of Installations**
- **Article Number**
- **Path (JSON Array)**

## Delete Software License Type

**API Endpoint:** DELETE /api/v1/softwarelicenses/types/{id}

Delete a software license type.

**Parameters:**

- **Software License Type ID** (required)

## Get Expiring Licenses

**API Endpoint:** GET /api/v1/softwarelicenses/expire

Lists licenses whose expirationDate falls inside the upcoming reminder window.

**Parameters:**

- **Company ID** — Restrict to a single company; omit to span all accessible companies

## Get Software License Assignments

**API Endpoint:** GET /api/v1/softwarelicenses/{id}/assignments

Returns every device/employee/installation that consumes a seat of this license.

**Parameters:**

- **Software License ID** (required)

## Get Software License Contracts

**API Endpoint:** GET /api/v1/softwarelicenses/{id}/contracts

Returns the customer contracts this software license is referenced from.

**Parameters:**

- **Software License ID** (required)

## Copy Software License

**API Endpoint:** POST /api/v1/softwarelicenses/{id}/copy

Duplicates an existing software license.

**Parameters:**

- **Software License ID** (required)
- **Count** — Number of copies to create
- **Serial Numbers (JSON Array)** — List of serial numbers

## Get Software License Properties

**API Endpoint:** GET /api/v1/softwarelicenses/{id}/properties

Returns the customer-defined extra fields for this license.

**Parameters:**

- **Software License ID** (required)

## Get Software License Types Treeview

**API Endpoint:** GET /api/v1/softwarelicenses/types/treeview

Returns software-license types nested as a parent/child tree.

**Parameters:**

- **Tree View** — Return nested tree (true) or flat list (false)

---

## Not Implemented (UI-only / Binary endpoints)

- **Get Software License PDF** — GET `/api/v1/softwarelicenses/{id}/pdf` — Returns binary PDF, not usable in n8n workflow
- **Get Software Licenses List PDF** — PUT `/api/v1/softwarelicenses/pdf` — Returns binary PDF, not usable in n8n workflow
