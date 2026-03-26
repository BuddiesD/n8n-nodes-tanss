# Callsuser Operations

Routes that are used to get phone calls (usable in the user "default" context).

## Get Phone Calls

**API Endpoint:** PUT /api/v1/phoneCalls

Retrieve a list of phone calls using filter settings.

**Parameters:**

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

- **Phone Call ID** (required)

## Identify Phone Call

**API Endpoint:** POST /api/v1/phoneCalls/identify

Identify a phone call and attempt to resolve the related company and employee IDs.

**Parameters:**

- **From Phone Number** (required)
- **To Phone Number** (required)
