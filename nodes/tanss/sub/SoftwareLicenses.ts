import { IExecuteFunctions, INodeProperties, NodeOperationError, NodeApiError, JsonObject } from 'n8n-workflow';
import { getTanssBaseUrl, tanssHttpRequest } from './request';

type SoftwareLicenseAssignment = {
	linkTypeId?: number;
	linkId?: number;
};

type SoftwareLicenseFieldInput = Record<string, unknown> & {
	assignments?: { assignment?: SoftwareLicenseAssignment[] } | SoftwareLicenseAssignment[];
};

type SoftwareLicenseTypeFieldInput = Record<string, unknown> & {
	path?: string[];
};

const softwareLicenseAssignmentCollectionOption: INodeProperties = {
	displayName: 'Assignments',
	name: 'assignments',
	type: 'fixedCollection' as const,
	typeOptions: { multipleValues: true },
	default: {},
	options: [
		{
			displayName: 'Assignment',
			name: 'assignment',
			values: [
				{ displayName: 'Link Type ID', name: 'linkTypeId', type: 'number' as const, default: 0 },
				{ displayName: 'Link ID', name: 'linkId', type: 'number' as const, default: 0 },
			],
		},
	],
};

const softwareLicensePayloadFields: INodeProperties[] = [
	{ displayName: 'ID', name: 'id', type: 'number' as const, default: 0 },
	{ displayName: 'Company ID', name: 'companyId', type: 'number' as const, default: 0 },
	{ displayName: 'Remark', name: 'remark', type: 'string' as const, default: '' },
	{ displayName: 'Internal Remark', name: 'internalRemark', type: 'string' as const, default: '' },
	{ displayName: 'Serial Number', name: 'serialNumber', type: 'string' as const, default: '' },
	{ displayName: 'Inventory Number', name: 'inventoryNumber', type: 'string' as const, default: '' },
	{ displayName: 'Software License Type ID', name: 'softwarelicenseTypeId', type: 'number' as const, default: 0 },
	{ displayName: 'Expiration Date (Timestamp)', name: 'expirationDate', type: 'number' as const, default: 0 },
	{ displayName: 'Renew', name: 'renew', type: 'boolean' as const, default: false },
	{ displayName: 'Date (Timestamp)', name: 'date', type: 'number' as const, default: 0 },
	{ displayName: 'Max Number Of Install', name: 'maxNumberOfInstall', type: 'number' as const, default: 0 },
	{ displayName: 'Number Of Volumes', name: 'numberOfVolumes', type: 'number' as const, default: 0 },
	{ displayName: 'Active', name: 'active', type: 'boolean' as const, default: true },
	{ displayName: 'Employee ID', name: 'employeeId', type: 'number' as const, default: 0 },
	{ displayName: 'Article Number', name: 'articleNumber', type: 'string' as const, default: '' },
	{ displayName: 'Contract Price', name: 'contractPrice', type: 'number' as const, default: 0 },
	softwareLicenseAssignmentCollectionOption,
];

const softwareLicenseTypePayloadFields: INodeProperties[] = [
	{ displayName: 'ID', name: 'id', type: 'number' as const, default: 0 },
	{ displayName: 'Manufacturer Number', name: 'manufacturerNumber', type: 'string' as const, default: '' },
	{ displayName: 'Name', name: 'name', type: 'string' as const, default: '' },
	{ displayName: 'Comment', name: 'comment', type: 'string' as const, default: '' },
	{ displayName: 'Previous ID', name: 'previousId', type: 'number' as const, default: 0 },
	{ displayName: 'Active', name: 'active', type: 'boolean' as const, default: true },
	{ displayName: 'Standard Running Time', name: 'standardRunningTime', type: 'number' as const, default: 0 },
	{ displayName: 'Standard Renew', name: 'standardRenew', type: 'boolean' as const, default: false },
	{
		displayName: 'Standard Max Number Of Installations',
		name: 'standardMaxNumberOfInstallations',
		type: 'number' as const,
		default: 0,
	},
	{ displayName: 'Article Number', name: 'articleNumber', type: 'string' as const, default: '' },
	{
		displayName: 'Path (JSON Array)',
		name: 'path',
		type: 'json' as const,
		default: '[]',
		description: 'Hierarchical path as JSON array, e.g. ["Software", "Security", "Antivirus"]',
	},
];

