# Company Categories Operations

## List Categories

**API Endpoint:** GET /api/v1/companyCategories

Retrieve a list of company categories.

**Parameters:**

- **API Token** (required)

## Create Category

**API Endpoint:** POST /api/v1/companyCategories

Create a new company category.

**Parameters:**

- **API Token** (required)
- **ID**
- **Name**

## Get Category

**API Endpoint:** GET /api/v1/companyCategories/{id}

Retrieve a specific company category by its ID.

**Parameters:**

- **API Token** (required)
- **Category ID** (required)

## Update Category

**API Endpoint:** PUT /api/v1/companyCategories/{id}

Update an existing company category.

**Parameters:**

- **API Token** (required)
- **Category ID** (required)
- **ID**
- **Name**

## Delete Category

**API Endpoint:** DELETE /api/v1/companyCategories/{id}

Delete a company category.

**Parameters:**

- **API Token** (required)
- **Category ID** (required)

## List Company Types

**API Endpoint:** GET /api/v1/companyCategories/types

Retrieve a list of company types.

**Parameters:**

- **API Token** (required)

## Create Company Type

**API Endpoint:** POST /api/v1/companyCategories/types

Create a new company type.

**Parameters:**

- **API Token** (required)
- **ID**
- **Name**
- **Category ID**
- **Category Name**
- **Icon**
- **Hidden**

## Get Company Type

**API Endpoint:** GET /api/v1/companyCategories/types/{id}

Retrieve a specific company type by its ID.

**Parameters:**

- **API Token** (required)
- **Company Type ID** (required)

## Update Company Type

**API Endpoint:** PUT /api/v1/companyCategories/types/{id}

Update an existing company type.

**Parameters:**

- **API Token** (required)
- **Company Type ID** (required)
- **ID**
- **Name**
- **Category ID**
- **Category Name**
- **Icon**
- **Hidden**

## Delete Company Type

**API Endpoint:** DELETE /api/v1/companyCategories/types/{id}

Delete a company type.

**Parameters:**

- **API Token** (required)
- **Company Type ID** (required)
