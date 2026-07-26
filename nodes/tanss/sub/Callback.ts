import { IExecuteFunctions, INodeProperties, NodeOperationError, IDataObject, NodeApiError, JsonObject } from 'n8n-workflow';
import { getTanssBaseUrl, tanssHttpRequest } from './request';

export const callbackOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options' as const,
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['callbacks'],
			},
		},
		options: [
			{
				name: 'Create Callback',
				value: 'createCallback',
				description: 'Creates a new callback in TANSS',
				action: 'Creates a new callback',
			},
			{
				name: 'Get a List of Callbacks',
				value: 'getCallbacks',
				description: 'Retrieves a list of callback from the database, using misc. filter settings.',
				action: 'Get callbacks',
			},
			{
				name: 'Get Callback by ID',
				value: 'getCallbackById',
				description: 'Gets a single callback by its ID',
				action: 'Get callback by id',
			},
			{
				name: 'Update Callback',
				value: 'updateCallback',
				description: 'Updates an existing callback',
				action: 'Update callback',
			},
			{
				name: 'Change Callback State',
				value: 'changeCallbackState',
				description: 'Records a state change for an existing callback and appends a log entry',
				action: 'Change callback state',
			},
		],
		default: 'createCallback',
	},
];

const callbackCreateUpdateFieldOptions: INodeProperties[] = [
	{
		displayName: 'From Employee ID',
		name: 'fromEmployeeId',
		type: 'number' as const,
		default: 0,
	},
	{ displayName: 'To Employee ID', name: 'toEmployeeId', type: 'number' as const, default: 0 },
	{
		displayName: 'To Department ID',
		name: 'toDepartmentId',
		type: 'number' as const,
		default: 0,
	},
	{ displayName: 'Date (Timestamp)', name: 'date', type: 'number' as const, default: 0 },
	{ displayName: 'Company ID', name: 'companyId', type: 'number' as const, default: 0 },
	{ displayName: 'Company Name', name: 'companyName', type: 'string' as const, default: '' },
	{ displayName: 'Employee ID', name: 'employeeId', type: 'number' as const, default: 0 },
	{ displayName: 'Employee Name', name: 'employeeName', type: 'string' as const, default: '' },
	{ displayName: 'Phone Number', name: 'phoneNumber', type: 'string' as const, default: '' },
	{ displayName: 'Info', name: 'info', type: 'string' as const, default: '' },
	{
		displayName: 'State',
		name: 'state',
		type: 'options' as const,
		options: [
			{ name: 'UNSEEN', value: 'UNSEEN' },
			{ name: 'NEW', value: 'NEW' },
			{ name: 'NOBODY_ANSWERED', value: 'NOBODY_ANSWERED' },
			{ name: 'BUSY', value: 'BUSY' },
			{ name: 'NOT_PRESENT', value: 'NOT_PRESENT' },
			{ name: 'NEW_CALLBACK_REENTERED', value: 'NEW_CALLBACK_REENTERED' },
			{ name: 'COMPLETED', value: 'COMPLETED' },
			{ name: 'EXPECTED_CALLBACK', value: 'EXPECTED_CALLBACK' },
			{ name: 'EXPECTED_CALLBACK_COMPLETED', value: 'EXPECTED_CALLBACK_COMPLETED' },
		],
		default: 'UNSEEN',
	},
	{ displayName: 'Priority', name: 'priority', type: 'number' as const, default: 1 },
	{
		displayName: 'Callback After Time (Timestamp)',
		name: 'callbackAfterTime',
		type: 'number' as const,
		default: 0,
	},
	{
		displayName: 'Callback Until Time (Timestamp)',
		name: 'callbackUntilTime',
		type: 'number' as const,
		default: 0,
	},
	{ displayName: 'Link Type ID', name: 'linkTypeId', type: 'number' as const, default: 0 },
	{ displayName: 'Link ID', name: 'linkId', type: 'number' as const, default: 0 },
];

