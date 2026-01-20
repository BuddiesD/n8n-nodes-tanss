import { IExecuteFunctions, INodeProperties, NodeOperationError } from 'n8n-workflow';

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
		],
		default: 'getAvailability',
	},
];

export const availabilityFields: INodeProperties[] = [
	{
		displayName: 'API Token',
		name: 'apiToken',
		type: 'string' as const,
		typeOptions: { password: true },
		default: '',
		description: 'API token obtained from the TANSS API login',
		displayOptions: { show: { resource: ['availability'] } },
	},
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
	const credentials = await this.getCredentials('tanssApi');
	if (!credentials) throw new NodeOperationError(this.getNode(), 'No credentials returned!');

	const apiToken = this.getNodeParameter('apiToken', i, '') as string;
	const employeeIds = this.getNodeParameter('employeeIds', i) as string;

	if (!employeeIds || String(employeeIds).trim() === '') {
		throw new NodeOperationError(this.getNode(), 'employeeIds is required');
	}

	const base = credentials.baseURL as string;
	if (!base) throw new NodeOperationError(this.getNode(), 'No baseURL in credentials');

	const url = `${base}/backend/api/v1/availability`;

	const requestOptions: {
		method: 'GET' | 'POST' | 'PUT' | 'DELETE';
		headers: { [key: string]: string };
		json: boolean;
		url: string;
	} = {
		method: 'GET',
		headers: { Accept: 'application/json' },
		json: true,
		url,
	};

	if (apiToken && String(apiToken).trim() !== '') {
		const tokenValue = String(apiToken).startsWith('Bearer ')
			? String(apiToken)
			: `Bearer ${String(apiToken)}`;
		requestOptions.headers.Authorization = tokenValue;
		requestOptions.headers.apiToken = tokenValue;
	}

	const encoded = encodeURIComponent(String(employeeIds).trim());
	requestOptions.url = `${url}?employeeIds=${encoded}`;

	try {
		const response = await this.helpers.httpRequest(
			requestOptions as unknown as import('n8n-workflow').IHttpRequestOptions,
		);
		return response;
	} catch (err: unknown) {
		const message = err instanceof Error ? err.message : String(err);
		throw new NodeOperationError(this.getNode(), `Failed to fetch availability: ${message}`);
	}
}
