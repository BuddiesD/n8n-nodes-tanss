# Company Operations

## Create Company

**API Endpoint:** POST /api/v1/companies

Create a new company in TANSS.

**Parameters:**

- **ID**
- **Display ID**
- **Name**
- **Matchcode**
- **Street**
- **Postcode**
- **City**
- **Country**
- **Note**
- **Headquarter ID**
- **Email**
- **Website**
- **Support Info**
- **Lockout**
- **Lockout Reason**
- **Inactive**
- **Telephone**
- **Telefax**
- **Personal Customer**
- **Types**
- **Type Category ID**
- **Type Category Name**
- **Type Hidden**
- **Type Icon**
- **Type ID**
- **Type Name**
- **Personal Customer Employee**
- **Employee ID**
- **Employee Name**
- **Employee First Name**
- **Employee Last Name**
- **Employee Salutation ID**
- **Employee Department ID**
- **Employee Room**
- **Employee Telephone Number**
- **Employee Email Address**
- **Employee Car ID**
- **Employee Mobile Phone**
- **Employee Initials**
- **Employee Working Hour Model ID**
- **Employee Accounting Type ID**
- **Employee Private Phone Number**
- **Employee Active**
- **Employee ERP Number**
- **Employee Personal Fax Number**
- **Employee Role**
- **Employee Title ID**
- **Employee Language**
- **Employee Telephone Number Two**
- **Employee Mobile Number Two**
- **Employee Restricted User License**
- **Employee Birthday (YYYY-MM-DD)**

## Get Company Employees

**API Endpoint:** GET /api/v1/companies/{companyId}/employees

Retrieve all employees of a company.

**Parameters:**

- **Company ID**