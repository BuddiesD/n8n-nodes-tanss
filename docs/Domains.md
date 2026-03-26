# Domains Operations

## Create Domain

**API Endpoint:** POST /api/v1/domains

Create a new domain entry.

**Parameters:**

- **Company ID**
- **Title**
- **FQDN**
- **Description**
- **Provider Name**
- **Customer ID**
- **Admin URL**
- **Login Name**
- **Login Password**
- **Contract Duration Start**
- **Contract Duration End**
- **Purchase Price**
- **Selling Price**
- **Period**
- **Usage**
- **Forward Domain ID**
- **Responsible Tech ID**
- **Certificate**
- **Certificate CA**
- **IPv4**
- **IPv6**
- **Owner Link Type ID**
- **Owner**
- **Adminc Link Type ID**
- **Adminc**
- **Techc Link Type ID**
- **Techc**
- **ID**

## Get Domain by ID

**API Endpoint:** GET /api/v1/domains/{id}

Retrieve a specific domain by its ID.

**Parameters:**

- **Domain ID** (required)

## Update Domain

**API Endpoint:** PUT /api/v1/domains/{id}

Update an existing domain.

**Parameters:**

- **Domain ID** (required)
- **Company ID**
- **Title**
- **FQDN**
- **Description**
- **Provider Name**
- **Customer ID**
- **Admin URL**
- **Login Name**
- **Login Password**
- **Contract Duration Start**
- **Contract Duration End**
- **Purchase Price**
- **Selling Price**
- **Period**
- **Usage**
- **Forward Domain ID**
- **Responsible Tech ID**
- **Certificate**
- **Certificate CA**
- **IPv4**
- **IPv6**
- **Owner Link Type ID**
- **Owner**
- **Adminc Link Type ID**
- **Adminc**
- **Techc Link Type ID**
- **Techc**
- **ID**

## Delete Domain

**API Endpoint:** DELETE /api/v1/domains/{id}

Delete a domain.

**Parameters:**

- **Domain ID** (required)

## List Domains by Company

**API Endpoint:** GET /api/v1/domains/company/{companyId}

Retrieve all domains associated with a specific company.

**Parameters:**

- **Company ID** (required)
