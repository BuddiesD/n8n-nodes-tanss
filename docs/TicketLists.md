# Ticket Lists Operations

## Get All Project Tickets

Retrieve a list of all project tickets.

**Parameters:**

- **API Token** (required)

## Get Company Tickets

Retrieve tickets for a specific company.

**Parameters:**

- **API Token** (required)
- **Company ID** (required)

## Get Custom Ticket List

**API Endpoint:** PUT /api/v1/tickets

Retrieve a custom ticket list using filter settings.

**Parameters:**

- **API Token** (required)
- **Companies**
- **Departments**
- **IDs**
- **Include Done Tickets**
- **Is Repair**
- **Items Per Page**
- **Modified Within Timeframe**
- **Timeframe**
- **From**
- **To**
- **Not Assigned To Employees**
- **Page**
- **Phase ID**
- **Project ID**
- **Remitter ID**
- **Staff**
- **States**
- **Types**

## Get General Tickets

Retrieve tickets that are not assigned to any employee.

**Parameters:**

- **API Token** (required)

## Get Local Admin Tickets

Retrieve tickets assigned to local ticket administrators.

**Parameters:**

- **API Token** (required)

## Get Not Identified Tickets

Retrieve tickets that are not assigned to any company.

**Parameters:**

- **API Token** (required)

## Get Own Tickets

Retrieve tickets assigned to the current employee.

**Parameters:**

- **API Token** (required)

## Get Repair Tickets

Retrieve a list of repair tickets.

**Parameters:**

- **API Token** (required)

## Get Technician Tickets

Retrieve tickets assigned to other technicians.

**Parameters:**

- **API Token** (required)

## Get Tickets With Role

Retrieve tickets where the technician has a role assigned.

**Parameters:**

- **API Token** (required)
