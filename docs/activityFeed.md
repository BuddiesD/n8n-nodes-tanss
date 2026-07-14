# Activity Feed Operations

## List User Items

**API Endpoint:** PUT /api/v1/tanssEvents

Gets a list of activity feed items for the current user.

**Parameters:**

- **Activity Feed Filter** supports `minimumCreationDate`, `linkIds`, `linkTypes`, `triggerTypes`, `preventViewEvent`, `includeContent`, `seenFilter`, and `confirmedFilter`
- At least one filter must be selected before running `List User Items`

## Get Number of Unseen Events

**API Endpoint:** GET /api/v1/tanssEvents/unseen

Gets the total number of unseen activity feed events.

## Mark All as Seen

**API Endpoint:** POST /api/v1/tanssEvents/mark/all/seen

Marks all unseen activity feed events as seen.

## Get Rule Assignments

**API Endpoint:** GET /api/v1/tanssEvents/rules/{type}/assignments

Gets TANSS event rule assignments by link type.

**Parameters:**

- **Link Type** (required) — The entity type to fetch assignments for (e.g. TICKET, COMPANY, EMPLOYEE, PC, etc.)