export const callbackFields: INodeProperties[] = [
	{
		displayName: 'Callback ID',
		name: 'callbackId',
		type: 'number' as const,
		required: true,
		default: 0,
		description: 'ID of the callback to fetch or update',
		displayOptions: {
			show: {
				resource: ['callbacks'],
				operation: ['getCallbackById', 'updateCallback', 'changeCallbackState'],
			},
		},
	},

	{
		displayName: 'Create Callback Fields',
		name: 'createCallbackFields',
		type: 'collection' as const,
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: ['callbacks'],
				operation: ['createCallback'],
			},
		},
		default: {},
		options: callbackCreateUpdateFieldOptions,
	},

	{
		displayName: 'Update Callback Fields',
		name: 'updateCallbackFields',
		type: 'collection' as const,
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: ['callbacks'],
				operation: ['updateCallback'],
			},
		},
		default: {},
		options: callbackCreateUpdateFieldOptions,
	},

	{
		displayName: 'Change State Fields',
		name: 'changeStateFields',
		type: 'collection' as const,
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: ['callbacks'],
				operation: ['changeCallbackState'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'State',
				name: 'state',
				type: 'options' as const,
				options: [
					{ name: 'UNSEEN', value: 'UNSEEN' },
					{ name: 'NEW', value: 'NEW' },
					{ name: 'NOBODY_ANSWERED', value: 'NOBODY_ANSWERED' },
					{ name: 'BUSY', value: 'BUSY' },
					{ name: 'NOT_PRESENT', value: 'NOT_PRESENT' },
					{ name: 'NEW_CALLBACK_REENTERED', value: 'NEW_CALLBACK_REENTERED' },
					{ name: 'COMPLETED', value: 'COMPLETED' },
					{ name: 'EXPECTED_CALLBACK', value: 'EXPECTED_CALLBACK' },
					{ name: 'EXPECTED_CALLBACK_COMPLETED', value: 'EXPECTED_CALLBACK_COMPLETED' },
				],
				default: 'UNSEEN',
			},
			{
				displayName: 'Info Text',
				name: 'infoText',
				type: 'string' as const,
				default: '',
				description: 'Free-text note describing the state change',
			},
			{
				displayName: 'Date (Timestamp)',
				name: 'date',
				type: 'number' as const,
				default: 0,
				description: 'Timestamp when the state change occurred',
			},
			{
				displayName: 'Employee ID',
				name: 'employeeId',
				type: 'number' as const,
				default: 0,
				description: 'Identifier of the employee who triggered the state change',
			},
		],
	},

	{
		displayName: 'Use Raw Filter JSON (Optional)',
		name: 'filterJson',
		type: 'string' as const,
		default: '',
		description: 'If provided (valid JSON), this object will be sent as the request body for the list call (overrides Filter Settings)',
		displayOptions: {
			show: {
				resource: ['callbacks'],
				operation: ['getCallbacks'],
			},
		},
	},

	{
		displayName: 'Filter Settings',
		name: 'getCallbacksFilters',
		type: 'collection' as const,
		placeholder: 'Add Filter',
		displayOptions: { show: { resource: ['callbacks'], operation: ['getCallbacks'] } },
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
			{
				displayName: 'State',
				name: 'state',
				type: 'options' as const,
				options: [
					{ name: 'UNSEEN', value: 'UNSEEN' },
					{ name: 'NEW', value: 'NEW' },
					{ name: 'NOBODY_ANSWERED', value: 'NOBODY_ANSWERED' },
					{ name: 'BUSY', value: 'BUSY' },
					{ name: 'NOT_PRESENT', value: 'NOT_PRESENT' },
					{ name: 'NEW_CALLBACK_REENTERED', value: 'NEW_CALLBACK_REENTERED' },
					{ name: 'COMPLETED', value: 'COMPLETED' },
					{ name: 'EXPECTED_CALLBACK', value: 'EXPECTED_CALLBACK' },
					{ name: 'EXPECTED_CALLBACK_COMPLETED', value: 'EXPECTED_CALLBACK_COMPLETED' },
				],
				default: 'UNSEEN',
			},
			{
				displayName: 'States (Comma Separated)',
				name: 'states',
				type: 'string' as const,
				default: '',
				description: 'If multiple states have to be filtered, give a comma-separated list',
			},
			{
				displayName: 'From Employee ID',
				name: 'fromEmployeeId',
				type: 'number' as const,
				default: 0,
			},
			{ displayName: 'To Employee ID', name: 'toEmployeeId', type: 'number' as const, default: 0 },
			{
				displayName: 'To All Employees With Access To',
				name: 'toAllEmployeesWithAccessTo',
				type: 'boolean' as const,
				default: false,
			},
			{
				displayName: 'To Department IDs (Comma Separated)',
				name: 'toDepartmentIds',
				type: 'string' as const,
				default: '',
			},
			{
				displayName: 'Company IDs (Comma Separated)',
				name: 'companyIds',
				type: 'string' as const,
				default: '',
			},
			{
				displayName: 'Employee IDs (Comma Separated)',
				name: 'employeeIds',
				type: 'string' as const,
				default: '',
			},
			{
				displayName: 'Load Linked Entities',
				name: 'loadLinkedEntites',
				type: 'boolean' as const,
				default: false,
			},
			{ displayName: 'With Log', name: 'withLog', type: 'boolean' as const, default: false },
			{ displayName: 'Items Per Page', name: 'itemsPerPage', type: 'number' as const, default: 0 },
			{ displayName: 'Page', name: 'page', type: 'number' as const, default: 0 },
		],
	},
];

