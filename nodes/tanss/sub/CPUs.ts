import { IExecuteFunctions, INodeProperties, NodeOperationError } from 'n8n-workflow';

export const cpuOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options' as const,
		noDataExpression: true,
		displayOptions: { show: { resource: ['cpus'] } },
		options: [
			{
				name: 'Create CPU',
				value: 'createCpu',
				description: 'Creates a new CPU',
				action: 'Create a CPU',
			},
			{
				name: 'Delete CPU',
				value: 'deleteCpu',
				description: 'Deletes a CPU',
				action: 'Delete a CPU',
			},
			{
				name: 'Get All CPUs',
				value: 'getAllCpus',
				description: 'Gets a list of all CPUs',
				action: 'Get all CPUs',
			},
			{
				name: 'Get CPU',
				value: 'getCpuById',
				description: 'Gets a specific CPU',
				action: 'Get a CPU',
			},
			{
				name: 'Update CPU',
				value: 'updateCpu',
				description: 'Updates an existing CPU',
				action: 'Update a CPU',
			},
		],
		default: 'getAllCpus',
	},
];

export const cpuFields: INodeProperties[] = [
	{
		displayName: 'API Token',
		name: 'apiToken',
		type: 'string' as const,
		required: true,
		typeOptions: { password: true },
		default: '',
		description: 'API token obtained from the TANSS API login',
		displayOptions: { show: { resource: ['cpus'] } },
	},
	{
		displayName: 'CPU ID',
		name: 'cpuId',
		type: 'number' as const,
		default: 0,
		description: 'ID of the CPU',
		displayOptions: {
			show: { resource: ['cpus'], operation: ['updateCpu', 'getCpuById', 'deleteCpu'] },
		},
	},
	{
		displayName: 'Create CPU Fields',
		name: 'createCpuFields',
		type: 'collection' as const,
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['cpus'], operation: ['createCpu'] } },
		options: [
			{ displayName: 'ID', name: 'id', type: 'number' as const, default: 0 },
			{ displayName: 'Name', name: 'name', type: 'string' as const, default: '' },
		],
	},
	{
		displayName: 'Update CPU Fields',
		name: 'updateCpuFields',
		type: 'collection' as const,
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['cpus'], operation: ['updateCpu'] } },
		options: [
			{ displayName: 'ID', name: 'id', type: 'number' as const, default: 0 },
			{ displayName: 'Name', name: 'name', type: 'string' as const, default: '' },
		],
	},
];

export async function handleCpu(this: IExecuteFunctions, i: number) {
	const operation = this.getNodeParameter('operation', i) as string;
	const credentials = await this.getCredentials('tanssApi');
	if (!credentials) throw new NodeOperationError(this.getNode(), 'No credentials returned!');

	const apiToken = this.getNodeParameter('apiToken', i, '') as string;
	const cpuId = this.getNodeParameter('cpuId', i, 0) as number;

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
		case 'createCpu': {
			url = `${credentials.baseURL}/backend/api/v1/cpus`;
			requestOptions.method = 'POST';
			const createCpuFields = this.getNodeParameter('createCpuFields', i, {}) as Record<
				string,
				unknown
			>;
			if (Object.keys(createCpuFields).length === 0)
				throw new NodeOperationError(this.getNode(), 'No fields provided for CPU creation.');
			requestOptions.body = createCpuFields;
			break;
		}
		case 'deleteCpu': {
			url = `${credentials.baseURL}/backend/api/v1/cpus/${cpuId}`;
			requestOptions.method = 'DELETE';
			break;
		}
		case 'getAllCpus': {
			url = `${credentials.baseURL}/backend/api/v1/cpus`;
			requestOptions.method = 'GET';
			break;
		}
		case 'getCpuById': {
			url = `${credentials.baseURL}/backend/api/v1/cpus/${cpuId}`;
			requestOptions.method = 'GET';
			break;
		}
		case 'updateCpu': {
			url = `${credentials.baseURL}/backend/api/v1/cpus/${cpuId}`;
			requestOptions.method = 'PUT';
			const updateCpuFields = this.getNodeParameter('updateCpuFields', i, {}) as Record<
				string,
				unknown
			>;
			if (Object.keys(updateCpuFields).length === 0)
				throw new NodeOperationError(this.getNode(), 'No fields provided for CPU update.');
			requestOptions.body = updateCpuFields;
			break;
		}
		default:
			throw new NodeOperationError(
				this.getNode(),
				`The operation "${operation}" is not recognized for CPUs.`,
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
