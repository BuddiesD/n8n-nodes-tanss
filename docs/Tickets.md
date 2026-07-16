# Tickets Operations

## Create Comment

**API Endpoint:** POST /api/v1/tickets/{ticketId}/comments

Create a comment for a specific ticket.

**Parameters:**

- **Ticket ID** (required)
- **Comment Title**
- **Comment Content**
- **Internal**

## Create Ticket

**API Endpoint:** POST /api/v1/tickets

Create a new ticket in the database.

**Parameters:**

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

## Delete Comment

**API Endpoint:** DELETE /api/v1/tickets/{ticketId}/comments/{commentId}

Delete a comment from a specific ticket.

**Parameters:**

- **Ticket ID** (required)
- **Comment ID** (required)

## Delete Ticket

**API Endpoint:** DELETE /api/v1/tickets/{ticketId}

Delete a ticket.

**Parameters:**

- **Ticket ID** (required)
- **Target Ticket ID**

## Get Absent Technician Tickets

**API Endpoint:** GET /api/v1/tickets/absentTechnicians

Get tickets for absent technicians.

## Get Ticket by ID

**API Endpoint:** GET /api/v1/tickets/{ticketId}

Retrieve a specific ticket with all details.

**Parameters:**

- **Ticket ID** (required)

## Get Ticket History

**API Endpoint:** GET /api/v1/tickets/history/{ticketId}

Retrieve the history of a ticket.

**Parameters:**

- **Ticket ID** (required)

## Merge Tickets

**API Endpoint:** PUT /api/v1/tickets/{ticketId}/merge/{targetTicketId}

Merge one ticket into another.

**Parameters:**

- **Ticket ID**
- **Target Ticket ID**

## Update Ticket

**API Endpoint:** PUT /api/v1/tickets/{ticketId}

Update an existing ticket.

**Parameters:**

- **Ticket ID** (required)
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

## Update Comment

**API Endpoint:** PUT /api/v1/tickets/{ticketId}/comments/{commentId}

Update an existing comment on a ticket.

**Parameters:**

- **Ticket ID** (required)
- **Comment ID** (required)
- **Content**
- **Internal**
- **Pinned** (optional, query parameter)

---

## Not Implemented

The following API endpoints exist but are not implemented in this node:

- Get workflow content
- Submit workflow content
- Get workflow pdf
- Create mass ticket from project
- Get assignment flags
- Get assignments for company
- Get open tickets from company merge
- Get open tickets from company
- Get department order
- Get ticket flags
- Get ticket last entry
- Get ticket list properties
- Get local admin tickets
- Get ticket pinned by ticket id
- Create ticket pinned
- Update ticket pinned
- Delete ticket pinned
- Get preferred technicians
- Get unwanted technicians
- Get ticket contract infos
- Toggle favorite
- Send pdf report via mail
- Delete ticket pinned by type and link id
- Get mail attachments for ticket
- Send mail
- Get mail for ticket
- Get mail attachment
- Get ticket detail pdf
- Get ticket properties
- Get changed ticket properties
- Request new service cap
- Get statistics
