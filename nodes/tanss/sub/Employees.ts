import {
	IExecuteFunctions,
	INodeProperties,
	NodeOperationError,
	IDataObject,
	IHttpRequestOptions,
} from 'n8n-workflow';

export const employeesOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options' as const,
		noDataExpression: true,
		displayOptions: { show: { resource: ['employees'] } },
		options: [
			{
				name: 'Get Technicians',
				value: 'getTechnicians',
				description: 'Gets all technicians of this system',
				action: 'Get technicians',
			},
			{
				name: 'Create Employee',
				value: 'createEmployee',
				description: 'Creates a new employee',
				action: 'Create employee',
			},
		],
		default: 'getTechnicians',
	},
];

export const employeesFields: INodeProperties[] = [
	{
		displayName: 'API Token',
		name: 'apiToken',
		type: 'string' as const,
		typeOptions: { password: true },
		default: '',
		description: 'Optional API token (Bearer). If not provided the credentials are used.',
		displayOptions: { show: { resource: ['employees'] } },
	},
	{
		displayName: 'Freelancer Company ID',
		name: 'freelancerCompanyId',
		type: 'number' as const,
		default: 0,
		description: 'If set, also fetches freelancers of this company (0 for all freelancers)',
		displayOptions: { show: { resource: ['employees'], operation: ['getTechnicians'] } },
	},

	{
		displayName: 'Employee Object',
		name: 'employeeObject',
		type: 'collection' as const,
		placeholder: 'Add Field',
		displayOptions: { show: { resource: ['employees'], operation: ['createEmployee'] } },
		default: {},
		options: [
			{ displayName: 'ID', name: 'id', type: 'number' as const, default: 0 },
			{ displayName: 'Name', name: 'name', type: 'string' as const, default: '' },
			{ displayName: 'First Name', name: 'firstName', type: 'string' as const, default: '' },
			{ displayName: 'Last Name', name: 'lastName', type: 'string' as const, default: '' },
			{ displayName: 'Salutation ID', name: 'salutationId', type: 'number' as const, default: 0 },
			{ displayName: 'Department ID', name: 'departmentId', type: 'number' as const, default: 0 },
			{ displayName: 'Room', name: 'room', type: 'string' as const, default: '' },
			{
				displayName: 'Telephone Number',
				name: 'telephoneNumber',
				type: 'string' as const,
				default: '',
			},
			{ displayName: 'Email Address', name: 'emailAddress', type: 'string' as const, default: '' },
			{ displayName: 'Car ID', name: 'carId', type: 'number' as const, default: 0 },
			{ displayName: 'Mobile Phone', name: 'mobilePhone', type: 'string' as const, default: '' },
			{ displayName: 'Initials', name: 'initials', type: 'string' as const, default: '' },
			{
				displayName: 'Working Hour Model ID',
				name: 'workingHourModelId',
				type: 'number' as const,
				default: 0,
			},
			{
				displayName: 'Accounting Type ID',
				name: 'accountingTypeId',
				type: 'number' as const,
				default: 0,
			},
			{
				displayName: 'Private Phone Number',
				name: 'privatePhoneNumber',
				type: 'string' as const,
				default: '',
			},
			{ displayName: 'Active', name: 'active', type: 'boolean' as const, default: true },
			{ displayName: 'ERP Number', name: 'erpNumber', type: 'string' as const, default: '' },
			{
				displayName: 'Personal Fax Number',
				name: 'personalFaxNumber',
				type: 'string' as const,
				default: '',
			},
			{ displayName: 'Role', name: 'role', type: 'string' as const, default: '' },
			{ displayName: 'Title ID', name: 'titleId', type: 'number' as const, default: 0 },
			{ displayName: 'Language', name: 'language', type: 'string' as const, default: '' },
			{
				displayName: 'Telephone Number Two',
				name: 'telephoneNumberTwo',
				type: 'string' as const,
				default: '',
			},
			{
				displayName: 'Mobile Number Two',
				name: 'mobileNumberTwo',
				type: 'string' as const,
				default: '',
			},
			{
				displayName: 'Restricted User License',
				name: 'restrictedUserLicense',
				type: 'boolean' as const,
				default: false,
			},
			{
				displayName: 'Birthday (YYYY-MM-DD)',
				name: 'birthday',
				type: 'string' as const,
				default: '',
			},
			{
				displayName: 'Company Assignments',
				name: 'companyAssignments',
				type: 'fixedCollection' as const,
				typeOptions: { multipleValues: true },
				placeholder: 'Add Field',
				default: {},
				options: [
					{
						displayName: 'Assignment',
						name: 'assignment',
						values: [
							{ displayName: 'Company ID', name: 'companyId', type: 'number' as const, default: 0 },
						],
					},
				],
			},
		],
	},
];

