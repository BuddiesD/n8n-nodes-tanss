import { IExecuteFunctions, INodeProperties, NodeOperationError, NodeApiError, JsonObject, IDataObject } from 'n8n-workflow';
import { getTanssBaseUrl, tanssHttpRequest } from './request';

export const companyOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options' as const,
		noDataExpression: true,
		displayOptions: { show: { resource: ['company'] } },
		options: [
			{
				name: 'Create Company',
				value: 'createCompany',
				description: 'Creates a new company',
				action: 'Create a company',
			},
			{
				name: 'Get Company',
				value: 'getCompany',
				description: 'Gets a company by ID',
				action: 'Get a company',
			},
			{
				name: 'Get Company Employees',
				value: 'getCompanyEmployees',
				description: 'Gets all employees of a company',
				action: 'Get all employees of a company',
			},
			{
				name: 'Update Company',
				value: 'updateCompany',
				description: 'Updates an existing company',
				action: 'Update a company',
			},
		],
		default: 'createCompany',
	},
];

const personalCustomerEmployeeFields: INodeProperties[] = [
	{ displayName: 'ID', name: 'id', type: 'number' as const, default: 0 },
	{ displayName: 'Name', name: 'name', type: 'string' as const, default: '' },
	{ displayName: 'First Name', name: 'firstName', type: 'string' as const, default: '' },
	{ displayName: 'Last Name', name: 'lastName', type: 'string' as const, default: '' },
	{ displayName: 'Salutation ID', name: 'salutationId', type: 'number' as const, default: 0 },
	{ displayName: 'Department ID', name: 'departmentId', type: 'number' as const, default: 0 },
	{ displayName: 'Room', name: 'room', type: 'string' as const, default: '' },
	{ displayName: 'Telephone Number', name: 'telephoneNumber', type: 'string' as const, default: '' },
	{ displayName: 'Email Address', name: 'emailAddress', type: 'string' as const, default: '' },
	{ displayName: 'Car ID', name: 'carId', type: 'number' as const, default: 0 },
	{ displayName: 'Mobile Phone', name: 'mobilePhone', type: 'string' as const, default: '' },
	{ displayName: 'Initials', name: 'initials', type: 'string' as const, default: '' },
	{ displayName: 'Working Hour Model ID', name: 'workingHourModelId', type: 'number' as const, default: 0 },
	{ displayName: 'Accounting Type ID', name: 'accountingTypeId', type: 'number' as const, default: 0 },
	{ displayName: 'Private Phone Number', name: 'privatePhoneNumber', type: 'string' as const, default: '' },
	{ displayName: 'Active', name: 'active', type: 'boolean' as const, default: true },
	{ displayName: 'ERP Number', name: 'erpNumber', type: 'string' as const, default: '' },
	{ displayName: 'Personal Fax Number', name: 'personalFaxNumber', type: 'string' as const, default: '' },
	{ displayName: 'Role', name: 'role', type: 'string' as const, default: '' },
	{ displayName: 'Title ID', name: 'titleId', type: 'number' as const, default: 0 },
	{ displayName: 'Language', name: 'language', type: 'string' as const, default: '' },
	{ displayName: 'Telephone Number Two', name: 'telephoneNumberTwo', type: 'string' as const, default: '' },
	{ displayName: 'Mobile Number Two', name: 'mobileNumberTwo', type: 'string' as const, default: '' },
	{ displayName: 'Restricted User License', name: 'restrictedUserLicense', type: 'boolean' as const, default: false },
	{ displayName: 'Birthday (YYYY-MM-DD)', name: 'birthday', type: 'string' as const, default: '' },
];

