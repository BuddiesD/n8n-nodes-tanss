import { IExecuteFunctions, INodeProperties, NodeOperationError } from 'n8n-workflow';

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
		],
		default: 'createDomain',
	},
];

export const domainFields: INodeProperties[] = [
	{
		displayName: 'API Token',
		name: 'apiToken',
		type: 'string' as const,
		required: true,
		typeOptions: { password: true },
		default: '',
		description: 'API token obtained from the TANSS API login',
		displayOptions: {
			show: {
				resource: ['domain'],
			},
		},
	},

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
		options: [
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
		],
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
		options: [
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
		],
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
];

export async function handleDomains(this: IExecuteFunctions, i: number) {
	const operation = this.getNodeParameter('operation', i) as string;
	const credentials = await this.getCredentials('tanssApi');

	if (!credentials) throw new NodeOperationError(this.getNode(), 'No credentials returned!');

	const apiToken = this.getNodeParameter('apiToken', i, '') as string;

	let url = '';
	const requestOptions: {
		method: 'GET' | 'POST' | 'PUT' | 'DELETE';
		headers: { apiToken: string; 'Content-Type': string };
		json: boolean;
		body?: Record<string, unknown>;
		url: string;
	} = {
		method: 'GET',
		headers: { apiToken, 'Content-Type': 'application/json' },
		json: true,
		url,
	};

	switch (operation) {
		case 'createDomain': {
			url = `${(credentials as any).baseURL}/backend/api/v1/domains`;
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
			url = `${(credentials as any).baseURL}/backend/api/v1/domains/${domainId}`;
			requestOptions.method = 'GET';
			break;
		}
		case 'updateDomain': {
			const domainIdRaw = this.getNodeParameter('domainId', i, '') as string;
			const domainId = Number(domainIdRaw);
			if (Number.isNaN(domainId) || domainId <= 0) throw new NodeOperationError(this.getNode(), 'A valid domainId must be provided.');
			url = `${(credentials as any).baseURL}/backend/api/v1/domains/${domainId}`;
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
			url = `${(credentials as any).baseURL}/backend/api/v1/domains/${domainId}`;
			requestOptions.method = 'DELETE';
			break;
		}
		case 'listDomainsByCompany': {
			const companyIdRaw = this.getNodeParameter('companyId', i, '') as string;
			const companyId = Number(companyIdRaw);
			if (Number.isNaN(companyId) || companyId <= 0) throw new NodeOperationError(this.getNode(), 'A valid companyId must be provided.');
			url = `${(credentials as any).baseURL}/backend/api/v1/domains/company/${companyId}`;
			requestOptions.method = 'GET';
			break;
		}
		default:
			throw new NodeOperationError(this.getNode(), `The operation "${operation}" is not recognized.`);
	}

	requestOptions.url = url;

	try {
		const responseData = await this.helpers.httpRequest(requestOptions as unknown as import('n8n-workflow').IHttpRequestOptions);
		if (operation === 'deleteDomain') {
			if (responseData === null || responseData === '' || (Array.isArray(responseData) && responseData.length === 0)) {
				return { success: true, message: 'Domain deleted' };
			}
		}
		return responseData;
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		throw new NodeOperationError(this.getNode(), `Failed to execute ${operation}: ${errorMessage}`);
	}
}
