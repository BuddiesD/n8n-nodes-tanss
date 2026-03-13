# Callback Operations

## Create Callback

**API Endpoint:** POST /api/v1/callbacks

Creates a new callback entry.

**Parameters:**

- **API Token** (required)
- **From Employee ID**
- **To Employee ID**
- **To Department ID**
- **Date (Timestamp)**
- **Company ID**
- **Company Name**
- **Employee ID**
- **Employee Name**
- **Phone Number**
- **Info**
- **State**
- **Priority**
- **Callback After Time (Timestamp)**
- **Callback Until Time (Timestamp)**
- **Link Type ID**
- **Link ID**

## Get Callbacks

**API Endpoint:** PUT /api/v1/callbacks

Retrieve a list of callbacks with optional filtering.

**Parameters:**

- **API Token** (required)
- **Use Raw Filter JSON (Optional)**
- **Timeframe From (Timestamp)**
- **Timeframe To (Timestamp)**
- **State**
- **States (Comma Separated)**
- **From Employee ID**
- **To Employee ID**
- **To All Employees With Access To**
- **To Department IDs (Comma Separated)**
- **Company IDs (Comma Separated)**
- **Employee IDs (Comma Separated)**
- **Load Linked Entities**
- **With Log**
- **Items Per Page**
- **Page**

## Get Callback by ID

**API Endpoint:** GET /api/v1/callbacks/{id}

Retrieve a specific callback by its ID.

**Parameters:**

- **API Token** (required)
- **Callback ID** (required)

## Update Callback

**API Endpoint:** PUT /api/v1/callbacks/{id}

Update an existing callback.

**Parameters:**

- **API Token** (required)
- **Callback ID** (required)
- **From Employee ID**
- **To Employee ID**
- **To Department ID**
- **Date (Timestamp)**
- **Company ID**
- **Company Name**
- **Employee ID**
- **Employee Name**
- **Phone Number**
- **Info**
- **State**
- **Priority**
- **Callback After Time (Timestamp)**
- **Callback Until Time (Timestamp)**
- **Link Type ID**
- **Link ID**
