import { IExecuteFunctions, INodeProperties, NodeOperationError, NodeApiError, JsonObject } from 'n8n-workflow';
import { getTanssBaseUrl, isGeneratedTokenMode, tanssHttpRequest } from './request';

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
		displayName: 'Manufacturer ID',
		name: 'manufacturerId',
		type: 'number' as const,
		required: true,
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
	const credentials = { baseURL: await getTanssBaseUrl.call(this, i) };
	if (!credentials) throw new NodeOperationError(this.getNode(), 'No credentials returned!');
	const manufacturerId = this.getNodeParameter('manufacturerId', i, 0) as number;
	const manufacturersBasePath = isGeneratedTokenMode.call(this, i)
		? '/backend/api/deviceManagement/v1/manufacturers'
		: '/backend/api/v1/manufacturers';

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
		case 'createManufacturer': {
			url = `${credentials.baseURL}${manufacturersBasePath}`;
			requestOptions.method = 'POST';
			const createManufacturerFields = this.getNodeParameter('createManufacturerFields', i, {}) as Record<string, unknown>;
			if (Object.keys(createManufacturerFields).length === 0)
				throw new NodeOperationError(this.getNode(), 'No fields provided for manufacturer creation.');
			requestOptions.body = createManufacturerFields;
			break;
		}
		case 'deleteManufacturer': {
			url = `${credentials.baseURL}${manufacturersBasePath}/${manufacturerId}`;
			requestOptions.method = 'DELETE';
			break;
		}
		case 'getAllManufacturers': {
			url = `${credentials.baseURL}${manufacturersBasePath}`;
			requestOptions.method = 'GET';
			break;
		}
		case 'getManufacturerById': {
			url = `${credentials.baseURL}${manufacturersBasePath}/${manufacturerId}`;
			requestOptions.method = 'GET';
			break;
		}
		case 'updateManufacturer': {
			url = `${credentials.baseURL}${manufacturersBasePath}/${manufacturerId}`;
			requestOptions.method = 'PUT';
			const updateManufacturerFields = this.getNodeParameter('updateManufacturerFields', i, {}) as Record<string, unknown>;
			if (Object.keys(updateManufacturerFields).length === 0)
				throw new NodeOperationError(this.getNode(), 'No fields provided for manufacturer update.');
			requestOptions.body = updateManufacturerFields;
			break;
		}
		default:
			throw new NodeOperationError(this.getNode(), `The operation "${operation}" is not recognized for Manufacturers.`);
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
				return { success: true, statusCode: 204, message: 'Manufacturer deleted successfully.' };
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
