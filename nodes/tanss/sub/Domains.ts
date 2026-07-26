import { IExecuteFunctions, INodeProperties, NodeOperationError, NodeApiError, JsonObject } from 'n8n-workflow';
import { getTanssBaseUrl, tanssHttpRequest } from './request';

export const domainOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options' as const,
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['domain'],
			},
		},
		options: [
			{
				name: 'Create Domain',
				value: 'createDomain',
				description: 'Creates a new Domain in TANSS',
				action: 'Creates a new domain',
			},
			{
				name: 'Get Domain by ID',
				value: 'getDomainById',
				description: 'Fetches a domain by ID',
				action: 'Fetches a domain by ID',
			},
			{
				name: 'Update Domain',
				value: 'updateDomain',
				description: 'Updates a domain',
				action: 'Updates a domain',
			},
			{
				name: 'Delete Domain',
				value: 'deleteDomain',
				description: 'Deletes a domain',
				action: 'Deletes a domain',
			},
			{
				name: 'List Domains By Company',
				value: 'listDomainsByCompany',
				description: 'Lists domains for a company',
				action: 'Lists domains of a company',
			},
			{
				name: 'DNS Lookup',
				value: 'dnsLookup',
				description: 'Performs a DNS lookup for a hostname or IP',
				action: 'Performs a DNS lookup',
			},
		],
		default: 'createDomain',
	},
];

const domainCreateUpdateFieldOptions: INodeProperties[] = [
	{ displayName: 'Company ID', name: 'companyId', type: 'number' as const, default: 0 },
	{ displayName: 'Title', name: 'title', type: 'string' as const, default: '' },
	{ displayName: 'FQDN', name: 'fqdn', type: 'string' as const, default: '' },
	{ displayName: 'Description', name: 'description', type: 'string' as const, default: '' },
	{ displayName: 'Provider Name', name: 'providerName', type: 'string' as const, default: '' },
	{ displayName: 'Customer ID', name: 'customerId', type: 'string' as const, default: '' },
	{ displayName: 'Admin URL', name: 'adminUrl', type: 'string' as const, default: '' },
	{ displayName: 'Login Name', name: 'loginName', type: 'string' as const, default: '' },
	{ displayName: 'Login Password', name: 'loginPassword', type: 'string' as const, default: '' },
	{ displayName: 'Contract Duration Start', name: 'contractDurationStart', type: 'number' as const, default: 0 },
	{ displayName: 'Contract Duration End', name: 'contractDurationEnd', type: 'number' as const, default: 0 },
	{ displayName: 'Purchase Price', name: 'purchasePrice', type: 'number' as const, default: 0 },
	{ displayName: 'Selling Price', name: 'sellingPrice', type: 'number' as const, default: 0 },
	{ displayName: 'Period', name: 'period', type: 'number' as const, default: 0 },
	{ displayName: 'Usage', name: 'usage', type: 'string' as const, default: '' },
	{ displayName: 'Forward Domain ID', name: 'forwardDomainId', type: 'number' as const, default: 0 },
	{ displayName: 'Responsible Tech ID', name: 'responsibleTechId', type: 'number' as const, default: 0 },
	{ displayName: 'Certificate', name: 'certificate', type: 'string' as const, default: '' },
	{ displayName: 'Certificate CA', name: 'certificateCa', type: 'string' as const, default: '' },
	{ displayName: 'IPv4', name: 'ipv4', type: 'string' as const, default: '' },
	{ displayName: 'IPv6', name: 'ipv6', type: 'string' as const, default: '' },
	{ displayName: 'Owner Link Type ID', name: 'ownerLinkTypeId', type: 'number' as const, default: 0 },
	{ displayName: 'Owner', name: 'owner', type: 'number' as const, default: 0 },
	{ displayName: 'Adminc Link Type ID', name: 'admincLinkTypeId', type: 'number' as const, default: 0 },
	{ displayName: 'Adminc', name: 'adminc', type: 'number' as const, default: 0 },
	{ displayName: 'Techc Link Type ID', name: 'techcLinkTypeId', type: 'number' as const, default: 0 },
	{ displayName: 'Techc', name: 'techc', type: 'number' as const, default: 0 },
	{ displayName: 'ID', name: 'id', type: 'number' as const, default: 0 },
];

export const domainFields: INodeProperties[] = [
	{
		displayName: 'Create Domain Fields',
		name: 'createDomainFields',
		type: 'collection' as const,
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: ['domain'],
				operation: ['createDomain'],
			},
		},
		default: {},
		options: domainCreateUpdateFieldOptions,
	},

	{
		displayName: 'Update Domain Fields',
		name: 'updateDomainFields',
		type: 'collection' as const,
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: ['domain'],
				operation: ['updateDomain'],
			},
		},
		default: {},
		options: domainCreateUpdateFieldOptions,
	},

	{
		displayName: 'Domain ID',
		name: 'domainId',
		type: 'string' as const,
		displayOptions: {
			show: {
				resource: ['domain'],
				operation: ['getDomainById', 'updateDomain', 'deleteDomain'],
			},
		},
		required: true,
		description: 'ID of the domain',
		default: '',
	},

	{
		displayName: 'Company ID',
		name: 'companyId',
		type: 'string' as const,
		displayOptions: {
			show: {
				resource: ['domain'],
				operation: ['listDomainsByCompany'],
			},
		},
		required: true,
		default: '',
		description: 'ID of the company',
	},
	{
		displayName: 'Host',
		name: 'host',
		type: 'string' as const,
		displayOptions: {
			show: {
				resource: ['domain'],
				operation: ['dnsLookup'],
			},
		},
		required: true,
		default: '',
		description: 'Hostname or IP address to resolve',
	},
];