export const softwareLicensesOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options' as const,
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['softwareLicenses'],
			},
		},
		options: [
			{
				name: 'Get Software Licenses',
				value: 'getSoftwareLicenses',
				description: 'Get a list of software licenses',
				action: 'Get a list of software licenses',
			},
			{
				name: 'Create Software License',
				value: 'createSoftwareLicense',
				description: 'Creates a software license',
				action: 'Create a software license',
			},
			{
				name: 'Get Software License by ID',
				value: 'getSoftwareLicenseById',
				description: 'Gets a single software license by ID',
				action: 'Get a software license by ID',
			},
			{
				name: 'Update Software License',
				value: 'updateSoftwareLicense',
				description: 'Updates a software license',
				action: 'Update a software license',
			},
			{
				name: 'Delete Software License',
				value: 'deleteSoftwareLicense',
				description: 'Deletes a software license',
				action: 'Delete a software license',
			},
			{
				name: 'Get Software License Types',
				value: 'getSoftwareLicenseTypes',
				description: 'Gets all software license types',
				action: 'Get software license types',
			},
			{
				name: 'Create Software License Type',
				value: 'createSoftwareLicenseType',
				description: 'Creates a new software license type',
				action: 'Create a software license type',
			},
			{
				name: 'Get Software License Type',
				value: 'getSoftwareLicenseTypeById',
				description: 'Gets a single software license type',
				action: 'Get a software license type',
			},
			{
				name: 'Update Software License Type',
				value: 'updateSoftwareLicenseType',
				description: 'Updates a software license type',
				action: 'Update a software license type',
			},
			{
				name: 'Delete Software License Type',
				value: 'deleteSoftwareLicenseType',
				description: 'Deletes a software license type',
				action: 'Delete a software license type',
			},
		],
		default: 'getSoftwareLicenses',
	},
];

