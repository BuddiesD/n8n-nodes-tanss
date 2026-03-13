# Callsuser Operations

## Get Phone Calls

**API Endpoint:** PUT /api/v1/phoneCalls

Retrieve a list of phone calls using filter settings.

**Parameters:**
- **API Token** (required)
- **Use Raw Filter JSON (Optional)**
- **Timeframe From (Timestamp)**
- **Timeframe To (Timestamp)**
- **Show Tries As Well**
- **Number Filters (Comma Separated)**
- **Employee ID**
- **Company ID**
- **Number Infos**
- **Directions**

## Get Phone Call by ID

**API Endpoint:** GET /api/v1/phoneCalls/{id}

Retrieve a specific phone call from the database by its ID.

**Parameters:**
- **API Token** (required)
- **Phone Call ID**

## Identify Phone Call

**API Endpoint:** POST /api/v1/phoneCalls/identify

Identify a phone call and attempt to resolve the related company and employee IDs.

**Parameters:**
- **API Token** (required)
- **From Phone Number** (required)
- **To Phone Number** (required)