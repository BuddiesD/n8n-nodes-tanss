import { IExecuteFunctions, INodeProperties, NodeOperationError } from 'n8n-workflow';

export const ipsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options' as const,
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['ips'],
			},
		},
		options: [
			{ name: 'Get IPs', value: 'getIps', description: 'Gets all ip addresses of a device', action: 'Get IPs' },
			{ name: 'Create IP', value: 'createIp', description: 'Creates an ip address for a pc/periphery', action: 'Create IP' },
			{ name: 'Update IP', value: 'updateIp', description: 'Updates a specific ip address', action: 'Update IP' },
			{ name: 'Delete IP', value: 'deleteIp', description: 'Deletes an ip address', action: 'Delete IP' },
		],
		default: 'getIps',
	},
];

export const ipsFields: INodeProperties[] = [
	{
		displayName: 'API Token',
		name: 'apiToken',
		type: 'string' as const,
		required: true,
		typeOptions: { password: true },
		default: '',
		description: 'API token obtained from the TANSS API login',
		displayOptions: { show: { resource: ['ips'] } },
	},
	{
		displayName: 'Assignment Type',
		name: 'assignmentType',
		type: 'options' as const,
		options: [
			{ name: 'PC', value: 'PC' },
			{ name: 'PERIPHERY', value: 'PERIPHERY' },
		],
		default: 'PC',
		displayOptions: { show: { resource: ['ips'], operation: ['getIps', 'createIp'] } },
		description: 'Assignment type (PC / PERIPHERY)',
	},
	{
		displayName: 'Assignment ID',
		name: 'assignmentId',
		type: 'number' as const,
		default: 0,
		displayOptions: { show: { resource: ['ips'], operation: ['getIps', 'createIp'] } },
		description: 'ID of the pc / periphery',
	},
	{
		displayName: 'IP ID',
		name: 'ipId',
		type: 'number' as const,
		default: 0,
		displayOptions: { show: { resource: ['ips'], operation: ['updateIp', 'deleteIp'] } },
		description: 'ID of the ip address',
	},
	{
		displayName: 'Create IP Fields',
		name: 'createIpFields',
		type: 'collection' as const,
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['ips'], operation: ['createIp'] } },
		options: [
			{ displayName: 'IP', name: 'ip', type: 'string' as const, default: '' },
			{ displayName: 'MAC', name: 'mac', type: 'string' as const, default: '' },
			{ displayName: 'Remark', name: 'remark', type: 'string' as const, default: '' },
			{ displayName: 'DHCP', name: 'dhcp', type: 'boolean' as const, default: false },
		],
	},
	{
		displayName: 'Update IP Fields',
		name: 'updateIpFields',
		type: 'collection' as const,
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['ips'], operation: ['updateIp'] } },
		options: [
			{ displayName: 'IP', name: 'ip', type: 'string' as const, default: '' },
			{ displayName: 'MAC', name: 'mac', type: 'string' as const, default: '' },
			{ displayName: 'Remark', name: 'remark', type: 'string' as const, default: '' },
			{ displayName: 'DHCP', name: 'dhcp', type: 'boolean' as const, default: false },
		],
	},
];

export async function handleIps(this: IExecuteFunctions, i: number) {
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
		case 'getIps': {
			const assignmentType = this.getNodeParameter('assignmentType', i) as string;
			const assignmentId = this.getNodeParameter('assignmentId', i, 0) as number;
			url = `${credentials.baseURL}/backend/api/v1/ips/${assignmentType}/${assignmentId}`;
			requestOptions.method = 'GET';
			break;
		}
		case 'createIp': {
			const assignmentType = this.getNodeParameter('assignmentType', i) as string;
			const assignmentId = this.getNodeParameter('assignmentId', i, 0) as number;
			const createIpFields = this.getNodeParameter('createIpFields', i, {}) as Record<string, unknown>;
			if (Object.keys(createIpFields).length === 0) throw new NodeOperationError(this.getNode(), 'No fields provided for creating IP.');
			url = `${credentials.baseURL}/backend/api/v1/ips/${assignmentType}/${assignmentId}`;
			requestOptions.method = 'POST';
			requestOptions.body = createIpFields;
			break;
		}
		case 'updateIp': {
			const ipId = this.getNodeParameter('ipId', i, 0) as number;
			const updateIpFields = this.getNodeParameter('updateIpFields', i, {}) as Record<string, unknown>;
			if (Object.keys(updateIpFields).length === 0) throw new NodeOperationError(this.getNode(), 'No fields provided for updating IP.');
			url = `${credentials.baseURL}/backend/api/v1/ips/${ipId}`;
			requestOptions.method = 'PUT';
			requestOptions.body = updateIpFields;
			break;
		}
		case 'deleteIp': {
			const ipId = this.getNodeParameter('ipId', i, 0) as number;
			url = `${credentials.baseURL}/backend/api/v1/ips/${ipId}`;
			requestOptions.method = 'DELETE';
			break;
		}
		default:
			throw new NodeOperationError(this.getNode(), `The operation "${operation}" is not recognized.`);
	}

	requestOptions.url = url;

	try {
		const responseData = await this.helpers.httpRequest(requestOptions as unknown as import('n8n-workflow').IHttpRequestOptions);
		if (operation === 'deleteIp') {
			if (responseData === '' || responseData == null) {
				return { success: true, statusCode: 204, message: 'ip address was succesfully deleted' };
			}
		}
		return responseData;
	} catch (error: unknown) {
		let message = '';
		if (error instanceof Error) message = error.message;
		const anyErr = error as any;
		if (anyErr && anyErr.response) {
			try {
				const status = anyErr.response.status;
				const respData = anyErr.response.data;
				if (operation === 'deleteIp') {
					const tanssError = respData?.error;
					return {
						success: false,
						statusCode: status,
						message:
							tanssError?.localizedText ??
							tanssError?.text ??
							(status === 403 ? 'error response' : `Delete request failed (status ${status})`),
						error: tanssError ?? respData,
					};
				}
				message += `; Status: ${status}`;
				if (respData) message += `; Response: ${JSON.stringify(respData)}`;
			} catch (e) {}
		}

		if (operation === 'deleteIp') {
			return {
				success: false,
				statusCode: 0,
				message: message || 'Delete request failed.',
				error: null,
			};
		}

		throw new NodeOperationError(this.getNode(), `Failed to execute ${operation}: ${message}`);
	}
}