export async function handleCallback(this: IExecuteFunctions, i: number) {
	const operation = this.getNodeParameter('operation', i) as string;
	const credentials = { baseURL: await getTanssBaseUrl.call(this, i) };

	let url = '';
	const requestOptions: {
		method: 'GET' | 'POST' | 'PUT' | 'DELETE';
		headers: { 'Content-Type': string };
		json: boolean;
		body?: Record<string, unknown>;
		url: string;
	} = {
		method: 'GET',
		headers: { 'Content-Type': 'application/json' },
		json: true,
		url,
	};

	switch (operation) {
		case 'createCallback': {
			url = `${credentials.baseURL}/backend/api/v1/callbacks`;
			requestOptions.method = 'POST';
			const createFields = this.getNodeParameter('createCallbackFields', i, {}) as Record<string, unknown>;
			if (Object.keys(createFields).length === 0) throw new NodeOperationError(this.getNode(), 'No fields provided for callback creation.');
			requestOptions.body = createFields;
			break;
		}

		case 'getCallbacks': {
			const filterJson = this.getNodeParameter('filterJson', i, '') as string;
			let body: IDataObject = {};

			if (filterJson && filterJson.trim() !== '') {
				try {
					const parsed = JSON.parse(filterJson);
					if (typeof parsed !== 'object' || parsed === null) {
						throw new Error('filterJson must be a JSON object.');
					}
					body = parsed as IDataObject;
				} catch (err) {
					throw new NodeApiError(this.getNode(), err as JsonObject);
				}
			} else {
				const filters = this.getNodeParameter('getCallbacksFilters', i, {}) as IDataObject;

				const timeFrom = Number(filters.timeFrom) || 0;
				const timeTo = Number(filters.timeTo) || 0;
				if (timeFrom || timeTo) {
					const timeframe: IDataObject = {};
					if (timeFrom > 0) timeframe.from = timeFrom;
					if (timeTo > 0) timeframe.to = timeTo;
					body.timeframe = timeframe;
				}

				if (filters.state) body.state = filters.state;

				if (filters.states && typeof filters.states === 'string' && filters.states.trim() !== '') {
					body.states = filters.states.split(',').map((s: string) => s.trim());
				}

				const fromEmployeeId = Number(filters.fromEmployeeId) || 0;
				if (fromEmployeeId > 0) body.fromEmployeeId = fromEmployeeId;

				const toEmployeeId = Number(filters.toEmployeeId) || 0;
				if (toEmployeeId > 0) body.toEmployeeId = toEmployeeId;

				if (filters.toAllEmployeesWithAccessTo === true) body.toAllEmployeesWithAccessTo = true;

				if (filters.toDepartmentIds && typeof filters.toDepartmentIds === 'string' && filters.toDepartmentIds.trim() !== '') {
					body.toDepartmentIds = filters.toDepartmentIds.split(',').map((s: string) => Number(s.trim()));
				}

				if (filters.companyIds && typeof filters.companyIds === 'string' && filters.companyIds.trim() !== '') {
					body.companyIds = filters.companyIds.split(',').map((s: string) => Number(s.trim()));
				}

				if (filters.employeeIds && typeof filters.employeeIds === 'string' && filters.employeeIds.trim() !== '') {
					body.employeeIds = filters.employeeIds.split(',').map((s: string) => Number(s.trim()));
				}

				if (filters.loadLinkedEntites === true) body.loadLinkedEntites = true;
				if (filters.withLog === true) body.withLog = true;

				const itemsPerPage = Number(filters.itemsPerPage) || 0;
				if (itemsPerPage > 0) body.itemsPerPage = itemsPerPage;

				const page = Number(filters.page) || 0;
				if (page > 0) body.page = page;
			}

			url = `${credentials.baseURL}/backend/api/v1/callbacks`;
			requestOptions.method = 'PUT';
			requestOptions.body = body;
			break;
		}

		case 'getCallbackById': {
			const callbackId = this.getNodeParameter('callbackId', i, 0) as number;
			if (!callbackId || callbackId <= 0) throw new NodeOperationError(this.getNode(), 'A valid Callback ID is required.');

			url = `${credentials.baseURL}/backend/api/v1/callbacks/${encodeURIComponent(String(callbackId))}`;
			requestOptions.method = 'GET';
			break;
		}

		case 'updateCallback': {
			const callbackId = this.getNodeParameter('callbackId', i, 0) as number;
			if (!callbackId || callbackId <= 0) throw new NodeOperationError(this.getNode(), 'A valid Callback ID is required.');

			const updateFields = this.getNodeParameter('updateCallbackFields', i, {}) as Record<string, unknown>;
			if (Object.keys(updateFields).length === 0) throw new NodeOperationError(this.getNode(), 'No fields to update were provided.');

			url = `${credentials.baseURL}/backend/api/v1/callbacks/${encodeURIComponent(String(callbackId))}`;
			requestOptions.method = 'PUT';
			requestOptions.body = updateFields;
			break;
		}

		case 'changeCallbackState': {
			const stateCallbackId = this.getNodeParameter('callbackId', i, 0) as number;
			if (!stateCallbackId || stateCallbackId <= 0) throw new NodeOperationError(this.getNode(), 'A valid Callback ID is required.');

			const stateFields = this.getNodeParameter('changeStateFields', i, {}) as Record<string, unknown>;
			if (!stateFields.state) throw new NodeOperationError(this.getNode(), 'State is required for changing callback state.');

			const stateBody: Record<string, unknown> = {};
			if (stateFields.state) stateBody.state = stateFields.state;
			if (stateFields.infoText) stateBody.infoText = stateFields.infoText;
			if (stateFields.date && Number(stateFields.date) > 0) stateBody.date = stateFields.date;
			if (stateFields.employeeId && Number(stateFields.employeeId) > 0) stateBody.employeeId = stateFields.employeeId;

			url = `${credentials.baseURL}/backend/api/v1/callbacks/${encodeURIComponent(String(stateCallbackId))}/state`;
			requestOptions.method = 'POST';
			requestOptions.body = stateBody;
			break;
		}

		default:
			throw new NodeOperationError(this.getNode(), `The operation "${operation}" is not recognized.`);
	}

	requestOptions.url = url;

	try {
		const responseData = await tanssHttpRequest.call(this, i, requestOptions as unknown as import('n8n-workflow').IHttpRequestOptions);
		return responseData;
	} catch (error: unknown) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}
