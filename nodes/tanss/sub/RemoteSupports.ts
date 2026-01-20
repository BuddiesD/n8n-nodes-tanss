import { IExecuteFunctions, INodeProperties, NodeOperationError, IDataObject } from 'n8n-workflow';

export const remoteSupportsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options' as const,
		noDataExpression: true,
		displayOptions: {
			show: { resource: ['remoteSupports'] },
		},
		options: [
			{
				name: 'Create / Import Remote Support',
				value: 'createRemoteSupport',
				description: 'Creates/imports a remote support into the TANSS database',
				action: 'Create remote support',
			},
			{
				name: 'Get List of Remote Supports',
				value: 'getRemoteSupports',
				description: 'Gets a list of remote supports based on filter settings',
				action: 'Get remote supports',
			},
			{
				name: 'Get Remote Support by ID',
				value: 'getRemoteSupportById',
				description: 'Gets a remote support from the database by its ID',
				action: 'Get remote support by id',
			},
			{
				name: 'Update Remote Support',
				value: 'updateRemoteSupport',
				description: 'Updates a remote support by ID and sets the new values',
				action: 'Update remote support',
			},
			{
				name: 'Delete Remote Support',
				value: 'deleteRemoteSupport',
				description: 'Deletes a remote support by ID',
				action: 'Delete remote support',
			},
			{
				name: 'Get Device Assignments',
				value: 'getDeviceAssignments',
				description: 'Gets all device assignments for the remote support type',
				action: 'Get device assignments',
			},
			{
				name: 'Create Device Assignment',
				value: 'createAssignDevice',
				description: 'Creates a device assignment mapping deviceId -> company/link',
				action: 'Create device assignment',
			},
			{
				name: 'Delete Device Assignment',
				value: 'deleteAssignDevice',
				description: 'Deletes a device assignment by deviceId',
				action: 'Delete device assignment',
			},
			{
				name: 'Get Technician Assignments',
				value: 'getEmployeeAssignments',
				description: 'Gets all employee (technician) assignments for the remote support type',
				action: 'Get technician assignments',
			},
			{
				name: 'Create Technician Assignment',
				value: 'createAssignEmployee',
				description: 'Creates an assignment mapping userId -> employeeId',
				action: 'Create technician assignment',
			},
			{
				name: 'Delete Technician Assignment',
				value: 'deleteAssignEmployee',
				description: 'Deletes a technician assignment by userId',
				action: 'Delete technician assignment',
			},
		],
		default: 'createRemoteSupport',
	},
];

