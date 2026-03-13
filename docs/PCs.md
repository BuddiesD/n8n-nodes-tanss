# PCs Operations

## Create PC

**API Endpoint:** POST /api/v1/pcs

Create a new PC.

**Parameters:**

- **API Token** (required)
- **Company ID** (required)
- **Model** (required)
- **Active**
- **AnyDesk ID**
- **AnyDesk Password**
- **Article Number**
- **Billing Number**
- **BIOS**
- **BIOS Release**
- **CPU Frequency**
- **CPU Manufacturer ID**
- **CPU Number**
- **CPU Type ID**
- **Date**
- **Description**
- **Employee ID**
- **Host ID**
- **Internal Remark**
- **Inventory Number**
- **Keyboard Serial Number**
- **Location**
- **Mainboard Manufacturer ID**
- **Mainboard Manufacturer Revision**
- **Mainboard Serial Number**
- **Manufacturer ID**
- **Manufacturer Number**
- **Mouse Serial Number**
- **Name**
- **OS ID**
- **Ownage Type**
- **Purchase Price**
- **Remark**
- **Reserved CPU**
- **Reserved Hard Disk**
- **Reserved RAM**
- **Selling Price**
- **Serial Number**
- **Server**
- **Service Technician ID**
- **Show Remark**
- **Software**
- **Storage ID**
- **TeamViewer ID**
- **TeamViewer Password**

## Delete PC

**API Endpoint:** DELETE /api/v1/pcs/{id}

Delete a PC.

**Parameters:**

- **API Token** (required)
- **PC ID** (required)

## Get PC by ID

**API Endpoint:** GET /api/v1/pcs/{id}

Retrieve a PC or server by its ID.

**Parameters:**

- **API Token** (required)
- **PC ID** (required)

## List PCs

**API Endpoint:** PUT /api/v1/pcs

Retrieve a list of PCs.

**Parameters:**

- **API Token** (required)
- **Active**
- **Branches**
- **Company ID**
- **OS IDs**
- **Type**

## Update PC

**API Endpoint:** PUT /api/v1/pcs/{id}

Update an existing PC.

**Parameters:**

- **API Token** (required)
- **PC ID** (required)
- **Company ID**
- **Model**
- **Active**
- **AnyDesk ID**
- **AnyDesk Password**
- **Article Number**
- **Billing Number**
- **BIOS**
- **BIOS Release**
- **CPU Frequency**
- **CPU Manufacturer ID**
- **CPU Number**
- **CPU Type ID**
- **Date**
- **Description**
- **Employee ID**
- **Host ID**
- **Internal Remark**
- **Inventory Number**
- **Keyboard Serial Number**
- **Location**
- **Mainboard Manufacturer ID**
- **Mainboard Manufacturer Revision**
- **Mainboard Serial Number**
- **Manufacturer ID**
- **Manufacturer Number**
- **Mouse Serial Number**
- **Name**
- **OS ID**
- **Ownage Type**
- **Purchase Price**
- **Remark**
- **Reserved CPU**
- **Reserved Hard Disk**
- **Reserved RAM**
- **Selling Price**
- **Serial Number**
- **Server**
- **Service Technician ID**
- **Show Remark**
- **Software**
- **Storage ID**
- **TeamViewer ID**
- **TeamViewer Password**
