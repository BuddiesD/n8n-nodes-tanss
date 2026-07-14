import { IExecuteFunctions, INodeProperties, NodeOperationError, NodeApiError, JsonObject } from 'n8n-workflow';
import { getTanssBaseUrl, tanssHttpRequest } from './request';

export const availabilityOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options' as const,
		noDataExpression: true,
		displayOptions: { show: { resource: ['availability'] } },
		options: [
			{
				name: 'Get Availability',
				value: 'getAvailability',
				description: 'Fetch availability information for employees',
				action: 'Get availability',
			},
			{
				name: 'Get Availability Types',
				value: 'getAvailabilityTypes',
				description: 'Returns the configured catalog of availability types',
				action: 'Get availability types',
			},
		],
		default: 'getAvailability',
	},
];

export const availabilityFields: INodeProperties[] = [
	{
		displayName: 'Employee IDs (Comma Separated)',
		name: 'employeeIds',
		type: 'string' as const,
		required: true,
		default: '',
		description: 'Comma-separated list of employee IDs to fetch availability for',
		displayOptions: { show: { resource: ['availability'], operation: ['getAvailability'] } },
	},
];

export async function handleAvailability(this: IExecuteFunctions, i: number) {
	const credentials = { baseURL: await getTanssBaseUrl.call(this, i) };
	if (!credentials) throw new NodeOperationError(this.getNode(), 'No credentials returned!');

	const base = credentials.baseURL as string;
	if (!base) throw new NodeOperationError(this.getNode(), 'No baseURL in credentials');

	const operation = this.getNodeParameter('operation', i) as string;

	let url: string;
	const method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET';

	if (operation === 'getAvailability') {
		const employeeIds = this.getNodeParameter('employeeIds', i) as string;
		if (!employeeIds || String(employeeIds).trim() === '') {
			throw new NodeOperationError(this.getNode(), 'employeeIds is required');
		}
		url = `${base}/backend/api/v1/availability?employeeIds=${encodeURIComponent(String(employeeIds).trim())}`;
	} else if (operation === 'getAvailabilityTypes') {
		url = `${base}/backend/api/v1/availability/types`;
	} else {
		throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
	}

	const requestOptions = {
		method,
		headers: { Accept: 'application/json' },
		json: true,
		url,
	} as import('n8n-workflow').IHttpRequestOptions;

	try {
		return await tanssHttpRequest.call(this, i, requestOptions);
	} catch (err: unknown) {
		throw new NodeApiError(this.getNode(), err as JsonObject);
	}
}
