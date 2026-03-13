# Tickets Operations

## Create Comment

**API Endpoint:** POST /api/v1/tickets/{ticketId}/comments

Create a comment for a specific ticket.

**Parameters:**
- **API Token** (required)
- **Ticket ID**
- **Comment Title**
- **Comment Content**
- **Internal**

## Create Ticket

**API Endpoint:** POST /api/v1/tickets

Create a new ticket in the database.

**Parameters:**
- **API Token** (required)
- **Assigned to Department ID**
- **Assigned to Employee ID**
- **Attention**
- **Clearance Mode**
- **Company ID**
- **Content**
- **Deadline Date (Timestamp)**
- **Due Date (Timestamp)**
- **Estimated Minutes**
- **External Ticket ID**
- **Installation Fee**
- **Installation Fee Amount**
- **Installation Fee Drive Mode**
- **Link ID**
- **Link Type ID**
- **Local Ticket Admin Employee ID**
- **Local Ticket Admin Flag**
- **Order By ID**
- **Order Number**
- **Phase ID**
- **Project**
- **Project ID**
- **Relationship Link ID**
- **Relationship Link Type ID**
- **Reminder (Timestamp)**
- **Remitter ID**
- **Repair**
- **Resubmission Date (Timestamp)**
- **Resubmission Text**
- **Separate Billing**
- **Service Cap Amount**
- **Status ID**
- **Sub Tickets**
- **Tags**
- **Title**
- **Type ID**

## Delete Ticket

**API Endpoint:** DELETE /api/v1/tickets/{ticketId}

Delete a ticket.

**Parameters:**
- **API Token** (required)
- **Ticket ID**
- **Target Ticket ID**

## Get Ticket by ID

**API Endpoint:** GET /api/v1/tickets/{ticketId}

Retrieve a specific ticket with all details.

**Parameters:**
- **API Token** (required)
- **Ticket ID**

## Get Ticket History

**API Endpoint:** GET /api/v1/tickets/history/{ticketId}

Retrieve the history of a ticket.

**Parameters:**
- **API Token** (required)
- **Ticket ID**

## Merge Tickets

**API Endpoint:** PUT /api/v1/tickets/{ticketId}/merge/{targetTicketId}

Merge one ticket into another.

**Parameters:**
- **API Token** (required)
- **Ticket ID**
- **Target Ticket ID**

## Update Ticket

**API Endpoint:** PUT /api/v1/tickets/{ticketId}

Update an existing ticket.

**Parameters:**
- **API Token** (required)
- **Ticket ID**
- **Assigned to Department ID**
- **Assigned to Employee ID**
- **Attention**
- **Company ID**
- **Content**
- **Deadline Date**
- **Due Date**
- **Estimated Minutes**
- **External Ticket ID**
- **Installation Fee**
- **Order Number**
- **Phase ID**
- **Relationship Link ID**
- **Relationship Link Type ID**
- **Remitter ID**
- **Resubmission Date**
- **Status ID**
- **Title**
- **Type ID**