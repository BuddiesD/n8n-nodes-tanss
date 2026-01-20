import { IExecuteFunctions, INodeProperties, NodeOperationError, IDataObject } from 'n8n-workflow';

export const callsUserOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options' as const,
		noDataExpression: true,
		displayOptions: {
			show: { resource: ['callsuser'] },
		},
		options: [
			{
				name: 'Get a List of Phone Calls',
				value: 'getCalls',
				description: 'Retrieves a list of phone calls using filter settings',
				action: 'Get calls',
			},
			{
				name: 'Get Phone Call By ID',
				value: 'getCallById',
				description: 'Gets a specific phone call by its ID',
				action: 'Get call by id',
			},
			{
				name: 'Identifies a Phone Call',
				value: 'identifyCall',
				description: 'Tries to identify a phone call and resolve company and employeeId',
				action: 'Identify call',
			},
		],
		default: 'getCalls',
	},
];

export const callsUserFields: INodeProperties[] = [
	{
		displayName: 'API Token',
		name: 'apiToken',
		type: 'string' as const,
		required: true,
		typeOptions: { password: true },
		default: '',
		description: 'API token obtained from the TANSS API login',
		displayOptions: { show: { resource: ['callsuser'] } },
	},

	{
		displayName: 'Use Raw Filter JSON (Optional)',
		name: 'filterJson',
		type: 'string' as const,
		default: '',
		description:
			'If provided (valid JSON), this object will be sent as the request body for the list call (overrides Filter Settings)',
		displayOptions: {
			show: { resource: ['callsuser'], operation: ['getCalls'] },
		},
	},

	{
		displayName: 'Filter Settings',
		name: 'getCallsFilters',
		type: 'collection' as const,
		placeholder: 'Add Filter',
		displayOptions: { show: { resource: ['callsuser'], operation: ['getCalls'] } },
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
				displayName: 'Show Tries As Well',
				name: 'showTrysAsWell',
				type: 'boolean' as const,
				default: false,
			},
			{
				displayName: 'Number Filters (Comma Separated)',
				name: 'numberFilters',
				type: 'string' as const,
				default: '',
			},
			{ displayName: 'Employee ID', name: 'employeeIdFilter', type: 'number' as const, default: 0 },
			{ displayName: 'Company ID', name: 'companyIdFilter', type: 'number' as const, default: 0 },
			{
				displayName: 'Number Infos',
				name: 'numberInfos',
				type: 'boolean' as const,
				default: false,
			},
			{
				displayName: 'Directions',
				name: 'directions',
				type: 'multiOptions' as const,
				options: [
					{ name: 'INTERNAL', value: 'INTERNAL' },
					{ name: 'INCOMING', value: 'INCOMING' },
					{ name: 'OUTGOING', value: 'OUTGOING' },
				],
				default: [],
			},
		],
	},

	{
		displayName: 'Phone Call ID',
		name: 'phoneCallId',
		type: 'number' as const,
		default: 0,
		description: 'ID of the phone call to fetch',
		displayOptions: {
			show: { resource: ['callsuser'], operation: ['getCallById'] },
		},
	},
	{
		displayName: 'From Phone Number',
		name: 'fromPhoneNumber',
		type: 'string' as const,
		default: '',
		required: true,
		description: 'Phone number of the caller (= "from" number)',
		displayOptions: {
			show: { resource: ['callsuser'], operation: ['identifyCall'] },
		},
	},
	{
		displayName: 'To Phone Number',
		name: 'toPhoneNumber',
		type: 'string' as const,
		default: '',
		required: true,
		description: 'Phone number of the called (= "to" number)',
		displayOptions: {
			show: { resource: ['callsuser'], operation: ['identifyCall'] },
		},
	},
];

