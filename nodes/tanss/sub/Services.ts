import { IExecuteFunctions, INodeProperties, JsonObject, NodeApiError, NodeOperationError } from 'n8n-workflow';
import { getTanssBaseUrl, isGeneratedTokenMode, tanssHttpRequest } from './request';

const serviceFieldOptions: INodeProperties[] = [
	{ displayName: 'ID', name: 'id', type: 'number' as const, default: 0 },
	{ displayName: 'Text', name: 'text', type: 'string' as const, default: '' },
	{ displayName: 'Symbol', name: 'symbol', type: 'string' as const, default: '' },
	{
		displayName: 'Command',
		name: 'command',
		type: 'string' as const,
		default: '',
		description: 'Command to execute. Use %1% as placeholder for the IP address.',
	},
	{ displayName: 'Active', name: 'active', type: 'boolean' as const, default: true },
	{
		displayName: 'Call Type',
		name: 'callType',
		type: 'options' as const,
		options: [
			{ name: 'Batch', value: 'BATCH' },
			{ name: 'URL', value: 'URL' },
		],
		default: 'BATCH',
	},
];

export const servicesOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options' as const,
		noDataExpression: true,
		displayOptions: { show: { resource: ['services'] } },
		options: [
			{
				name: 'Create Service',
				value: 'createService',
				description: 'Creates a new service',
				action: 'Create a service',
			},
			{
				name: 'Delete Service',
				value: 'deleteService',
				description: 'Deletes a service',
				action: 'Delete a service',
			},
			{
				name: 'Get All Services',
				value: 'getAllServices',
				description: 'Gets a list of all services',
				action: 'Get all services',
			},
			{
				name: 'Get Service',
				value: 'getServiceById',
				description: 'Gets a service by ID',
				action: 'Get a service',
			},
			{
				name: 'Update Service',
				value: 'updateService',
				description: 'Updates an existing service',
				action: 'Update a service',
			},
		],
		default: 'getAllServices',
	},
];

export const servicesFields: INodeProperties[] = [
	{
		displayName: 'Service ID',
		name: 'serviceId',
		type: 'number' as const,
		required: true,
		default: 0,
		description: 'ID of the service',
		displayOptions: {
			show: {
				resource: ['services'],
				operation: ['updateService', 'getServiceById', 'deleteService'],
			},
		},
	},
	{
		displayName: 'Create Service Fields',
		name: 'createServiceFields',
		type: 'collection' as const,
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['services'], operation: ['createService'] } },
		options: serviceFieldOptions,
	},
	{
		displayName: 'Update Service Fields',
		name: 'updateServiceFields',
		type: 'collection' as const,
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['services'], operation: ['updateService'] } },
		options: serviceFieldOptions,
	},
];

export async function handleServices(this: IExecuteFunctions, i: number) {
	const operation = this.getNodeParameter('operation', i) as string;
	const credentials = { baseURL: await getTanssBaseUrl.call(this, i) };
	if (!credentials) throw new NodeOperationError(this.getNode(), 'No credentials returned!');

	const servicesBasePath = isGeneratedTokenMode.call(this, i) ? '/backend/api/deviceManagement/v1/services' : '/backend/api/v1/services';
	const serviceId = this.getNodeParameter('serviceId', i, 0) as number;

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
		case 'createService': {
			url = `${credentials.baseURL}${servicesBasePath}`;
			requestOptions.method = 'POST';
			const createServiceFields = this.getNodeParameter('createServiceFields', i, {}) as Record<string, unknown>;
			if (Object.keys(createServiceFields).length === 0) {
				throw new NodeOperationError(this.getNode(), 'No fields provided for service creation.');
			}
			requestOptions.body = createServiceFields;
			break;
		}
		case 'deleteService': {
			url = `${credentials.baseURL}${servicesBasePath}/${serviceId}`;
			requestOptions.method = 'DELETE';
			break;
		}
		case 'getAllServices': {
			url = `${credentials.baseURL}${servicesBasePath}`;
			requestOptions.method = 'GET';
			break;
		}
		case 'getServiceById': {
			url = `${credentials.baseURL}${servicesBasePath}/${serviceId}`;
			requestOptions.method = 'GET';
			break;
		}
		case 'updateService': {
			url = `${credentials.baseURL}${servicesBasePath}/${serviceId}`;
			requestOptions.method = 'PUT';
			const updateServiceFields = this.getNodeParameter('updateServiceFields', i, {}) as Record<string, unknown>;
			if (Object.keys(updateServiceFields).length === 0) {
				throw new NodeOperationError(this.getNode(), 'No fields provided for service update.');
			}
			requestOptions.body = updateServiceFields;
			break;
		}
		default:
			throw new NodeOperationError(this.getNode(), `The operation "${operation}" is not recognized for Services.`);
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
				return { success: true, statusCode: 204, message: 'Service deleted successfully.' };
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