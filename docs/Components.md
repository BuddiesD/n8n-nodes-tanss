# Components Operations

## Get Component

**API Endpoint:** GET /api/v1/components/{param}

Gets a component by id

Fetches a component by a given id

**Parameters:**

- **API Token** (required)
- **Component ID**

## Create Component

**API Endpoint:** POST /api/v1/components

Creates a component

|

**Parameters:**

- **API Token** (required)
- **Create Component Fields**
- **Create Component Fields -> ID**
- **Create Component Fields -> inventoryNumber**
- **Create Component Fields -> componentTypeId**
- **Create Component Fields -> pcId**
- **Create Component Fields -> peripheryId**
- **Create Component Fields -> manufacturerId**
- **Create Component Fields -> Type**
- **Create Component Fields -> serialNumber**
- **Create Component Fields -> Megabytes**
- **Create Component Fields -> hddTypeId**
- **Create Component Fields -> scsiId**
- **Create Component Fields -> onBoard**
- **Create Component Fields -> companyId**
- **Create Component Fields -> Remark**
- **Create Component Fields -> Active**
- **Create Component Fields -> Date (Timestamp)**
- **Create Component Fields -> billingNumber**
- **Create Component Fields -> articleNumber**
- **Create Component Fields -> storageId**
- **Create Component Fields -> purchasePrice**
- **Create Component Fields -> sellingPrice**
- **Create Component Fields -> Description**

## Update Component

**API Endpoint:** PUT /api/v1/components/{param}

Updates a component

|

**Parameters:**

- **API Token** (required)
- **Component ID**
- **Update Component Fields**
- **Update Component Fields -> inventoryNumber**
- **Update Component Fields -> componentTypeId**
- **Update Component Fields -> pcId**
- **Update Component Fields -> peripheryId**
- **Update Component Fields -> manufacturerId**
- **Update Component Fields -> Type**
- **Update Component Fields -> serialNumber**
- **Update Component Fields -> Megabytes**
- **Update Component Fields -> hddTypeId**
- **Update Component Fields -> scsiId**
- **Update Component Fields -> onBoard**
- **Update Component Fields -> companyId**
- **Update Component Fields -> Remark**
- **Update Component Fields -> Active**
- **Update Component Fields -> Date (Timestamp)**
- **Update Component Fields -> billingNumber**
- **Update Component Fields -> articleNumber**
- **Update Component Fields -> storageId**
- **Update Component Fields -> purchasePrice**
- **Update Component Fields -> sellingPrice**
- **Update Component Fields -> Description**

## Delete Component

**API Endpoint:** DELETE /api/v1/components/{param}

Deletes a component

|

**Parameters:**

- **API Token** (required)
- **Component ID**

## List Components

**API Endpoint:** PUT /api/v1/components

Gets a list of components

|

**Parameters:**

- **API Token** (required)
- **List Components Filters**
- **List Components Filters -> companyId**
- **List Components Filters -> Branches**
- **List Components Filters -> Active**
- **List Components Filters -> componentTypeId**
- **List Components Filters -> pcId**
- **List Components Filters -> peripheryId**
- **List Components Filters -> builtInFilter**

## Get Component Types

**API Endpoint:** GET /api/v1/components/types

Gets a list of component types

|

**Parameters:**

- **API Token** (required)

## Create Component Type

**API Endpoint:** POST /api/v1/components/types

Create component type

|

**Parameters:**

- **API Token** (required)
- **Create Component Type Fields**
- **Create Component Type Fields -> ID**
- **Create Component Type Fields -> Type**
- **Create Component Type Fields -> shortName**
- **Create Component Type Fields -> Shown**

## Update Component Type

**API Endpoint:** PUT /api/v1/components/types/{param}

Update component type

|

**Parameters:**

- **API Token** (required)
- **Component Type ID**
- **Update Component Type Fields**
- **Update Component Type Fields -> ID**
- **Update Component Type Fields -> Type**
- **Update Component Type Fields -> shortName**
- **Update Component Type Fields -> Shown**

## Delete Component Type

**API Endpoint:** DELETE /api/v1/components/types/{param}

Delete component type

|

**Parameters:**

- **API Token** (required)
- **Component Type ID**
