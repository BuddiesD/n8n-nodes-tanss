import { IExecuteFunctions, INodeProperties, NodeOperationError } from 'n8n-workflow';

export const hddTypesOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options' as const,
		noDataExpression: true,
		displayOptions: { show: { resource: ['hddTypes'] } },
		options: [
			{
				name: 'Create HDD Type',
				value: 'createHddType',
				description: 'Creates a new hdd type',
				action: 'Create an HDD type',
			},
			{
				name: 'Delete HDD Type',
				value: 'deleteHddType',
				description: 'Deletes a hdd type',
				action: 'Delete an HDD type',
			},
			{
				name: 'Get All HDD Types',
				value: 'getAllHddTypes',
				description: 'Gets a list of all hdd types',
				action: 'Get all HDD types',
			},
			{
				name: 'Get HDD Type',
				value: 'getHddTypeById',
				description: 'Gets a specific hdd type',
				action: 'Get an HDD type',
			},
			{
				name: 'Update HDD Type',
				value: 'updateHddType',
				description: 'Updates an existing hdd type',
				action: 'Update an HDD type',
			},
		],
		default: 'getAllHddTypes',
	},
];

export const hddTypesFields: INodeProperties[] = [
	{
		displayName: 'API Token',
		name: 'apiToken',
		type: 'string' as const,
		required: true,
		typeOptions: { password: true },
		default: '',
		description: 'API token obtained from the TANSS API login',
		displayOptions: { show: { resource: ['hddTypes'] } },
	},
	{
		displayName: 'HDD Type ID',
		name: 'hddTypeId',
		type: 'number' as const,
		default: 0,
		description: 'ID of the HDD type',
		displayOptions: {
			show: {
				resource: ['hddTypes'],
				operation: ['updateHddType', 'getHddTypeById', 'deleteHddType'],
			},
		},
	},
	{
		displayName: 'Create HDD Type Fields',
		name: 'createHddTypeFields',
		type: 'collection' as const,
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['hddTypes'], operation: ['createHddType'] } },
		options: [
			{ displayName: 'ID', name: 'id', type: 'number' as const, default: 0 },
			{ displayName: 'Name', name: 'name', type: 'string' as const, default: '' },
		],
	},
	{
		displayName: 'Update HDD Type Fields',
		name: 'updateHddTypeFields',
		type: 'collection' as const,
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['hddTypes'], operation: ['updateHddType'] } },
		options: [
			{ displayName: 'ID', name: 'id', type: 'number' as const, default: 0 },
			{ displayName: 'Name', name: 'name', type: 'string' as const, default: '' },
		],
	},
];

export async function handleHddTypes(this: IExecuteFunctions, i: number) {
	const operation = this.getNodeParameter('operation', i) as string;
	const credentials = await this.getCredentials('tanssApi');
	if (!credentials) throw new NodeOperationError(this.getNode(), 'No credentials returned!');

	const apiToken = this.getNodeParameter('apiToken', i, '') as string;
	const hddTypeId = this.getNodeParameter('hddTypeId', i, 0) as number;

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
		case 'createHddType': {
			url = `${credentials.baseURL}/backend/api/v1/hddTypes`;
			requestOptions.method = 'POST';
			const createHddTypeFields = this.getNodeParameter('createHddTypeFields', i, {}) as Record<
				string,
				unknown
			>;
			if (Object.keys(createHddTypeFields).length === 0)
				throw new NodeOperationError(this.getNode(), 'No fields provided for HDD type creation.');
			requestOptions.body = createHddTypeFields;
			break;
		}
		case 'deleteHddType': {
			url = `${credentials.baseURL}/backend/api/v1/hddTypes/${hddTypeId}`;
			requestOptions.method = 'DELETE';
			break;
		}
		case 'getAllHddTypes': {
			url = `${credentials.baseURL}/backend/api/v1/hddTypes`;
			requestOptions.method = 'GET';
			break;
		}
		case 'getHddTypeById': {
			url = `${credentials.baseURL}/backend/api/v1/hddTypes/${hddTypeId}`;
			requestOptions.method = 'GET';
			break;
		}
		case 'updateHddType': {
			url = `${credentials.baseURL}/backend/api/v1/hddTypes/${hddTypeId}`;
			requestOptions.method = 'PUT';
			const updateHddTypeFields = this.getNodeParameter('updateHddTypeFields', i, {}) as Record<
				string,
				unknown
			>;
			if (Object.keys(updateHddTypeFields).length === 0)
				throw new NodeOperationError(this.getNode(), 'No fields provided for HDD type update.');
			requestOptions.body = updateHddTypeFields;
			break;
		}
		default:
			throw new NodeOperationError(
				this.getNode(),
				`The operation "${operation}" is not recognized for HDD Types.`,
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