export const companyFields: INodeProperties[] = [
	{
		displayName: 'Company ID',
		name: 'companyId',
		type: 'number' as const,
		required: true,
		default: 0,
		description: 'ID of the company',
		displayOptions: { show: { resource: ['company'], operation: ['getCompanyEmployees', 'getCompany', 'updateCompany'] } },
	},
	{
		displayName: 'Company Fields',
		name: 'companyFields',
		type: 'collection' as const,
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['company'], operation: ['createCompany'] } },
		options: [
			{ displayName: 'ID', name: 'id', type: 'number' as const, default: 0 },
			{ displayName: 'Display ID', name: 'displayId', type: 'number' as const, default: 0 },
			{ displayName: 'Name', name: 'name', type: 'string' as const, default: '' },
			{ displayName: 'Matchcode', name: 'matchcode', type: 'string' as const, default: '' },
			{ displayName: 'Street', name: 'street', type: 'string' as const, default: '' },
			{ displayName: 'Postcode', name: 'postcode', type: 'string' as const, default: '' },
			{ displayName: 'City', name: 'city', type: 'string' as const, default: '' },
			{ displayName: 'Country', name: 'country', type: 'string' as const, default: '' },
			{ displayName: 'Note', name: 'note', type: 'string' as const, default: '' },
			{ displayName: 'Headquarter ID', name: 'headquarterId', type: 'number' as const, default: 0 },
			{ displayName: 'Email', name: 'email', type: 'string' as const, default: '' },
			{ displayName: 'Website', name: 'website', type: 'string' as const, default: '' },
			{ displayName: 'Support Info', name: 'supportInfo', type: 'string' as const, default: '' },
			{ displayName: 'Lockout', name: 'lockout', type: 'boolean' as const, default: false },
			{ displayName: 'Lockout Reason', name: 'lockoutReason', type: 'string' as const, default: '' },
			{ displayName: 'Inactive', name: 'inactive', type: 'boolean' as const, default: false },
			{ displayName: 'Telephone', name: 'telephone', type: 'string' as const, default: '' },
			{ displayName: 'Telefax', name: 'telefax', type: 'string' as const, default: '' },
			{ displayName: 'Personal Customer', name: 'personalCustomer', type: 'boolean' as const, default: false },
			{
				displayName: 'Types',
				name: 'types',
				type: 'fixedCollection' as const,
				typeOptions: { multipleValues: true },
				placeholder: 'Add Type',
				default: {},
				options: [
					{
						displayName: 'Type',
						name: 'type',
						values: [
							{ displayName: 'Category ID', name: 'categoryId', type: 'number' as const, default: 0 },
							{ displayName: 'Category Name', name: 'categoryName', type: 'string' as const, default: '' },
							{ displayName: 'Hidden', name: 'hidden', type: 'boolean' as const, default: false },
							{ displayName: 'Icon', name: 'icon', type: 'string' as const, default: '' },
							{ displayName: 'ID', name: 'id', type: 'number' as const, default: 0 },
							{ displayName: 'Name', name: 'name', type: 'string' as const, default: '' },
						],
					},
				],
			},
			{
				displayName: 'Personal Customer Employee',
				name: 'personalCustomerEmployee',
				type: 'collection' as const,
				placeholder: 'Add Field',
				default: {},
				options: personalCustomerEmployeeFields,
			},
		],
	},
	{
		displayName: 'Update Company Fields',
		name: 'updateCompanyFields',
		type: 'collection' as const,
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['company'], operation: ['updateCompany'] } },
		options: [
			{ displayName: 'ID', name: 'id', type: 'number' as const, default: 0 },
			{ displayName: 'Display ID', name: 'displayId', type: 'number' as const, default: 0 },
			{ displayName: 'Name', name: 'name', type: 'string' as const, default: '' },
			{ displayName: 'Matchcode', name: 'matchcode', type: 'string' as const, default: '' },
			{ displayName: 'Street', name: 'street', type: 'string' as const, default: '' },
			{ displayName: 'Postcode', name: 'postcode', type: 'string' as const, default: '' },
			{ displayName: 'City', name: 'city', type: 'string' as const, default: '' },
			{ displayName: 'Country', name: 'country', type: 'string' as const, default: '' },
			{ displayName: 'Note', name: 'note', type: 'string' as const, default: '' },
			{ displayName: 'Headquarter ID', name: 'headquarterId', type: 'number' as const, default: 0 },
			{ displayName: 'Email', name: 'email', type: 'string' as const, default: '' },
			{ displayName: 'Website', name: 'website', type: 'string' as const, default: '' },
			{ displayName: 'Support Info', name: 'supportInfo', type: 'string' as const, default: '' },
			{ displayName: 'Lockout', name: 'lockout', type: 'boolean' as const, default: false },
			{ displayName: 'Lockout Reason', name: 'lockoutReason', type: 'string' as const, default: '' },
			{ displayName: 'Inactive', name: 'inactive', type: 'boolean' as const, default: false },
			{ displayName: 'Telephone', name: 'telephone', type: 'string' as const, default: '' },
			{ displayName: 'Telefax', name: 'telefax', type: 'string' as const, default: '' },
			{ displayName: 'Personal Customer', name: 'personalCustomer', type: 'boolean' as const, default: false },
			{
				displayName: 'Types',
				name: 'types',
				type: 'fixedCollection' as const,
				typeOptions: { multipleValues: true },
				placeholder: 'Add Type',
				default: {},
				options: [
					{
						displayName: 'Type',
						name: 'type',
						values: [
							{ displayName: 'Category ID', name: 'categoryId', type: 'number' as const, default: 0 },
							{ displayName: 'Category Name', name: 'categoryName', type: 'string' as const, default: '' },
							{ displayName: 'Hidden', name: 'hidden', type: 'boolean' as const, default: false },
							{ displayName: 'Icon', name: 'icon', type: 'string' as const, default: '' },
							{ displayName: 'ID', name: 'id', type: 'number' as const, default: 0 },
							{ displayName: 'Name', name: 'name', type: 'string' as const, default: '' },
						],
					},
				],
			},
			{
				displayName: 'Personal Customer Employee',
				name: 'personalCustomerEmployee',
				type: 'collection' as const,
				placeholder: 'Add Field',
				default: {},
				options: personalCustomerEmployeeFields,
			},
		],
	},
];

