import { IExecuteFunctions, INodeProperties, NodeOperationError } from 'n8n-workflow';

export const operatingSystemsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options' as const,
		noDataExpression: true,
		displayOptions: { show: { resource: ['operatingSystems'] } },
		options: [
			{
				name: 'Create OS',
				value: 'createOs',
				description: 'Creates a new operating system',
				action: 'Create an OS',
			},
			{
				name: 'Delete OS',
				value: 'deleteOs',
				description: 'Deletes a specific operating system',
				action: 'Delete an OS',
			},
			{
				name: 'Get All OS',
				value: 'getAllOs',
				description: 'Gets a list of all operating systems',
				action: 'Get all OS',
			},
			{
				name: 'Get OS',
				value: 'getOsById',
				description: 'Gets a specific operating system',
				action: 'Get an OS',
			},
			{
				name: 'Update OS',
				value: 'updateOs',
				description: 'Updates an existing operating system',
				action: 'Update an OS',
			},
		],
		default: 'getAllOs',
	},
];

export const operatingSystemsFields: INodeProperties[] = [
	{
		displayName: 'API Token',
		name: 'apiToken',
		type: 'string' as const,
		required: true,
		typeOptions: { password: true },
		default: '',
		description: 'API token obtained from the TANSS API login',
		displayOptions: { show: { resource: ['operatingSystems'] } },
	},
	{
		displayName: 'OS ID',
		name: 'osId',
		type: 'number' as const,
		default: 0,
		description: 'ID of the operating system',
		displayOptions: {
			show: { resource: ['operatingSystems'], operation: ['updateOs', 'getOsById', 'deleteOs'] },
		},
	},
	{
		displayName: 'Create OS Fields',
		name: 'createOsFields',
		type: 'collection' as const,
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['operatingSystems'], operation: ['createOs'] } },
		options: [
			{ displayName: 'ID', name: 'id', type: 'number' as const, default: 0 },
			{ displayName: 'Name', name: 'name', type: 'string' as const, default: '' },
			{
				displayName: 'Server Operating System',
				name: 'serverOperatingSystem',
				type: 'boolean' as const,
				default: false,
			},
			{ displayName: 'Active', name: 'active', type: 'boolean' as const, default: true },
			{
				displayName: 'Article Number',
				name: 'articleNumber',
				type: 'string' as const,
				default: '',
			},
		],
	},
	{
		displayName: 'Update OS Fields',
		name: 'updateOsFields',
		type: 'collection' as const,
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['operatingSystems'], operation: ['updateOs'] } },
		options: [
			{ displayName: 'ID', name: 'id', type: 'number' as const, default: 0 },
			{ displayName: 'Name', name: 'name', type: 'string' as const, default: '' },
			{
				displayName: 'Server Operating System',
				name: 'serverOperatingSystem',
				type: 'boolean' as const,
				default: false,
			},
			{ displayName: 'Active', name: 'active', type: 'boolean' as const, default: true },
			{
				displayName: 'Article Number',
				name: 'articleNumber',
				type: 'string' as const,
				default: '',
			},
		],
	},
];

export async function handleOperatingSystems(this: IExecuteFunctions, i: number) {
	const operation = this.getNodeParameter('operation', i) as string;
	const credentials = await this.getCredentials('tanssApi');
	if (!credentials) throw new NodeOperationError(this.getNode(), 'No credentials returned!');

	const apiToken = this.getNodeParameter('apiToken', i, '') as string;
	const osId = this.getNodeParameter('osId', i, 0) as number;

	let url = '';
	const requestOptions: {
		method: 'GET' | 'POST' | 'PUT' | 'DELETE';
		headers: { apiToken: string; 'Content-Type': string };
		json: boolean;
		body?: Record<string, unknown>;
		url: string;
		returnFullResponse?: boolean;
	} = {
		method: 'GET',
		headers: { apiToken, 'Content-Type': 'application/json' },
		json: true,
		url,
	};

	switch (operation) {
		case 'createOs': {
			url = `${credentials.baseURL}/backend/api/v1/os`;
			requestOptions.method = 'POST';
			const createOsFields = this.getNodeParameter('createOsFields', i, {}) as Record<
				string,
				unknown
			>;
			if (Object.keys(createOsFields).length === 0)
				throw new NodeOperationError(this.getNode(), 'No fields provided for OS creation.');
			requestOptions.body = createOsFields;
			break;
		}
		case 'deleteOs': {
			url = `${credentials.baseURL}/backend/api/v1/os/${osId}`;
			requestOptions.method = 'DELETE';
			break;
		}
		case 'getAllOs': {
			url = `${credentials.baseURL}/backend/api/v1/os`;
			requestOptions.method = 'GET';
			break;
		}
		case 'getOsById': {
			url = `${credentials.baseURL}/backend/api/v1/os/${osId}`;
			requestOptions.method = 'GET';
			break;
		}
		case 'updateOs': {
			url = `${credentials.baseURL}/backend/api/v1/os/${osId}`;
			requestOptions.method = 'PUT';
			const updateOsFields = this.getNodeParameter('updateOsFields', i, {}) as Record<
				string,
				unknown
			>;
			if (Object.keys(updateOsFields).length === 0)
				throw new NodeOperationError(this.getNode(), 'No fields provided for OS update.');
			requestOptions.body = updateOsFields;
			break;
		}
		default:
			throw new NodeOperationError(
				this.getNode(),
				`The operation "${operation}" is not recognized for Operating Systems.`,
			);
	}

	requestOptions.url = url;

	try {
		type FullResponse = { statusCode: number; body?: unknown };
		const options = {
			...requestOptions,
			returnFullResponse: true,
		} as unknown as import('n8n-workflow').IHttpRequestOptions;
		const fullResponse = (await this.helpers.httpRequest(options)) as unknown as FullResponse;
		if (requestOptions.method === 'DELETE') {
			return { success: fullResponse.statusCode === 204, statusCode: fullResponse.statusCode };
		}
		return fullResponse.body ?? (fullResponse as unknown);
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		throw new NodeOperationError(this.getNode(), `Failed to execute ${operation}: ${errorMessage}`);
	}
}