export const remoteSupportsFields: INodeProperties[] = [
	{
		displayName: 'API Token',
		name: 'apiToken',
		type: 'string' as const,
		required: true,
		typeOptions: { password: true },
		default: '',
		description: 'API token obtained from the TANSS web interface (must be generated in TANSS)',
		displayOptions: { show: { resource: ['remoteSupports'] } },
	},
	{
		displayName: 'Assign Device Object',
		name: 'assignDeviceObject',
		type: 'collection' as const,
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: ['remoteSupports'],
				operation: ['createAssignDevice', 'deleteAssignDevice'],
			},
		},
		default: {},
		options: [
			{ displayName: 'deviceId', name: 'deviceId', type: 'string' as const, default: '' },
			{ displayName: 'companyId', name: 'companyId', type: 'number' as const, default: 0 },
			{ displayName: 'linkTypeId', name: 'linkTypeId', type: 'number' as const, default: 0 },
			{ displayName: 'linkId', name: 'linkId', type: 'number' as const, default: 0 },
		],
	},

	{
		displayName: 'Assign Employee Object',
		name: 'assignEmployeeObject',
		type: 'collection' as const,
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: ['remoteSupports'],
				operation: ['createAssignEmployee', 'deleteAssignEmployee'],
			},
		},
		default: {},
		options: [
			{ displayName: 'userId', name: 'userId', type: 'string' as const, default: '' },
			{ displayName: 'employeeId', name: 'employeeId', type: 'number' as const, default: 0 },
		],
	},

	{
		displayName: 'Filter Settings',
		name: 'getRemoteSupportsFilters',
		type: 'collection' as const,
		placeholder: 'Add Filter',
		displayOptions: { show: { resource: ['remoteSupports'], operation: ['getRemoteSupports'] } },
		default: {},
		options: [
			{
				displayName: 'Timeframe From (Timestamp)',
				name: 'timeFrom',
				type: 'number' as const,
				default: 0,
			},
			{
				displayName: 'Timeframe To (Timestamp)',
				name: 'timeTo',
				type: 'number' as const,
				default: 0,
			},
			{ displayName: 'Employee ID', name: 'employeeId', type: 'number' as const, default: 0 },
			{ displayName: 'Company ID', name: 'companyId', type: 'number' as const, default: 0 },
			{ displayName: 'Type ID', name: 'typeId', type: 'number' as const, default: 0 },
			{ displayName: 'Text', name: 'text', type: 'string' as const, default: '' },
		],
	},

	{
		displayName: 'Remote Object',
		name: 'remoteObject',
		type: 'collection' as const,
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: ['remoteSupports'],
				operation: ['createRemoteSupport', 'updateRemoteSupport'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'remoteMaintenanceId',
				name: 'remoteMaintenanceId',
				type: 'string' as const,
				default: '',
			},
			{ displayName: 'userId', name: 'userId', type: 'string' as const, default: '' },
			{ displayName: 'userName', name: 'userName', type: 'string' as const, default: '' },
			{ displayName: 'employeeId', name: 'employeeId', type: 'number' as const, default: 0 },
			{ displayName: 'deviceId', name: 'deviceId', type: 'string' as const, default: '' },
			{ displayName: 'deviceName', name: 'deviceName', type: 'string' as const, default: '' },
			{ displayName: 'companyId', name: 'companyId', type: 'number' as const, default: 0 },
			{ displayName: 'linkTypeId', name: 'linkTypeId', type: 'number' as const, default: 0 },
			{ displayName: 'linkId', name: 'linkId', type: 'number' as const, default: 0 },
			{
				displayName: 'startTime (Timestamp)',
				name: 'startTime',
				type: 'number' as const,
				default: 0,
			},
			{ displayName: 'endTime (Timestamp)', name: 'endTime', type: 'number' as const, default: 0 },
			{ displayName: 'Comment', name: 'comment', type: 'string' as const, default: '' },
		],
	},
	{
		displayName: 'Remote Support ID',
		name: 'remoteSupportId',
		type: 'number' as const,
		default: 0,
		description: 'ID of the remote support to fetch / update / delete',
		displayOptions: {
			show: {
				resource: ['remoteSupports'],
				operation: ['getRemoteSupportById', 'updateRemoteSupport', 'deleteRemoteSupport'],
			},
		},
	},
];

