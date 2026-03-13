# Timestamp Operations

## Get Timestamps

Retrieve a list of timestamps within a given time period.

**Parameters:**
- **API Token** (required)
- **From (Timestamp)**
- **Till (Timestamp)**

## Get Timestamp Info

Retrieve timestamp information for a given time period.

**Parameters:**
- **API Token** (required)
- **From (Timestamp)**
- **Till (Timestamp)**

## Get Timestamp Statistics

Retrieve timestamp information with statistical values.

**Parameters:**
- **API Token** (required)
- **From (Timestamp)**
- **Till (Timestamp)**
- **Employee IDs (Comma Separated)**

## Create Timestamp

Create a new timestamp entry.

**Parameters:**
- **API Token** (required)
- **Auto Pause**
- **Employee ID**
- **Date (Timestamp)**
- **State**
- **Type**

## Update Timestamp

Update an existing timestamp.

**Parameters:**
- **API Token** (required)
- **Timestamp ID**
- **Employee ID**
- **Date (Timestamp)**
- **State**
- **Type**

## Save Day Timestamps

Write all timestamps for a full day at once.

**Parameters:**
- **API Token** (required)
- **Employee ID (Day)**
- **Day**
- **Timestamps JSON**

## Create Day Closings

Create one or more day closing entries.

**Parameters:**
- **API Token** (required)
- **Day Closings JSON**

## Delete Day Closings

Delete (undo) one or more day closing entries.

**Parameters:**
- **API Token** (required)
- **Day Closings JSON**

## Get Day Closing Till Date

Retrieve information about the latest day closings for employees.

**Parameters:**
- **API Token** (required)

## Create Day Closings Till Date

Create missing day closings for specific employees until a given date.

**Parameters:**
- **API Token** (required)
- **Till Date**
- **Employee IDs JSON**

## Set Initial Balance

Set the initial time balance for an employee.

**Parameters:**
- **API Token** (required)
- **Employee ID (Initial)**
- **Initial Balance (Minutes)**

## Get Pause Configs

Retrieve all pause configuration rules.

**Parameters:**
- **API Token** (required)

## Create Pause Config

Create a new pause configuration.

**Parameters:**
- **API Token** (required)
- **From Minutes**
- **Minimum Pause (Minutes)**

## Update Pause Config

Update an existing pause configuration.

**Parameters:**
- **API Token** (required)
- **Pause Config ID**
- **From Minutes**
- **Minimum Pause (Minutes)**

## Delete Pause Config

Delete a pause configuration.

**Parameters:**
- **API Token** (required)
- **Pause Config ID**