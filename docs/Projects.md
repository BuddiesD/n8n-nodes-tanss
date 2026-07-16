# Projects Operations

## Get Project Tickets

**API Endpoint:** GET /api/v1/tickets/projects

Retrieve a list of all project-level tickets.

## Get Project Status

**API Endpoint:** GET /api/v1/projects/{projectId}/status

Returns aggregated status information for a project — overall progress, number of open vs. done sub-tickets, budget consumption.

**Parameters:**

- **Project ID** (required)

## Get Project Sub-Tickets

**API Endpoint:** GET /api/v1/projects/{projectId}/tickets

Returns the sub-tickets and appointments belonging to a project, used to render the "Mini-Ticketliste" panel inside the project detail view.

**Parameters:**

- **Project ID** (required)

## Create Project Phase

**API Endpoint:** POST /api/v1/projects/phases

Creates a new phase inside a project.

**Parameters:**

- **Project ID** (required)
- **Rank** — Ordering rank of the phase within the project
- **Name** — Display name of the project phase
- **Start Date (Timestamp)** — Start date as Unix timestamp
- **End Date (Timestamp)** — End date as Unix timestamp
- **Closed Pre-Phases Required** — Whether all preceding phases must be closed before this one can start
- **Billing Type** — One of: DEFAULT, TICKET_MUST_BE_CLOSED, ALL_TICKETS_MUST_BE_CLOSED
- **Clearance Mode** — One of: DEFAULT, DONT_CLEAR_SUPPORTS, MAY_CLEAR_SUPPORTS

## Update Project Phase

**API Endpoint:** PUT /api/v1/projects/phases/{phaseId}

Updates a project phase (name, dates, billing/clearance settings, rank).

**Parameters:**

- **Phase ID** (required)
- **Project ID**
- **Rank**
- **Name**
- **Start Date (Timestamp)**
- **End Date (Timestamp)**
- **Closed Pre-Phases Required**
- **Billing Type**
- **Clearance Mode**
- **Options:**
  - **Adjust Start** — When true, shift neighbouring phases to keep the timeline consistent after changing this phase's start
  - **Adjust End** — When true, shift neighbouring phases to keep the timeline consistent after changing this phase's end

## Delete Project Phase

**API Endpoint:** DELETE /api/v1/projects/phases/{phaseId}

Removes a phase from a project. The deletion fails if the phase still has child tickets linked.

**Parameters:**

- **Phase ID** (required)

## Get Company Tickets For Project

**API Endpoint:** GET /api/v1/tickets/companyTicketsForProject/{ticketId}

Returns open project-type tickets at the same company that the current ticket can be assigned to as a sub-ticket. Used by the "Ticket einem Projekt zuordnen" picker — only project tickets the caller can access are returned.

**Parameters:**

- **Ticket ID** (required)

## Get Projects For Ticket

**API Endpoint:** GET /api/v1/tickets/projects/{ticketId}

Returns the list of projects (and their phases) the given ticket can be assigned to — typically all open projects at the ticket's company. Used to populate the "Einem Projekt zuordnen" picker in the ticket UI.

**Parameters:**

- **Ticket ID** (required)

## Assign Ticket To Project

**API Endpoint:** PUT /api/v1/tickets/projects/{ticketId}

Assigns the ticket to a project (and optionally a specific phase), or detaches it by passing `projectId=0`. The response includes only the changed identity fields (`id`, `projectId`, `phaseId`).

**Parameters:**

- **Ticket ID** (required)
- **Assign Ticket Fields:**
  - **Project ID** — ID of the project to assign the ticket to (0 to detach)
  - **Phase ID** — ID of the project phase to assign the ticket to

---
