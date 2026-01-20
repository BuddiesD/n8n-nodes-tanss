import { IExecuteFunctions, INodeProperties, NodeOperationError } from 'n8n-workflow';

export const manufacturersOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options' as const,
		noDataExpression: true,
		displayOptions: { show: { resource: ['manufacturers'] } },
		options: [
			{
				name: 'Create Manufacturer',
				value: 'createManufacturer',
				description: 'Creates a new manufacturer',
				action: 'Create a manufacturer',
			},
			{
				name: 'Delete Manufacturer',
				value: 'deleteManufacturer',
				description: 'Deletes a manufacturer',
				action: 'Delete a manufacturer',
			},
			{
				name: 'Get All Manufacturers',
				value: 'getAllManufacturers',
				description: 'Gets a list of all manufacturers',
				action: 'Get all manufacturers',
			},
			{
				name: 'Get Manufacturer',
				value: 'getManufacturerById',
				description: 'Gets a specific manufacturer',
				action: 'Get a manufacturer',
			},
			{
				name: 'Update Manufacturer',
				value: 'updateManufacturer',
				description: 'Updates an existing manufacturer',
				action: 'Update a manufacturer',
			},
		],
		default: 'getAllManufacturers',
	},
];

export const manufacturersFields: INodeProperties[] = [
	{
		displayName: 'API Token',
		name: 'apiToken',
		type: 'string' as const,
		required: true,
		typeOptions: { password: true },
		default: '',
		description: 'API token obtained from the TANSS API login',
		displayOptions: { show: { resource: ['manufacturers'] } },
	},
	{
		displayName: 'Manufacturer ID',
		name: 'manufacturerId',
		type: 'number' as const,
		default: 0,
		description: 'ID of the manufacturer',
		displayOptions: {
			show: {
				resource: ['manufacturers'],
				operation: ['updateManufacturer', 'getManufacturerById', 'deleteManufacturer'],
			},
		},
	},
	{
		displayName: 'Create Manufacturer Fields',
		name: 'createManufacturerFields',
		type: 'collection' as const,
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['manufacturers'], operation: ['createManufacturer'] } },
		options: [
			{ displayName: 'ID', name: 'id', type: 'number' as const, default: 0 },
			{ displayName: 'Name', name: 'name', type: 'string' as const, default: '' },
		],
	},
	{
		displayName: 'Update Manufacturer Fields',
		name: 'updateManufacturerFields',
		type: 'collection' as const,
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['manufacturers'], operation: ['updateManufacturer'] } },
		options: [
			{ displayName: 'ID', name: 'id', type: 'number' as const, default: 0 },
			{ displayName: 'Name', name: 'name', type: 'string' as const, default: '' },
		],
	},
];

export async function handleManufacturers(this: IExecuteFunctions, i: number) {
	const operation = this.getNodeParameter('operation', i) as string;
	const credentials = await this.getCredentials('tanssApi');
	if (!credentials) throw new NodeOperationError(this.getNode(), 'No credentials returned!');

	const apiToken = this.getNodeParameter('apiToken', i, '') as string;
	const manufacturerId = this.getNodeParameter('manufacturerId', i, 0) as number;

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
		case 'createManufacturer': {
			url = `${credentials.baseURL}/backend/api/v1/manufacturers`;
			requestOptions.method = 'POST';
			const createManufacturerFields = this.getNodeParameter(
				'createManufacturerFields',
				i,
				{},
			) as Record<string, unknown>;
			if (Object.keys(createManufacturerFields).length === 0)
				throw new NodeOperationError(
					this.getNode(),
					'No fields provided for manufacturer creation.',
				);
			requestOptions.body = createManufacturerFields;
			break;
		}
		case 'deleteManufacturer': {
			url = `${credentials.baseURL}/backend/api/v1/manufacturers/${manufacturerId}`;
			requestOptions.method = 'DELETE';
			break;
		}
		case 'getAllManufacturers': {
			url = `${credentials.baseURL}/backend/api/v1/manufacturers`;
			requestOptions.method = 'GET';
			break;
		}
		case 'getManufacturerById': {
			url = `${credentials.baseURL}/backend/api/v1/manufacturers/${manufacturerId}`;
			requestOptions.method = 'GET';
			break;
		}
		case 'updateManufacturer': {
			url = `${credentials.baseURL}/backend/api/v1/manufacturers/${manufacturerId}`;
			requestOptions.method = 'PUT';
			const updateManufacturerFields = this.getNodeParameter(
				'updateManufacturerFields',
				i,
				{},
			) as Record<string, unknown>;
			if (Object.keys(updateManufacturerFields).length === 0)
				throw new NodeOperationError(this.getNode(), 'No fields provided for manufacturer update.');
			requestOptions.body = updateManufacturerFields;
			break;
		}
		default:
			throw new NodeOperationError(
				this.getNode(),
				`The operation "${operation}" is not recognized for Manufacturers.`,
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