function assignString(body: IDataObject, key: string, value: unknown) {
	if (value !== undefined && String(value).trim() !== '') {
		body[key] = String(value).trim();
	}
}

function assignNumber(body: IDataObject, key: string, value: unknown) {
	if (value !== undefined && String(value).trim() !== '') {
		body[key] = Number(value) || 0;
	}
}

function assignBoolean(body: IDataObject, key: string, value: unknown) {
	if (value !== undefined) {
		body[key] = Boolean(value);
	}
}

function buildCompanyBody(fields: IDataObject): IDataObject {
	const body: IDataObject = {};

	assignNumber(body, 'id', fields.id);
	assignNumber(body, 'displayId', fields.displayId);
	assignString(body, 'name', fields.name);
	assignString(body, 'matchcode', fields.matchcode);
	assignString(body, 'street', fields.street);
	assignString(body, 'postcode', fields.postcode);
	assignString(body, 'city', fields.city);
	assignString(body, 'country', fields.country);
	assignString(body, 'note', fields.note);
	assignNumber(body, 'headquarterId', fields.headquarterId);
	assignString(body, 'email', fields.email);
	assignString(body, 'website', fields.website);
	assignString(body, 'supportInfo', fields.supportInfo);
	assignBoolean(body, 'lockout', fields.lockout);
	assignString(body, 'lockoutReason', fields.lockoutReason);
	assignBoolean(body, 'inactive', fields.inactive);
	assignString(body, 'telephone', fields.telephone);
	assignString(body, 'telefax', fields.telefax);
	assignBoolean(body, 'personalCustomer', fields.personalCustomer);

	if (fields.types) {
		const typesRaw = fields.types as IDataObject;
		const typeItems = (typesRaw.type as IDataObject[]) || [];
		const types = typeItems.map((entry) => {
			const typePayload: IDataObject = {};
			assignNumber(typePayload, 'id', entry.id);
			assignString(typePayload, 'name', entry.name);
			assignNumber(typePayload, 'categoryId', entry.categoryId);
			assignString(typePayload, 'categoryName', entry.categoryName);
			assignString(typePayload, 'icon', entry.icon);
			assignBoolean(typePayload, 'hidden', entry.hidden);
			return typePayload;
		});

		if (types.length > 0) {
			body.types = types;
		}
	}

	if (fields.personalCustomerEmployee && typeof fields.personalCustomerEmployee === 'object') {
		const employeeRaw = fields.personalCustomerEmployee as IDataObject;
		const employee: IDataObject = {};

		assignNumber(employee, 'id', employeeRaw.id);
		assignString(employee, 'name', employeeRaw.name);
		assignString(employee, 'firstName', employeeRaw.firstName);
		assignString(employee, 'lastName', employeeRaw.lastName);
		assignNumber(employee, 'salutationId', employeeRaw.salutationId);
		assignNumber(employee, 'departmentId', employeeRaw.departmentId);
		assignString(employee, 'room', employeeRaw.room);
		assignString(employee, 'telephoneNumber', employeeRaw.telephoneNumber);
		assignString(employee, 'emailAddress', employeeRaw.emailAddress);
		assignNumber(employee, 'carId', employeeRaw.carId);
		assignString(employee, 'mobilePhone', employeeRaw.mobilePhone);
		assignString(employee, 'initials', employeeRaw.initials);
		assignNumber(employee, 'workingHourModelId', employeeRaw.workingHourModelId);
		assignNumber(employee, 'accountingTypeId', employeeRaw.accountingTypeId);
		assignString(employee, 'privatePhoneNumber', employeeRaw.privatePhoneNumber);
		assignBoolean(employee, 'active', employeeRaw.active);
		assignString(employee, 'erpNumber', employeeRaw.erpNumber);
		assignString(employee, 'personalFaxNumber', employeeRaw.personalFaxNumber);
		assignString(employee, 'role', employeeRaw.role);
		assignNumber(employee, 'titleId', employeeRaw.titleId);
		assignString(employee, 'language', employeeRaw.language);
		assignString(employee, 'telephoneNumberTwo', employeeRaw.telephoneNumberTwo);
		assignString(employee, 'mobileNumberTwo', employeeRaw.mobileNumberTwo);
		assignBoolean(employee, 'restrictedUserLicense', employeeRaw.restrictedUserLicense);
		assignString(employee, 'birthday', employeeRaw.birthday);

		if (Object.keys(employee).length > 0) {
			body.personalCustomerEmployee = employee;
		}
	}

	return body;
}