export const softwareLicensesFields: INodeProperties[] = [
	{
		displayName: 'Software License ID',
		name: 'softwareLicenseId',
		type: 'number' as const,
		required: true,
		default: 0,
		description: 'ID of the software license',
		displayOptions: {
			show: {
				resource: ['softwareLicenses'],
				operation: ['getSoftwareLicenseById', 'updateSoftwareLicense', 'deleteSoftwareLicense'],
			},
		},
	},
	{
		displayName: 'Software License Type ID',
		name: 'softwareLicenseTypeId',
		type: 'number' as const,
		required: true,
		default: 0,
		description: 'ID of the software license type',
		displayOptions: {
			show: {
				resource: ['softwareLicenses'],
				operation: ['getSoftwareLicenseTypeById', 'updateSoftwareLicenseType', 'deleteSoftwareLicenseType'],
			},
		},
	},
	{
		displayName: 'Software Licenses Filters',
		name: 'softwareLicensesFilters',
		type: 'collection' as const,
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['softwareLicenses'],
				operation: ['getSoftwareLicenses'],
			},
		},
		options: [
			{ displayName: 'Company ID', name: 'companyId', type: 'number' as const, default: 0, description: 'Show only entries of this company' },
			{
				displayName: 'Branches',
				name: 'branches',
				type: 'options' as const,
				options: [
					{ name: 'COMPANY_ONLY', value: 'COMPANY_ONLY' },
					{ name: 'BRANCHES_ONLY', value: 'BRANCHES_ONLY' },
					{ name: 'COMPANY_AND_BRANCHES', value: 'COMPANY_AND_BRANCHES' },
					{ name: 'SPECIFIC_BRANCH', value: 'SPECIFIC_BRANCH' },
				],
				default: 'COMPANY_ONLY',
				description: 'Filter settings for branches',
			},
			{
				displayName: 'Active',
				name: 'active',
				type: 'options' as const,
				options: [
					{ name: 'ACTIVE_ONLY', value: 'ACTIVE_ONLY' },
					{ name: 'INACTIVE_ONLY', value: 'INACTIVE_ONLY' },
					{ name: 'ACTIVE_AND_INACTIVE', value: 'ACTIVE_AND_INACTIVE' },
				],
				default: 'ACTIVE_AND_INACTIVE',
				description: 'Filter settings for "active" state of the software license',
			},
			{
				displayName: 'Software License Type ID',
				name: 'softwarelicenseTypeId',
				type: 'number' as const,
				default: 0,
				description: 'Periphery type (software license type ID)',
			},
			{
				displayName: 'Link Type ID',
				name: 'linkTypeId',
				type: 'number' as const,
				default: 0,
				description: 'Link type ID (assignment relation type)',
			},
			{
				displayName: 'Link ID',
				name: 'linkId',
				type: 'number' as const,
				default: 0,
				description: 'Linked entity ID (device ID or other target depending on linkTypeId)',
			},
			{
				displayName: 'Include Sub Types',
				name: 'includeSubTypes',
				type: 'boolean' as const,
				default: true,
				description: 'Whether sub types should be included as well',
			},
			{
				displayName: 'Expiry Filter',
				name: 'expiryFilter',
				type: 'options' as const,
				default: 'ALL',
				description: 'Defines how software licenses are filtered by expiry status',
				options: [
					{ name: 'ALL', value: 'ALL' },
					{ name: 'ONLY_EXPIRED', value: 'ONLY_EXPIRED' },
					{ name: 'ONLY_NOT_EXPIRED', value: 'ONLY_NOT_EXPIRED' },
					{ name: 'EXPIRE_IN_60_DAYS', value: 'EXPIRE_IN_60_DAYS' },
					{ name: 'EXPIRED_WITHOUT_RENEW', value: 'EXPIRED_WITHOUT_RENEW' },
					{ name: 'EXPIRED_WITH_RENEW', value: 'EXPIRED_WITH_RENEW' },
					{ name: 'EXPIRES_IN_X_DAYS', value: 'EXPIRES_IN_X_DAYS' },
				],
			},
			{
				displayName: 'Only Overlicenced',
				name: 'onlyOverlicenced',
				type: 'boolean' as const,
				default: false,
				description: 'If true, return only over-licensed entries',
			},
		],
	},
	{
		displayName: 'Create Software License Fields',
		name: 'createSoftwareLicenseFields',
		type: 'collection' as const,
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['softwareLicenses'],
				operation: ['createSoftwareLicense'],
			},
		},
		options: softwareLicensePayloadFields,
	},
	{
		displayName: 'Update Software License Fields',
		name: 'updateSoftwareLicenseFields',
		type: 'collection' as const,
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['softwareLicenses'],
				operation: ['updateSoftwareLicense'],
			},
		},
		options: softwareLicensePayloadFields,
	},
	{
		displayName: 'Create Software License Type Fields',
		name: 'createSoftwareLicenseTypeFields',
		type: 'collection' as const,
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['softwareLicenses'],
				operation: ['createSoftwareLicenseType'],
			},
		},
		options: softwareLicenseTypePayloadFields,
	},
	{
		displayName: 'Update Software License Type Fields',
		name: 'updateSoftwareLicenseTypeFields',
		type: 'collection' as const,
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['softwareLicenses'],
				operation: ['updateSoftwareLicenseType'],
			},
		},
		options: softwareLicenseTypePayloadFields,
	},
];