export async function handleRemoteSupports(this: IExecuteFunctions, i: number) {
	const operation = this.getNodeParameter('operation', i) as string;
	const credentials = await this.getCredentials('tanssApi');
	if (!credentials) throw new NodeOperationError(this.getNode(), 'No credentials returned!');

	const apiToken = this.getNodeParameter('apiToken', i, '') as string;
	const base = credentials.baseURL as string;
	if (!base) throw new NodeOperationError(this.getNode(), 'No baseURL in credentials');

	let url = '';
	const requestOptions: {
		method: 'GET' | 'PUT' | 'POST' | 'DELETE';
		headers: { [key: string]: string };
		json: boolean;
		body?: IDataObject;
		url: string;
	} = {
		method: 'POST',
		headers: { Accept: 'application/json' },
		json: true,
		url,
	};

	if (apiToken && apiToken.toString().trim() !== '') {
		const tokenValue = String(apiToken).startsWith('Bearer ')
			? String(apiToken)
			: `Bearer ${String(apiToken)}`;
		requestOptions.headers.Authorization = tokenValue;
		requestOptions.headers.apiToken = tokenValue;
	}

	switch (operation) {
		case 'createRemoteSupport': {
			const body: IDataObject = {};
			const fields = this.getNodeParameter('remoteObject', i, {}) as IDataObject;

			if (fields.remoteMaintenanceId && String(fields.remoteMaintenanceId).trim() !== '')
				body.remoteMaintenanceId = String(fields.remoteMaintenanceId).trim();

			if (fields.userId && String(fields.userId).trim() !== '')
				body.userId = String(fields.userId).trim();

			if (fields.userName && String(fields.userName).trim() !== '')
				body.userName = String(fields.userName).trim();

			const employeeId = Number(fields.employeeId) || 0;
			if (employeeId > 0) body.employeeId = employeeId;

			if (fields.deviceId && String(fields.deviceId).trim() !== '')
				body.deviceId = String(fields.deviceId).trim();

			if (fields.deviceName && String(fields.deviceName).trim() !== '')
				body.deviceName = String(fields.deviceName).trim();

			const companyId = Number(fields.companyId) || 0;
			if (companyId > 0) body.companyId = companyId;

			const linkTypeId = Number(fields.linkTypeId) || 0;
			if (linkTypeId > 0) body.linkTypeId = linkTypeId;

			const linkId = Number(fields.linkId) || 0;
			if (linkId > 0) body.linkId = linkId;

			const startTime = Number(fields.startTime) || 0;
			if (startTime > 0) body.startTime = startTime;

			const endTime = Number(fields.endTime) || 0;
			if (endTime > 0) body.endTime = endTime;

			if (fields.comment && String(fields.comment).trim() !== '')
				body.comment = String(fields.comment).trim();

			url = `${credentials.baseURL}/backend/api/remoteSupports/v1`;
			requestOptions.method = 'POST';
			requestOptions.url = url;
			requestOptions.headers['Content-Type'] = 'application/json';
			requestOptions.body = body;
			break;
		}

		case 'getRemoteSupports': {
			const filters = this.getNodeParameter('getRemoteSupportsFilters', i, {}) as IDataObject;
			const timeframeFrom = Number(filters.timeFrom) || 0;
			const timeframeTo = Number(filters.timeTo) || 0;
			const body: IDataObject = {};
			if (timeframeFrom > 0 || timeframeTo > 0) {
				const timeframeObj: IDataObject = {};
				if (timeframeFrom > 0) timeframeObj.from = timeframeFrom;
				if (timeframeTo > 0) timeframeObj.to = timeframeTo;
				body.timeframe = timeframeObj;
			}

			const employeeId = Number(filters.employeeId) || 0;
			if (employeeId > 0) body.employeeId = employeeId;

			const companyId = Number(filters.companyId) || 0;
			if (companyId > 0) body.companyId = companyId;

			const typeId = Number(filters.typeId) || 0;
			if (typeId > 0) body.typeId = typeId;

			if (filters.text && String(filters.text).trim() !== '')
				body.text = String(filters.text).trim();

			url = `${credentials.baseURL}/backend/api/remoteSupports/v1`;
			requestOptions.method = 'PUT';
			requestOptions.url = url;
			requestOptions.headers['Content-Type'] = 'application/json';
			requestOptions.body = body;
			break;
		}

		case 'getDeviceAssignments': {
			url = `${credentials.baseURL}/backend/api/remoteSupports/v1/assignDevice`;
			requestOptions.method = 'GET';
			requestOptions.url = url;
			delete requestOptions.headers['Content-Type'];
			break;
		}

		case 'createAssignDevice': {
			const assignJson = this.getNodeParameter('assignDeviceJson', i, '') as string;
			let body: IDataObject = {};
			if (assignJson && assignJson.trim() !== '') {
				try {
					const parsed = JSON.parse(assignJson);
					if (typeof parsed !== 'object' || parsed === null)
						throw new Error('assignDeviceJson must be a JSON object.');
					body = parsed as IDataObject;
				} catch (err) {
					const msg = err instanceof Error ? err.message : String(err);
					throw new NodeOperationError(
						this.getNode(),
						`assignDeviceJson must be valid JSON: ${msg}`,
					);
				}
			} else {
				const fields = this.getNodeParameter('assignDeviceObject', i, {}) as IDataObject;
				if (fields.deviceId && String(fields.deviceId).trim() !== '')
					body.deviceId = String(fields.deviceId).trim();
				const companyId = Number(fields.companyId) || 0;
				if (companyId > 0) body.companyId = companyId;
				const linkTypeId = Number(fields.linkTypeId) || 0;
				if (linkTypeId > 0) body.linkTypeId = linkTypeId;
				const linkId = Number(fields.linkId) || 0;
				if (linkId > 0) body.linkId = linkId;
			}

			url = `${credentials.baseURL}/backend/api/remoteSupports/v1/assignDevice`;
			requestOptions.method = 'POST';
			requestOptions.url = url;
			requestOptions.headers['Content-Type'] = 'application/json';
			requestOptions.body = body;
			break;
		}

		case 'deleteAssignDevice': {
			const assignJson = this.getNodeParameter('assignDeviceJson', i, '') as string;
			let body: IDataObject = {};
			if (assignJson && assignJson.trim() !== '') {
				try {
					const parsed = JSON.parse(assignJson);
					if (typeof parsed !== 'object' || parsed === null)
						throw new Error('assignDeviceJson must be a JSON object.');
					body = parsed as IDataObject;
				} catch (err) {
					const msg = err instanceof Error ? err.message : String(err);
					throw new NodeOperationError(
						this.getNode(),
						`assignDeviceJson must be valid JSON: ${msg}`,
					);
				}
			} else {
				const fields = this.getNodeParameter('assignDeviceObject', i, {}) as IDataObject;
				if (fields.deviceId && String(fields.deviceId).trim() !== '')
					body.deviceId = String(fields.deviceId).trim();
			}

			url = `${credentials.baseURL}/backend/api/remoteSupports/v1/assignDevice`;
			requestOptions.method = 'DELETE';
			requestOptions.url = url;
			requestOptions.headers['Content-Type'] = 'application/json';
			requestOptions.body = body;

			try {
				const fullResponse = await this.helpers.httpRequest({
					...(requestOptions as unknown as IDataObject),
					simple: false,
					resolveWithFullResponse: true,
				} as unknown as import('n8n-workflow').IHttpRequestOptions);
				if (fullResponse && fullResponse.statusCode === 204) {
					return {
						success: true,
						statusCode: 204,
						message: 'Device assignment deleted',
					} as unknown as IDataObject;
				}
				return fullResponse && fullResponse.body ? fullResponse.body : fullResponse;
			} catch (err: unknown) {
				const e = err as unknown as { statusCode?: number; response?: { statusCode?: number } };
				const status = e?.statusCode ?? e?.response?.statusCode;
				if (status === 403) {
					return {
						success: false,
						statusCode: 403,
						message: 'forbidden',
					} as unknown as IDataObject;
				}
				const msg = err instanceof Error ? err.message : String(err);
				throw new NodeOperationError(
					this.getNode(),
					`Failed to execute deleteAssignDevice: ${msg}`,
				);
			}
		}

		case 'getRemoteSupportById': {
			const remoteSupportId = Number(this.getNodeParameter('remoteSupportId', i, 0)) || 0;
			if (remoteSupportId <= 0)
				throw new NodeOperationError(this.getNode(), 'remoteSupportId must be set and > 0');

			url = `${credentials.baseURL}/backend/api/remoteSupports/v1/${remoteSupportId}`;
			requestOptions.method = 'GET';
			requestOptions.url = url;
			delete requestOptions.headers['Content-Type'];
			break;
		}

		case 'updateRemoteSupport': {
			const remoteSupportId = Number(this.getNodeParameter('remoteSupportId', i, 0)) || 0;
			if (remoteSupportId <= 0)
				throw new NodeOperationError(this.getNode(), 'remoteSupportId must be set and > 0');

			const remoteJson = this.getNodeParameter('remoteJson', i, '') as string;
			let body: IDataObject = {};

			if (remoteJson && remoteJson.trim() !== '') {
				try {
					const parsed = JSON.parse(remoteJson);
					if (typeof parsed !== 'object' || parsed === null) {
						throw new Error('remoteJson must be a JSON object.');
					}
					body = parsed as IDataObject;
				} catch (err) {
					const msg = err instanceof Error ? err.message : String(err);
					throw new NodeOperationError(this.getNode(), `remoteJson must be valid JSON: ${msg}`);
				}
			} else {
				const fields = this.getNodeParameter('remoteObject', i, {}) as IDataObject;

				if (fields.remoteMaintenanceId && String(fields.remoteMaintenanceId).trim() !== '')
					body.remoteMaintenanceId = String(fields.remoteMaintenanceId).trim();

				if (fields.userId && String(fields.userId).trim() !== '')
					body.userId = String(fields.userId).trim();

				if (fields.userName && String(fields.userName).trim() !== '')
					body.userName = String(fields.userName).trim();

				const employeeId = Number(fields.employeeId) || 0;
				if (employeeId > 0) body.employeeId = employeeId;

				if (fields.deviceId && String(fields.deviceId).trim() !== '')
					body.deviceId = String(fields.deviceId).trim();

				if (fields.deviceName && String(fields.deviceName).trim() !== '')
					body.deviceName = String(fields.deviceName).trim();

				const companyId = Number(fields.companyId) || 0;
				if (companyId > 0) body.companyId = companyId;

				const linkTypeId = Number(fields.linkTypeId) || 0;
				if (linkTypeId > 0) body.linkTypeId = linkTypeId;

				const linkId = Number(fields.linkId) || 0;
				if (linkId > 0) body.linkId = linkId;

				const startTime = Number(fields.startTime) || 0;
				if (startTime > 0) body.startTime = startTime;

				const endTime = Number(fields.endTime) || 0;
				if (endTime > 0) body.endTime = endTime;

				if (fields.comment && String(fields.comment).trim() !== '')
					body.comment = String(fields.comment).trim();
			}

			url = `${credentials.baseURL}/backend/api/remoteSupports/v1/${remoteSupportId}`;
			requestOptions.method = 'PUT';
			requestOptions.url = url;
			requestOptions.headers['Content-Type'] = 'application/json';
			requestOptions.body = body;
			break;
		}

		case 'deleteRemoteSupport': {
			const remoteSupportId = Number(this.getNodeParameter('remoteSupportId', i, 0)) || 0;
			if (remoteSupportId <= 0)
				throw new NodeOperationError(this.getNode(), 'remoteSupportId must be set and > 0');

			url = `${credentials.baseURL}/backend/api/remoteSupports/v1/${remoteSupportId}`;
			requestOptions.method = 'DELETE';
			requestOptions.url = url;

			try {
				const fullResponse = await this.helpers.httpRequest({
					...(requestOptions as unknown as IDataObject),
					simple: false,
					resolveWithFullResponse: true,
				} as unknown as import('n8n-workflow').IHttpRequestOptions);
				if (fullResponse && fullResponse.statusCode === 204) {
					return {
						success: true,
						statusCode: 204,
						message: 'Remote support deleted',
					} as unknown as IDataObject;
				}
				return fullResponse && fullResponse.body ? fullResponse.body : fullResponse;
			} catch (err: unknown) {
				const e = err as unknown as { statusCode?: number; response?: { statusCode?: number } };
				const status = e?.statusCode ?? e?.response?.statusCode;
				if (status === 403) {
					return {
						success: false,
						statusCode: 403,
						message: 'forbidden',
					} as unknown as IDataObject;
				}
				const msg = err instanceof Error ? err.message : String(err);
				throw new NodeOperationError(
					this.getNode(),
					`Failed to execute deleteRemoteSupport: ${msg}`,
				);
			}
		}

		default:
			throw new NodeOperationError(
				this.getNode(),
				`The operation "${operation}" is not recognized.`,
			);
	}

	try {
		const responseData = await this.helpers.httpRequest(
			requestOptions as unknown as import('n8n-workflow').IHttpRequestOptions,
		);
		return responseData;
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : String(error);
		throw new NodeOperationError(this.getNode(), `Failed to execute ${operation}: ${message}`);
	}
}