export async function handleCompany(this: IExecuteFunctions, i: number) {
	const operation = this.getNodeParameter('operation', i) as string;
	const baseURL = await getTanssBaseUrl.call(this, i);

	const requestOptions: {
		method: 'GET' | 'POST' | 'PUT' | 'DELETE';
		headers: { [key: string]: string };
		json: boolean;
		body?: IDataObject;
		url: string;
	} = {
		method: 'GET',
		headers: { Accept: 'application/json' },
		json: true,
		url: '',
	};

	switch (operation) {
		case 'createCompany': {
			const fields = this.getNodeParameter('companyFields', i, {}) as IDataObject;
			const body = buildCompanyBody(fields);

			if (Object.keys(body).length === 0) {
				throw new NodeOperationError(this.getNode(), 'No fields provided for company creation.');
			}

			requestOptions.method = 'POST';
			requestOptions.url = `${baseURL}/backend/api/v1/companies`;
			requestOptions.headers['Content-Type'] = 'application/json';
			requestOptions.body = body;
			break;
		}

		case 'getCompany': {
			const companyId = Number(this.getNodeParameter('companyId', i, 0)) || 0;
			if (companyId <= 0) {
				throw new NodeOperationError(this.getNode(), 'A valid company ID must be provided.');
			}

			requestOptions.method = 'GET';
			requestOptions.url = `${baseURL}/backend/api/v1/companies/${companyId}`;
			delete requestOptions.headers['Content-Type'];
			break;
		}

		case 'getCompanyEmployees': {
			const companyId = Number(this.getNodeParameter('companyId', i, 0)) || 0;
			if (companyId <= 0) {
				throw new NodeOperationError(this.getNode(), 'A valid company ID must be provided.');
			}

			requestOptions.method = 'GET';
			requestOptions.url = `${baseURL}/backend/api/v1/companies/${companyId}/employees`;
			delete requestOptions.headers['Content-Type'];
			break;
		}

		case 'updateCompany': {
			const companyId = Number(this.getNodeParameter('companyId', i, 0)) || 0;
			if (companyId <= 0) {
				throw new NodeOperationError(this.getNode(), 'A valid company ID must be provided.');
			}

			const fields = this.getNodeParameter('updateCompanyFields', i, {}) as IDataObject;
			const body = buildCompanyBody(fields);

			if (Object.keys(body).length === 0) {
				throw new NodeOperationError(this.getNode(), 'No fields provided for company update.');
			}

			requestOptions.method = 'PUT';
			requestOptions.url = `${baseURL}/backend/api/v1/companies/${companyId}`;
			requestOptions.headers['Content-Type'] = 'application/json';
			requestOptions.body = body;
			break;
		}

		default:
			throw new NodeOperationError(this.getNode(), `The operation "${operation}" is not recognized.`);
	}

	try {
		return await tanssHttpRequest.call(this, i, requestOptions as unknown as import('n8n-workflow').IHttpRequestOptions);
	} catch (error: unknown) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}