function normalizeSoftwareLicenseBody(fields: SoftwareLicenseFieldInput): Record<string, unknown> {
	const body = { ...fields } as Record<string, unknown>;

	if (fields.assignments) {
		if (Array.isArray(fields.assignments)) {
			body.assignments = fields.assignments;
		} else if (fields.assignments.assignment && Array.isArray(fields.assignments.assignment)) {
			body.assignments = fields.assignments.assignment;
		}
	}

	return body;
}

function normalizeSoftwareLicenseTypeBody(fields: SoftwareLicenseTypeFieldInput): Record<string, unknown> {
	const body = { ...fields } as Record<string, unknown>;

	if (fields.path !== undefined) {
		if (Array.isArray(fields.path)) {
			body.path = fields.path.map((entry) => String(entry));
		} else {
			delete body.path;
		}
	}

	return body;
}

export async function handleSoftwareLicenses(this: IExecuteFunctions, i: number) {
	const operation = this.getNodeParameter('operation', i) as string;
	const credentials = ({ baseURL: await getTanssBaseUrl.call(this, i) });
	if (!credentials) throw new NodeOperationError(this.getNode(), 'No credentials returned!');
	const softwareLicenseId = this.getNodeParameter('softwareLicenseId', i, 0) as number;
	const softwareLicenseTypeId = this.getNodeParameter('softwareLicenseTypeId', i, 0) as number;

	let url = '';
	const requestOptions: {
		method: 'GET' | 'POST' | 'PUT' | 'DELETE';
		headers: { 'Content-Type': string };
		json: boolean;
		body?: Record<string, unknown>;
		url: string;
		returnFullResponse?: boolean;
	} = {
		method: 'GET',
		headers: { 'Content-Type': 'application/json' },
		json: true,
		url,
	};

	switch (operation) {
		case 'getSoftwareLicenses': {
			const filters = this.getNodeParameter('softwareLicensesFilters', i, {}) as Record<string, unknown>;
			url = `${credentials.baseURL}/backend/api/v1/softwarelicenses`;
			requestOptions.method = 'PUT';
			requestOptions.body = filters;
			break;
		}
		case 'createSoftwareLicense': {
			const createFields = this.getNodeParameter('createSoftwareLicenseFields', i, {}) as SoftwareLicenseFieldInput;
			if (Object.keys(createFields).length === 0) throw new NodeOperationError(this.getNode(), 'No fields provided for creating software license.');
			url = `${credentials.baseURL}/backend/api/v1/softwarelicenses`;
			requestOptions.method = 'POST';
			requestOptions.body = normalizeSoftwareLicenseBody(createFields);
			break;
		}
		case 'getSoftwareLicenseById': {
			if (!softwareLicenseId) throw new NodeOperationError(this.getNode(), 'softwareLicenseId is required for get.');
			url = `${credentials.baseURL}/backend/api/v1/softwarelicenses/${softwareLicenseId}`;
			requestOptions.method = 'GET';
			break;
		}
		case 'updateSoftwareLicense': {
			if (!softwareLicenseId) throw new NodeOperationError(this.getNode(), 'softwareLicenseId is required for update.');
			const updateFields = this.getNodeParameter('updateSoftwareLicenseFields', i, {}) as SoftwareLicenseFieldInput;
			if (Object.keys(updateFields).length === 0) throw new NodeOperationError(this.getNode(), 'No fields provided for updating software license.');
			url = `${credentials.baseURL}/backend/api/v1/softwarelicenses/${softwareLicenseId}`;
			requestOptions.method = 'PUT';
			requestOptions.body = normalizeSoftwareLicenseBody(updateFields);
			break;
		}
		case 'deleteSoftwareLicense': {
			if (!softwareLicenseId) throw new NodeOperationError(this.getNode(), 'softwareLicenseId is required for delete.');
			url = `${credentials.baseURL}/backend/api/v1/softwarelicenses/${softwareLicenseId}`;
			requestOptions.method = 'DELETE';
			break;
		}
		case 'getSoftwareLicenseTypes': {
			url = `${credentials.baseURL}/backend/api/v1/softwarelicenses/types`;
			requestOptions.method = 'GET';
			break;
		}
		case 'createSoftwareLicenseType': {
			const createTypeFields = this.getNodeParameter('createSoftwareLicenseTypeFields', i, {}) as SoftwareLicenseTypeFieldInput;
			if (Object.keys(createTypeFields).length === 0)
				throw new NodeOperationError(this.getNode(), 'No fields provided for creating software license type.');
			url = `${credentials.baseURL}/backend/api/v1/softwarelicenses/types`;
			requestOptions.method = 'POST';
			requestOptions.body = normalizeSoftwareLicenseTypeBody(createTypeFields);
			break;
		}
		case 'getSoftwareLicenseTypeById': {
			if (!softwareLicenseTypeId) throw new NodeOperationError(this.getNode(), 'softwareLicenseTypeId is required for get.');
			url = `${credentials.baseURL}/backend/api/v1/softwarelicenses/types/${softwareLicenseTypeId}`;
			requestOptions.method = 'GET';
			break;
		}
		case 'updateSoftwareLicenseType': {
			if (!softwareLicenseTypeId) throw new NodeOperationError(this.getNode(), 'softwareLicenseTypeId is required for update.');
			const updateTypeFields = this.getNodeParameter('updateSoftwareLicenseTypeFields', i, {}) as SoftwareLicenseTypeFieldInput;
			if (Object.keys(updateTypeFields).length === 0)
				throw new NodeOperationError(this.getNode(), 'No fields provided for updating software license type.');
			url = `${credentials.baseURL}/backend/api/v1/softwarelicenses/types/${softwareLicenseTypeId}`;
			requestOptions.method = 'PUT';
			requestOptions.body = normalizeSoftwareLicenseTypeBody(updateTypeFields);
			break;
		}
		case 'deleteSoftwareLicenseType': {
			if (!softwareLicenseTypeId) throw new NodeOperationError(this.getNode(), 'softwareLicenseTypeId is required for delete.');
			url = `${credentials.baseURL}/backend/api/v1/softwarelicenses/types/${softwareLicenseTypeId}`;
			requestOptions.method = 'DELETE';
			break;
		}
		default:
			throw new NodeOperationError(this.getNode(), `The operation "${operation}" is not recognized for Software Licenses.`);
	}

	requestOptions.url = url;

	try {
		type FullResponse = { statusCode: number; body?: unknown };
		const options = {
			...requestOptions,
			returnFullResponse: true,
		} as unknown as import('n8n-workflow').IHttpRequestOptions;
		const fullResponse = (await tanssHttpRequest.call(this, i, options)) as unknown as FullResponse;

		if (requestOptions.method === 'DELETE') {
			if (fullResponse.statusCode === 204) {
				return { success: true, statusCode: 204, message: 'Software license deleted successfully.' };
			}

			return {
				success: false,
				statusCode: fullResponse.statusCode,
				message: `Delete request failed (status ${fullResponse.statusCode})`,
				error: fullResponse.body ?? null,
			};
		}

		return fullResponse.body ?? (fullResponse as unknown);
	} catch (error: unknown) {
		if (requestOptions.method === 'DELETE') {
			const anyErr = error as {
				statusCode?: number;
				response?: { status?: number; statusCode?: number; body?: unknown; data?: unknown };
			};
			const statusCode = anyErr?.response?.statusCode ?? anyErr?.response?.status ?? anyErr?.statusCode ?? 0;
			const rawBody = anyErr?.response?.body ?? anyErr?.response?.data;

			let parsedBody: unknown = rawBody;
			if (typeof rawBody === 'string') {
				try {
					parsedBody = JSON.parse(rawBody);
				} catch {
					parsedBody = rawBody;
				}
			}

			return {
				success: false,
				statusCode,
				message: error instanceof Error ? error.message : `Delete request failed (status ${statusCode})`,
				error: parsedBody,
			};
		}
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}