export async function handleCallsUser(this: IExecuteFunctions, i: number) {
	const operation = this.getNodeParameter('operation', i) as string;
	const credentials = await this.getCredentials('tanssApi');
	if (!credentials) throw new NodeOperationError(this.getNode(), 'No credentials returned!');

	const apiToken = this.getNodeParameter('apiToken', i, '') as string;
	const base = credentials.baseURL as string;
	if (!base) throw new NodeOperationError(this.getNode(), 'No baseURL in credentials');

	let url = '';
	const requestOptions: {
		method: 'GET' | 'PUT' | 'POST';
		headers: { apiToken: string; 'Content-Type': string };
		json: boolean;
		body?: IDataObject;
		url: string;
	} = {
		method: 'GET',
		headers: { apiToken, 'Content-Type': 'application/json' },
		json: true,
		url,
	};

	switch (operation) {
		case 'getCalls': {
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
					const msg = err instanceof Error ? err.message : String(err);
					throw new NodeOperationError(this.getNode(), `filterJson must be valid JSON: ${msg}`);
				}
			} else {
				const filters = this.getNodeParameter('getCallsFilters', i, {}) as IDataObject;

				const timeFrom = Number(filters.timeFrom) || 0;
				const timeTo = Number(filters.timeTo) || 0;
				if (timeFrom || timeTo) {
					const timeframe: IDataObject = {};
					if (timeFrom > 0) timeframe.from = timeFrom;
					if (timeTo > 0) timeframe.to = timeTo;
					body.timeframe = timeframe;
				}

				if (filters.showTrysAsWell === true) body.showTrysAsWell = true;

				if (
					filters.numberFilters &&
					typeof filters.numberFilters === 'string' &&
					filters.numberFilters.trim() !== ''
				) {
					body.numberFilters = filters.numberFilters.split(',').map((s) => s.trim());
				}

				const employeeIdFilter = Number(filters.employeeIdFilter) || 0;
				if (employeeIdFilter > 0) body.employeeId = employeeIdFilter;

				const companyIdFilter = Number(filters.companyIdFilter) || 0;
				if (companyIdFilter > 0) body.companyId = companyIdFilter;

				if (filters.numberInfos === true) body.numberInfos = true;

				if (filters.directions && Array.isArray(filters.directions) && filters.directions.length)
					body.directions = filters.directions;
			}

			url = `${base.replace(/\/+$/, '')}/backend/api/v1/phoneCalls`;
			requestOptions.method = 'PUT';
			requestOptions.url = url;
			requestOptions.body = body;
			break;
		}

		case 'getCallById': {
			const phoneCallId = this.getNodeParameter('phoneCallId', i, 0) as number;
			if (!phoneCallId || phoneCallId <= 0)
				throw new NodeOperationError(this.getNode(), 'A valid Phone Call ID is required.');

			url = `${base.replace(/\/+$/, '')}/backend/api/v1/phoneCalls/${encodeURIComponent(String(phoneCallId))}`;
			requestOptions.method = 'GET';
			requestOptions.url = url;
			break;
		}

		case 'identifyCall': {
			const fromPhoneNumber = this.getNodeParameter('fromPhoneNumber', i, '') as string;
			const toPhoneNumber = this.getNodeParameter('toPhoneNumber', i, '') as string;

			if (!fromPhoneNumber || fromPhoneNumber.trim() === '')
				throw new NodeOperationError(
					this.getNode(),
					'fromPhoneNumber is required for identification.',
				);
			if (!toPhoneNumber || toPhoneNumber.trim() === '')
				throw new NodeOperationError(
					this.getNode(),
					'toPhoneNumber is required for identification.',
				);

			const body: IDataObject = {
				fromPhoneNumber: fromPhoneNumber.trim(),
				toPhoneNumber: toPhoneNumber.trim(),
			};

			url = `${base.replace(/\/+$/, '')}/backend/api/v1/phoneCalls/identify`;
			requestOptions.method = 'POST';
			requestOptions.url = url;
			requestOptions.body = body;
			break;
		}

		default:
			throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
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
