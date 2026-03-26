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