export async function handleDomains(this: IExecuteFunctions, i: number) {
	const operation = this.getNodeParameter('operation', i) as string;
	const credentials = { baseURL: await getTanssBaseUrl.call(this, i) };

	const baseURL = credentials.baseURL as string;

	let url = '';
	const requestOptions: {
		method: 'GET' | 'POST' | 'PUT' | 'DELETE';
		headers: { 'Content-Type': string };
		json: boolean;
		body?: Record<string, unknown>;
		url: string;
	} = {
		method: 'GET',
		headers: { 'Content-Type': 'application/json' },
		json: true,
		url,
	};

	switch (operation) {
		case 'createDomain': {
			url = `${baseURL}/backend/api/v1/domains`;
			requestOptions.method = 'POST';
			const createDomainFields = this.getNodeParameter('createDomainFields', i, {}) as Record<string, unknown>;
			if (Object.keys(createDomainFields).length === 0) throw new NodeOperationError(this.getNode(), 'No fields provided for domain creation.');
			requestOptions.body = createDomainFields;
			break; // Waiting for Tanss Support, as the API currently needs all fields or else it throws an error that the field is null. Should be like the other API endpoints, where you can just provide the fields you want to set and the rest is optional and defaults to 0 or '' depending on the field type.
		}
		case 'getDomainById': {
			const domainIdRaw = this.getNodeParameter('domainId', i, '') as string;
			const domainId = Number(domainIdRaw);
			if (Number.isNaN(domainId) || domainId <= 0) throw new NodeOperationError(this.getNode(), 'A valid domainId must be provided.');
			url = `${baseURL}/backend/api/v1/domains/${domainId}`;
			requestOptions.method = 'GET';
			break;
		}
		case 'updateDomain': {
			const domainIdRaw = this.getNodeParameter('domainId', i, '') as string;
			const domainId = Number(domainIdRaw);
			if (Number.isNaN(domainId) || domainId <= 0) throw new NodeOperationError(this.getNode(), 'A valid domainId must be provided.');
			url = `${baseURL}/backend/api/v1/domains/${domainId}`;
			requestOptions.method = 'PUT';
			const updateDomainFields = this.getNodeParameter('updateDomainFields', i, {}) as Record<string, unknown>;
			if (Object.keys(updateDomainFields).length === 0) throw new NodeOperationError(this.getNode(), 'No fields to update were provided.');
			requestOptions.body = updateDomainFields;
			break;
		}
		case 'deleteDomain': {
			const domainIdRaw = this.getNodeParameter('domainId', i, '') as string;
			const domainId = Number(domainIdRaw);
			if (Number.isNaN(domainId) || domainId <= 0) throw new NodeOperationError(this.getNode(), 'A valid domainId must be provided.');
			url = `${baseURL}/backend/api/v1/domains/${domainId}`;
			requestOptions.method = 'DELETE';
			break;
		}
		case 'listDomainsByCompany': {
			const companyIdRaw = this.getNodeParameter('companyId', i, '') as string;
			const companyId = Number(companyIdRaw);
			if (Number.isNaN(companyId) || companyId <= 0) throw new NodeOperationError(this.getNode(), 'A valid companyId must be provided.');
			url = `${baseURL}/backend/api/v1/domains/company/${companyId}`;
			requestOptions.method = 'GET';
			break;
		}
		case 'dnsLookup': {
			const host = this.getNodeParameter('host', i, '') as string;
			if (!host || host.trim() === '') throw new NodeOperationError(this.getNode(), 'A valid host must be provided.');
			url = `${baseURL}/backend/api/v1/domains/nslookup`;
			requestOptions.method = 'PUT';
			requestOptions.body = { host: host.trim() };
			break;
		}
		default:
			throw new NodeOperationError(this.getNode(), `The operation "${operation}" is not recognized.`);
	}

	requestOptions.url = url;

	try {
		const responseData = await tanssHttpRequest.call(this, i, requestOptions as unknown as import('n8n-workflow').IHttpRequestOptions);
		if (operation === 'deleteDomain') {
			if (responseData === null || responseData === '' || (Array.isArray(responseData) && responseData.length === 0)) {
				return { success: true, message: 'Domain deleted' };
			}
		}
		return responseData;
	} catch (error: unknown) {
		if (operation === 'deleteDomain') {
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
