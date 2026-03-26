import { IExecuteFunctions, INodeProperties, NodeOperationError, NodeApiError, JsonObject } from 'n8n-workflow';
import { getTanssBaseUrl, tanssHttpRequest } from './request';

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
		displayName: 'OS ID',
		name: 'osId',
		type: 'number' as const,
		required: true,
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
	const credentials = ({ baseURL: await getTanssBaseUrl.call(this, i) });
	if (!credentials) throw new NodeOperationError(this.getNode(), 'No credentials returned!');
	const osId = this.getNodeParameter('osId', i, 0) as number;

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
		case 'createOs': {
			url = `${credentials.baseURL}/backend/api/v1/os`;
			requestOptions.method = 'POST';
			const createOsFields = this.getNodeParameter('createOsFields', i, {}) as Record<string, unknown>;
			if (Object.keys(createOsFields).length === 0) throw new NodeOperationError(this.getNode(), 'No fields provided for OS creation.');
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
			const updateOsFields = this.getNodeParameter('updateOsFields', i, {}) as Record<string, unknown>;
			if (Object.keys(updateOsFields).length === 0) throw new NodeOperationError(this.getNode(), 'No fields provided for OS update.');
			requestOptions.body = updateOsFields;
			break;
		}
		default:
			throw new NodeOperationError(this.getNode(), `The operation "${operation}" is not recognized for Operating Systems.`);
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
				return { success: true, statusCode: 204, message: 'Operating system deleted successfully.' };
			}
			const tanssBody = (fullResponse.body ?? null) as { error?: { localizedText?: string; text?: string; type?: string } } | null;
			const tanssError = tanssBody?.error;
			return {
				success: false,
				statusCode: fullResponse.statusCode,
				message: tanssError?.localizedText ?? tanssError?.text ?? `Delete request failed (status ${fullResponse.statusCode})`,
				error: tanssError ?? tanssBody,
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

			const tanssError = (parsedBody as { error?: { localizedText?: string; text?: string; type?: string } } | null)?.error;

			return {
				success: false,
				statusCode,
				message:
					tanssError?.localizedText ?? tanssError?.text ?? (error instanceof Error ? error.message : `Delete request failed (status ${statusCode})`),
				error: tanssError ?? parsedBody,
			};
		}
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}