export async function handleEmployees(this: IExecuteFunctions, i: number) {
	const operation = this.getNodeParameter('operation', i) as string;
	const credentials = await this.getCredentials('tanssApi');
	if (!credentials) throw new NodeOperationError(this.getNode(), 'No credentials returned!');

	const apiToken = this.getNodeParameter('apiToken', i, '') as string;
	const base = credentials.baseURL as string;
	if (!base) throw new NodeOperationError(this.getNode(), 'No baseURL in credentials');

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

	if (apiToken && apiToken.toString().trim() !== '') {
		const tokenValue = String(apiToken).startsWith('Bearer ')
			? String(apiToken)
			: `Bearer ${String(apiToken)}`;
		requestOptions.headers.Authorization = tokenValue;
		requestOptions.headers.apiToken = tokenValue;
	}

	switch (operation) {
		case 'getTechnicians': {
			const freelancerCompanyId = Number(this.getNodeParameter('freelancerCompanyId', i, 0)) || 0;
			let url = `${base}/backend/api/v1/employees/technicians`;
			if (freelancerCompanyId > 0) {
				url += `?freelancerCompanyId=${encodeURIComponent(String(freelancerCompanyId))}`;
			}
			requestOptions.method = 'GET';
			requestOptions.url = url;
			delete requestOptions.headers['Content-Type'];
			break;
		}

		case 'createEmployee': {
			const fields = this.getNodeParameter('employeeObject', i, {}) as IDataObject;
			const body: IDataObject = {};

			if (fields.id !== undefined && String(fields.id).trim() !== '')
				body.id = Number(fields.id) || 0;
			if (fields.name && String(fields.name).trim() !== '') body.name = String(fields.name).trim();
			if (fields.firstName && String(fields.firstName).trim() !== '')
				body.firstName = String(fields.firstName).trim();
			if (fields.lastName && String(fields.lastName).trim() !== '')
				body.lastName = String(fields.lastName).trim();
			if (fields.salutationId !== undefined && String(fields.salutationId).trim() !== '')
				body.salutationId = Number(fields.salutationId) || 0;
			if (fields.departmentId !== undefined && String(fields.departmentId).trim() !== '')
				body.departmentId = Number(fields.departmentId) || 0;
			if (fields.room && String(fields.room).trim() !== '') body.room = String(fields.room).trim();
			if (fields.telephoneNumber && String(fields.telephoneNumber).trim() !== '')
				body.telephoneNumber = String(fields.telephoneNumber).trim();
			if (fields.emailAddress && String(fields.emailAddress).trim() !== '')
				body.emailAddress = String(fields.emailAddress).trim();
			if (fields.carId !== undefined && String(fields.carId).trim() !== '')
				body.carId = Number(fields.carId) || 0;
			if (fields.mobilePhone && String(fields.mobilePhone).trim() !== '')
				body.mobilePhone = String(fields.mobilePhone).trim();
			if (fields.initials && String(fields.initials).trim() !== '')
				body.initials = String(fields.initials).trim();
			if (
				fields.workingHourModelId !== undefined &&
				String(fields.workingHourModelId).trim() !== ''
			)
				body.workingHourModelId = Number(fields.workingHourModelId) || 0;
			if (fields.accountingTypeId !== undefined && String(fields.accountingTypeId).trim() !== '')
				body.accountingTypeId = Number(fields.accountingTypeId) || 0;
			if (fields.privatePhoneNumber && String(fields.privatePhoneNumber).trim() !== '')
				body.privatePhoneNumber = String(fields.privatePhoneNumber).trim();
			if (fields.active !== undefined) body.active = Boolean(fields.active);
			if (fields.erpNumber && String(fields.erpNumber).trim() !== '')
				body.erpNumber = String(fields.erpNumber).trim();
			if (fields.personalFaxNumber && String(fields.personalFaxNumber).trim() !== '')
				body.personalFaxNumber = String(fields.personalFaxNumber).trim();
			if (fields.role && String(fields.role).trim() !== '') body.role = String(fields.role).trim();
			if (fields.titleId !== undefined && String(fields.titleId).trim() !== '')
				body.titleId = Number(fields.titleId) || 0;
			if (fields.language && String(fields.language).trim() !== '')
				body.language = String(fields.language).trim();
			if (fields.telephoneNumberTwo && String(fields.telephoneNumberTwo).trim() !== '')
				body.telephoneNumberTwo = String(fields.telephoneNumberTwo).trim();
			if (fields.mobileNumberTwo && String(fields.mobileNumberTwo).trim() !== '')
				body.mobileNumberTwo = String(fields.mobileNumberTwo).trim();
			if (fields.restrictedUserLicense !== undefined)
				body.restrictedUserLicense = Boolean(fields.restrictedUserLicense);
			if (fields.birthday && String(fields.birthday).trim() !== '')
				body.birthday = String(fields.birthday).trim();

			if (fields.companyAssignments) {
				const raw = fields.companyAssignments as unknown;
				const assignments: IDataObject[] = [];

				if (Array.isArray(raw)) {
					for (const item of raw as unknown[]) {
						const obj = item as IDataObject;
						if (obj && obj.assignment) {
							if (Array.isArray(obj.assignment)) {
								for (const a of obj.assignment as unknown[]) {
									const ai = a as IDataObject;
									if (ai && ai.companyId !== undefined)
										assignments.push({ companyId: Number(String(ai.companyId)) || 0 });
								}
							} else {
								const ai = obj.assignment as IDataObject;
								if (ai && ai.companyId !== undefined)
									assignments.push({ companyId: Number(String(ai.companyId)) || 0 });
							}
						} else if (obj && obj.companyId !== undefined) {
							assignments.push({ companyId: Number(String(obj.companyId)) || 0 });
						}
					}
				} else if (typeof raw === 'object' && raw !== null) {
					const obj = raw as IDataObject;
					if (obj.assignment) {
						if (Array.isArray(obj.assignment)) {
							for (const a of obj.assignment as unknown[]) {
								const ai = a as IDataObject;
								if (ai && ai.companyId !== undefined)
									assignments.push({ companyId: Number(String(ai.companyId)) || 0 });
							}
						} else {
							const ai = obj.assignment as IDataObject;
							if (ai && ai.companyId !== undefined)
								assignments.push({ companyId: Number(String(ai.companyId)) || 0 });
						}
					} else if (obj.companyId !== undefined) {
						assignments.push({ companyId: Number(String(obj.companyId)) || 0 });
					}
				}

				if (assignments.length) body.companyAssignments = assignments;
			}

			requestOptions.method = 'POST';
			requestOptions.url = `${base}/backend/api/v1/employees`;
			requestOptions.headers['Content-Type'] = 'application/json';
			requestOptions.body = body;
			break;
		}

		default:
			throw new NodeOperationError(
				this.getNode(),
				`The operation "${operation}" is not recognized.`,
			);
	}

	try {
		const response = await this.helpers.httpRequest(
			requestOptions as unknown as IHttpRequestOptions,
		);
		return response;
	} catch (err: unknown) {
		const message = err instanceof Error ? err.message : String(err);
		throw new NodeOperationError(this.getNode(), `Failed to execute ${operation}: ${message}`);
	}
}
