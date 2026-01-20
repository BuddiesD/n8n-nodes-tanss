import {
	IExecuteFunctions,
	INodeProperties,
	NodeOperationError,
	IDataObject,
	IHttpRequestOptions,
} from 'n8n-workflow';

export const timestampOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options' as const,
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['timestamps'],
			},
		},
		options: [
			{
				name: 'Get Timestamps',
				value: 'getTimestamps',
				description: 'Gets a list of timestamps from a given period',
				action: 'Get timestamps',
			},
			{
				name: 'Get Timestamp Info',
				value: 'getTimestampInfo',
				description: 'Gets the timestamp infos for a given time period',
				action: 'Get timestamp info',
			},
			{
				name: 'Get Timestamp Statistics',
				value: 'getTimestampStatistics',
				description: 'Gets the timestamp infos for a given time period (with statistical values)',
				action: 'Get timestamp statistics',
			},
			{
				name: 'Create Timestamp',
				value: 'createTimestamp',
				description: 'Writes a timestamp into the database',
				action: 'Create timestamp',
			},
			{
				name: 'Update Timestamp',
				value: 'updateTimestamp',
				description: 'Edits a single timestamp',
				action: 'Update timestamp',
			},
			{
				name: 'Save Day Timestamps',
				value: 'saveDayTimestamps',
				description: 'Writes the timestamps of a whole day into the database at once',
				action: 'Save day timestamps',
			},
			{
				name: 'Create Day Closing(s)',
				value: 'createDayClosing',
				description: 'Creates one or more day closings',
				action: 'Create day closing(s)',
			},
			{
				name: 'Delete Day Closing(s)',
				value: 'deleteDayClosing',
				description: 'Deletes one or more day closings (undo)',
				action: 'Delete day closing(s)',
			},
			{
				name: 'Get Day Closing Till Date',
				value: 'getDayClosingTillDate',
				description: 'Gets all infos about last dayclosings for employees',
				action: 'Get day closing till date',
			},
			{
				name: 'Create Day Closings Till Date',
				value: 'createDayClosingsTillDate',
				description: 'Creates missing dayClosings for given employees till a date',
				action: 'Create day closings till date',
			},
			{
				name: 'Set Initial Balance',
				value: 'setInitialBalance',
				description: 'Sets the initial balance for an employee',
				action: 'Set initial balance',
			},
			{
				name: 'Get Pause Configs',
				value: 'getPauseConfigs',
				description: 'Gets a list of all pause configs',
				action: 'Get pause configs',
			},
			{
				name: 'Create Pause Config',
				value: 'createPauseConfig',
				description: 'Creates a pause config',
				action: 'Create pause config',
			},
			{
				name: 'Update Pause Config',
				value: 'updatePauseConfig',
				description: 'Updates a pause config',
				action: 'Update pause config',
			},
			{
				name: 'Delete Pause Config',
				value: 'deletePauseConfig',
				description: 'Deletes a pause config',
				action: 'Delete pause config',
			},
		],
		default: 'getTimestamps',
	},
];

export const timestampFields: INodeProperties[] = [
	{
		displayName: 'API Token',
		name: 'apiToken',
		type: 'string' as const,
		required: true,
		typeOptions: { password: true },
		default: '',
		description: 'API token obtained from the TANSS API login',
		displayOptions: { show: { resource: ['timestamps'] } },
	},

	// getTimestamps / info / statistics params
	{
		displayName: 'From (Timestamp)',
		name: 'from',
		type: 'number' as const,
		default: 0,
		description:
			'Timestamp of start of period. If omitted, beginning of current day is used by the API.',
		displayOptions: {
			show: {
				resource: ['timestamps'],
				operation: ['getTimestamps', 'getTimestampInfo', 'getTimestampStatistics'],
			},
		},
	},
	{
		displayName: 'Till (Timestamp)',
		name: 'till',
		type: 'number' as const,
		default: 0,
		description: 'Timestamp of end of period. If omitted, end of current day is used by the API.',
		displayOptions: {
			show: {
				resource: ['timestamps'],
				operation: ['getTimestamps', 'getTimestampInfo', 'getTimestampStatistics'],
			},
		},
	},
	{
		displayName: 'Employee IDs (Comma Separated)',
		name: 'employeeIds',
		type: 'string' as const,
		default: '',
		description:
			'Comma-separated list of employee IDs for which statistics shall be generated (only for statistics operation)',
		displayOptions: { show: { resource: ['timestamps'], operation: ['getTimestampStatistics'] } },
	},

	// createTimestamp fields
	{
		displayName: 'Auto Pause',
		name: 'autoPause',
		type: 'boolean' as const,
		default: false,
		description: 'If true, a pause will automatically be inserted if minimum pause is not met',
		displayOptions: { show: { resource: ['timestamps'], operation: ['createTimestamp'] } },
	},
	{
		displayName: 'Employee ID',
		name: 'employeeId',
		type: 'number' as const,
		default: 0,
		description: 'ID of the employee',
		displayOptions: {
			show: { resource: ['timestamps'], operation: ['createTimestamp', 'updateTimestamp'] },
		},
	},
	{
		displayName: 'Date (Timestamp)',
		name: 'date',
		type: 'number' as const,
		default: 0,
		description: 'Timestamp (integer) for the timestamp date',
		displayOptions: {
			show: { resource: ['timestamps'], operation: ['createTimestamp', 'updateTimestamp'] },
		},
	},
	{
		displayName: 'State',
		name: 'state',
		type: 'options' as const,
		options: [
			{ name: 'ON', value: 'ON' },
			{ name: 'OFF', value: 'OFF' },
			{ name: 'PAUSE_START', value: 'PAUSE_START' },
			{ name: 'PAUSE_END', value: 'PAUSE_END' },
		],
		default: 'ON',
		description: 'Determines the state for the timestamp',
		displayOptions: {
			show: { resource: ['timestamps'], operation: ['createTimestamp', 'updateTimestamp'] },
		},
	},
	{
		displayName: 'Type',
		name: 'type',
		type: 'options' as const,
		options: [
			{ name: 'WORK', value: 'WORK' },
			{ name: 'INHOUSE', value: 'INHOUSE' },
			{ name: 'ERRAND', value: 'ERRAND' },
			{ name: 'VACATION', value: 'VACATION' },
			{ name: 'ILLNESS', value: 'ILLNESS' },
			{ name: 'ABSENCE_PAID', value: 'ABSENCE_PAID' },
			{ name: 'ABSENCE_UNPAID', value: 'ABSENCE_UNPAID' },
			{ name: 'OVERTIME', value: 'OVERTIME' },
			{ name: 'DOCUMENTED_SUPPORT', value: 'DOCUMENTED_SUPPORT' },
		],
		default: 'WORK',
		description: 'Determines the type for the timestamp',
		displayOptions: {
			show: { resource: ['timestamps'], operation: ['createTimestamp', 'updateTimestamp'] },
		},
	},

	// updateTimestamp path param
	{
		displayName: 'Timestamp ID',
		name: 'timestampId',
		type: 'number' as const,
		default: 0,
		description: 'ID of the timestamp to edit',
		displayOptions: { show: { resource: ['timestamps'], operation: ['updateTimestamp'] } },
	},

	// saveDayTimestamps fields
	{
		displayName: 'Employee ID (Day)',
		name: 'employeeIdDay',
		type: 'number' as const,
		default: 0,
		description: 'Employee ID for saving day timestamps (path param)',
		displayOptions: { show: { resource: ['timestamps'], operation: ['saveDayTimestamps'] } },
	},
	{
		displayName: 'Day',
		name: 'day',
		type: 'string' as const,
		default: '',
		description: 'Day in YYYY-mm-dd format',
		displayOptions: { show: { resource: ['timestamps'], operation: ['saveDayTimestamps'] } },
	},
	{
		displayName: 'Timestamps JSON',
		name: 'timestampsJson',
		type: 'string' as const,
		default: '[]',
		description: 'JSON array of timestamp objects to save for the day (see docs)',
		displayOptions: { show: { resource: ['timestamps'], operation: ['saveDayTimestamps'] } },
	},

	// dayClosing create/delete payload
	{
		displayName: 'Day Closings JSON',
		name: 'dayClosingsJson',
		type: 'string' as const,
		default: '[]',
		description:
			'JSON array of day closing identifiers [{ "employeeId": 1, "date":"YYYY-mm-dd" }, ...]',
		displayOptions: {
			show: { resource: ['timestamps'], operation: ['createDayClosing', 'deleteDayClosing'] },
		},
	},

	// createDayClosingsTillDate fields
	{
		displayName: 'Till Date',
		name: 'tillDate',
		type: 'string' as const,
		default: '',
		description: 'End date (YYYY-MM-DD) to create dayClosings till',
		displayOptions: {
			show: { resource: ['timestamps'], operation: ['createDayClosingsTillDate'] },
		},
	},
	{
		displayName: 'Employee IDs JSON',
		name: 'employeeIdsJson',
		type: 'string' as const,
		default: '[]',
		description: 'JSON array of integers: employee IDs to create dayClosings for',
		displayOptions: {
			show: { resource: ['timestamps'], operation: ['createDayClosingsTillDate'] },
		},
	},

	// setInitialBalance fields
	{
		displayName: 'Employee ID (Initial)',
		name: 'employeeIdInitial',
		type: 'number' as const,
		default: 0,
		description: 'Employee ID (path param) for initial balance',
		displayOptions: { show: { resource: ['timestamps'], operation: ['setInitialBalance'] } },
	},
	{
		displayName: 'Initial Balance (Minutes)',
		name: 'initialBalance',
		type: 'number' as const,
		default: 0,
		description: 'Initial balance in minutes',
		displayOptions: { show: { resource: ['timestamps'], operation: ['setInitialBalance'] } },
	},

	// pauseConfigs fields
	{
		displayName: 'Pause Config ID',
		name: 'pauseConfigId',
		type: 'number' as const,
		default: 0,
		description: 'ID of the pause config (for update/delete)',
		displayOptions: {
			show: { resource: ['timestamps'], operation: ['updatePauseConfig', 'deletePauseConfig'] },
		},
	},
	{
		displayName: 'From Minutes',
		name: 'fromMinutes',
		type: 'number' as const,
		default: 0,
		description: 'Minutes needed to require a minimum pause',
		displayOptions: {
			show: { resource: ['timestamps'], operation: ['createPauseConfig', 'updatePauseConfig'] },
		},
	},
	{
		displayName: 'Minimum Pause (Minutes)',
		name: 'minimumPause',
		type: 'number' as const,
		default: 0,
		description: 'Minimum pause in minutes',
		displayOptions: {
			show: { resource: ['timestamps'], operation: ['createPauseConfig', 'updatePauseConfig'] },
		},
	},
];

export async function handleTimestamps(this: IExecuteFunctions, i: number) {
	const operation = this.getNodeParameter('operation', i) as string;
	const allowed = [
		'getTimestamps',
		'getTimestampInfo',
		'getTimestampStatistics',
		'createTimestamp',
		'updateTimestamp',
		'saveDayTimestamps',
		'createDayClosing',
		'deleteDayClosing',
		'getDayClosingTillDate',
		'createDayClosingsTillDate',
		'setInitialBalance',
		'getPauseConfigs',
		'createPauseConfig',
		'updatePauseConfig',
		'deletePauseConfig',
	] as const;
	if (!allowed.includes(operation as (typeof allowed)[number])) {
		throw new NodeOperationError(
			this.getNode(),
			`Operation "${operation}" not supported by Timestamps.`,
		);
	}

	const credentials = await this.getCredentials('tanssApi');
	if (!credentials) throw new NodeOperationError(this.getNode(), 'No credentials returned!');

	const apiToken = this.getNodeParameter('apiToken', i, '') as string;
	const typedCredentials = credentials as { baseURL?: string };
	const baseURL = typedCredentials.baseURL;
	if (!baseURL) throw new NodeOperationError(this.getNode(), 'No baseURL in credentials');

	// GET list
	if (operation === 'getTimestamps') {
		const from = this.getNodeParameter('from', i, 0) as number;
		const till = this.getNodeParameter('till', i, 0) as number;

		const params: string[] = [];
		if (from && from > 0) params.push(`from=${encodeURIComponent(String(from))}`);
		if (till && till > 0) params.push(`till=${encodeURIComponent(String(till))}`);

		const query = params.length ? `?${params.join('&')}` : '';
		const url = `${baseURL}/backend/api/v1/timestamps${query}`;

		const requestOptions: IDataObject = {
			method: 'GET',
			url,
			headers: { apiToken, 'Content-Type': 'application/json' },
			json: true,
		};

		try {
			const response = await this.helpers.httpRequest(
				requestOptions as unknown as IHttpRequestOptions,
			);
			return response;
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : String(error);
			throw new NodeOperationError(this.getNode(), `Failed to fetch timestamps: ${message}`);
		}
	}

	// GET info
	if (operation === 'getTimestampInfo') {
		const from = this.getNodeParameter('from', i, 0) as number;
		const till = this.getNodeParameter('till', i, 0) as number;

		const params: string[] = [];
		if (from && from > 0) params.push(`from=${encodeURIComponent(String(from))}`);
		if (till && till > 0) params.push(`till=${encodeURIComponent(String(till))}`);

		const query = params.length ? `?${params.join('&')}` : '';
		const url = `${baseURL}/backend/api/v1/timestamps/info${query}`;

		const requestOptions: IDataObject = {
			method: 'GET',
			url,
			headers: { apiToken, 'Content-Type': 'application/json' },
			json: true,
		};

		try {
			const response = await this.helpers.httpRequest(
				requestOptions as unknown as IHttpRequestOptions,
			);
			return response;
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : String(error);
			throw new NodeOperationError(this.getNode(), `Failed to fetch timestamp info: ${message}`);
		}
	}

	// GET statistics
	if (operation === 'getTimestampStatistics') {
		const from = this.getNodeParameter('from', i, 0) as number;
		const till = this.getNodeParameter('till', i, 0) as number;
		const employeeIds = this.getNodeParameter('employeeIds', i, '') as string;

		const params: string[] = [];
		if (from && from > 0) params.push(`from=${encodeURIComponent(String(from))}`);
		if (till && till > 0) params.push(`till=${encodeURIComponent(String(till))}`);
		if (employeeIds && employeeIds.trim() !== '')
			params.push(`employeeIds=${encodeURIComponent(employeeIds)}`);

		const query = params.length ? `?${params.join('&')}` : '';
		const url = `${baseURL}/backend/api/v1/timestamps/statistics${query}`;

		const requestOptions: IDataObject = {
			method: 'GET',
			url,
			headers: { apiToken, 'Content-Type': 'application/json' },
			json: true,
		};

		try {
			const response = await this.helpers.httpRequest(
				requestOptions as unknown as IHttpRequestOptions,
			);
			return response;
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : String(error);
			throw new NodeOperationError(
				this.getNode(),
				`Failed to fetch timestamp statistics: ${message}`,
			);
		}
	}

	// CREATE
	if (operation === 'createTimestamp') {
		const autoPause = this.getNodeParameter('autoPause', i, false) as boolean;
		const employeeId = this.getNodeParameter('employeeId', i, 0) as number;
		const date = this.getNodeParameter('date', i, 0) as number;
		const state = this.getNodeParameter('state', i, '') as string;
		const type = this.getNodeParameter('type', i, '') as string;

		if (!employeeId || employeeId <= 0)
			throw new NodeOperationError(this.getNode(), 'Valid employeeId is required.');
		if (!date || date <= 0)
			throw new NodeOperationError(this.getNode(), 'Valid date (timestamp) is required.');
		if (!state) throw new NodeOperationError(this.getNode(), 'State is required.');
		if (!type) throw new NodeOperationError(this.getNode(), 'Type is required.');

		const body: IDataObject = { employeeId, date, state, type };

		const url = `${baseURL}/backend/api/v1/timestamps${autoPause ? '?autoPause=true' : ''}`;
		const requestOptions: IDataObject = {
			method: 'POST',
			url,
			headers: { apiToken, 'Content-Type': 'application/json' },
			body,
			json: true,
		};

		try {
			const response = await this.helpers.httpRequest(
				requestOptions as unknown as IHttpRequestOptions,
			);
			return response;
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : String(error);
			throw new NodeOperationError(this.getNode(), `Failed to create timestamp: ${message}`);
		}
	}

	// UPDATE single
	if (operation === 'updateTimestamp') {
		const timestampId = this.getNodeParameter('timestampId', i, 0) as number;
		const employeeId = this.getNodeParameter('employeeId', i, 0) as number;
		const date = this.getNodeParameter('date', i, 0) as number;
		const state = this.getNodeParameter('state', i, '') as string;
		const type = this.getNodeParameter('type', i, '') as string;

		if (!timestampId || timestampId <= 0)
			throw new NodeOperationError(this.getNode(), 'Valid timestampId is required.');
		if (!employeeId || employeeId <= 0)
			throw new NodeOperationError(this.getNode(), 'Valid employeeId is required.');
		if (!date || date <= 0)
			throw new NodeOperationError(this.getNode(), 'Valid date (timestamp) is required.');
		if (!state) throw new NodeOperationError(this.getNode(), 'State is required.');
		if (!type) throw new NodeOperationError(this.getNode(), 'Type is required.');

		const body: IDataObject = { employeeId, date, state, type };

		const url = `${baseURL}/backend/api/v1/timestamps/${timestampId}`;
		const requestOptions: IDataObject = {
			method: 'PUT',
			url,
			headers: { apiToken, 'Content-Type': 'application/json' },
			body,
			json: true,
		};

		try {
			const response = await this.helpers.httpRequest(
				requestOptions as unknown as IHttpRequestOptions,
			);
			return response;
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : String(error);
			throw new NodeOperationError(this.getNode(), `Failed to update timestamp: ${message}`);
		}
	}

	// SAVE DAY (bulk)
	if (operation === 'saveDayTimestamps') {
		const employeeIdDay = this.getNodeParameter('employeeIdDay', i, 0) as number;
		const day = this.getNodeParameter('day', i, '') as string;
		const timestampsJson = this.getNodeParameter('timestampsJson', i, '[]') as string;

		if (!employeeIdDay || employeeIdDay <= 0)
			throw new NodeOperationError(this.getNode(), 'Valid employeeId is required.');
		if (!day) throw new NodeOperationError(this.getNode(), 'Day (YYYY-mm-dd) is required.');

		let timestampsArray: unknown;
		try {
			timestampsArray = JSON.parse(timestampsJson);
		} catch {
			throw new NodeOperationError(this.getNode(), 'timestampsJson must be valid JSON.');
		}
		if (!Array.isArray(timestampsArray))
			throw new NodeOperationError(this.getNode(), 'timestampsJson must be a JSON array.');

		const url = `${baseURL}/backend/api/v1/timestamps/${employeeIdDay}/day/${encodeURIComponent(day)}`;
		const requestOptions: IDataObject = {
			method: 'PUT',
			url,
			headers: { apiToken, 'Content-Type': 'application/json' },
			body: timestampsArray as IDataObject[],
			json: true,
		};

		try {
			const response = await this.helpers.httpRequest(
				requestOptions as unknown as IHttpRequestOptions,
			);
			return response;
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : String(error);
			throw new NodeOperationError(this.getNode(), `Failed to save day timestamps: ${message}`);
		}
	}

	// CREATE Day Closing(s)
	if (operation === 'createDayClosing') {
		const dayClosingsJson = this.getNodeParameter('dayClosingsJson', i, '[]') as string;
		let payload: unknown;
		try {
			payload = JSON.parse(dayClosingsJson);
		} catch {
			throw new NodeOperationError(this.getNode(), 'dayClosingsJson must be valid JSON.');
		}
		if (!Array.isArray(payload))
			throw new NodeOperationError(this.getNode(), 'dayClosingsJson must be an array.');

		for (const entry of payload) {
			if (typeof entry !== 'object' || entry === null)
				throw new NodeOperationError(this.getNode(), 'Each day closing must be an object.');
			const obj = entry as { employeeId?: number; date?: string };
			if (!obj.employeeId || typeof obj.employeeId !== 'number' || obj.employeeId <= 0)
				throw new NodeOperationError(
					this.getNode(),
					'Each day closing requires a valid employeeId.',
				);
			if (!obj.date || typeof obj.date !== 'string')
				throw new NodeOperationError(
					this.getNode(),
					'Each day closing requires a valid date string (YYYY-mm-dd).',
				);
		}

		const url = `${baseURL}/backend/api/v1/timestamps/dayClosing`;
		const requestOptions: IDataObject = {
			method: 'POST',
			url,
			headers: { apiToken, 'Content-Type': 'application/json' },
			body: payload as IDataObject[],
			json: true,
		};

		try {
			const response = await this.helpers.httpRequest(
				requestOptions as unknown as IHttpRequestOptions,
			);
			return response;
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : String(error);
			throw new NodeOperationError(this.getNode(), `Failed to create day closing(s): ${message}`);
		}
	}

	// DELETE Day Closing(s)
	if (operation === 'deleteDayClosing') {
		const dayClosingsJson = this.getNodeParameter('dayClosingsJson', i, '[]') as string;
		let payload: unknown;
		try {
			payload = JSON.parse(dayClosingsJson);
		} catch {
			throw new NodeOperationError(this.getNode(), 'dayClosingsJson must be valid JSON.');
		}
		if (!Array.isArray(payload))
			throw new NodeOperationError(this.getNode(), 'dayClosingsJson must be an array.');

		for (const entry of payload) {
			if (typeof entry !== 'object' || entry === null)
				throw new NodeOperationError(this.getNode(), 'Each day closing must be an object.');
			const obj = entry as { employeeId?: number; date?: string };
			if (!obj.employeeId || typeof obj.employeeId !== 'number' || obj.employeeId <= 0)
				throw new NodeOperationError(
					this.getNode(),
					'Each day closing requires a valid employeeId.',
				);
			if (!obj.date || typeof obj.date !== 'string')
				throw new NodeOperationError(
					this.getNode(),
					'Each day closing requires a valid date string (YYYY-mm-dd).',
				);
		}

		const url = `${baseURL}/backend/api/v1/timestamps/dayClosing`;
		const requestOptions: IDataObject = {
			method: 'DELETE',
			url,
			headers: { apiToken, 'Content-Type': 'application/json' },
			body: payload as IDataObject[],
			json: true,
		};

		try {
			const response = await this.helpers.httpRequest(
				requestOptions as unknown as IHttpRequestOptions,
			);
			return response;
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : String(error);
			throw new NodeOperationError(this.getNode(), `Failed to delete day closing(s): ${message}`);
		}
	}

	// GET dayClosing tillDate
	if (operation === 'getDayClosingTillDate') {
		const url = `${baseURL}/backend/api/v1/timestamps/dayClosing/tillDate`;
		const requestOptions: IDataObject = {
			method: 'GET',
			url,
			headers: { apiToken, 'Content-Type': 'application/json' },
			json: true,
		};

		try {
			const response = await this.helpers.httpRequest(
				requestOptions as unknown as IHttpRequestOptions,
			);
			return response;
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : String(error);
			throw new NodeOperationError(
				this.getNode(),
				`Failed to fetch day closing till date: ${message}`,
			);
		}
	}

	// CREATE Day Closings Till Date
	if (operation === 'createDayClosingsTillDate') {
		const tillDate = this.getNodeParameter('tillDate', i, '') as string;
		const employeeIdsJson = this.getNodeParameter('employeeIdsJson', i, '[]') as string;

		if (!tillDate) throw new NodeOperationError(this.getNode(), 'tillDate is required.');
		let employeeIds: unknown;
		try {
			employeeIds = JSON.parse(employeeIdsJson);
		} catch {
			throw new NodeOperationError(this.getNode(), 'employeeIdsJson must be valid JSON array.');
		}
		if (!Array.isArray(employeeIds))
			throw new NodeOperationError(this.getNode(), 'employeeIdsJson must be an array of integers.');

		const url = `${baseURL}/backend/api/v1/timestamps/dayClosing/tillDate`;
		const requestOptions: IDataObject = {
			method: 'POST',
			url,
			headers: { apiToken, 'Content-Type': 'application/json' },
			body: { tillDate, employeeIds: employeeIds as number[] },
			json: true,
		};

		try {
			const response = await this.helpers.httpRequest(
				requestOptions as unknown as import('n8n-workflow').IHttpRequestOptions,
			);
			return response;
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : String(error);
			throw new NodeOperationError(
				this.getNode(),
				`Failed to create day closings till date: ${message}`,
			);
		}
	}

	// SET initial balance
	if (operation === 'setInitialBalance') {
		const employeeIdInitial = this.getNodeParameter('employeeIdInitial', i, 0) as number;
		const initialBalance = this.getNodeParameter('initialBalance', i, 0) as number;

		if (!employeeIdInitial || employeeIdInitial <= 0)
			throw new NodeOperationError(this.getNode(), 'Valid employeeId is required.');
		if (typeof initialBalance !== 'number')
			throw new NodeOperationError(this.getNode(), 'initialBalance must be a number.');

		const url = `${baseURL}/backend/api/v1/timestamps/employee/${employeeIdInitial}/initialBalance`;
		const requestOptions: IDataObject = {
			method: 'POST',
			url,
			headers: { apiToken, 'Content-Type': 'application/json' },
			body: { balance: initialBalance },
			json: true,
		};

		try {
			const response = await this.helpers.httpRequest(
				requestOptions as unknown as import('n8n-workflow').IHttpRequestOptions,
			);
			return response;
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : String(error);
			throw new NodeOperationError(this.getNode(), `Failed to set initial balance: ${message}`);
		}
	}

	// GET pause configs
	if (operation === 'getPauseConfigs') {
		const url = `${baseURL}/backend/api/v1/timestamps/pauseConfigs`;
		const requestOptions: IDataObject = {
			method: 'GET',
			url,
			headers: { apiToken, 'Content-Type': 'application/json' },
			json: true,
		};

		try {
			const response = await this.helpers.httpRequest(
				requestOptions as unknown as import('n8n-workflow').IHttpRequestOptions,
			);
			return response;
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : String(error);
			throw new NodeOperationError(this.getNode(), `Failed to fetch pause configs: ${message}`);
		}
	}

	// CREATE pause config
	if (operation === 'createPauseConfig') {
		const fromMinutes = this.getNodeParameter('fromMinutes', i, 0) as number;
		const minimumPause = this.getNodeParameter('minimumPause', i, 0) as number;

		if (typeof fromMinutes !== 'number')
			throw new NodeOperationError(this.getNode(), 'fromMinutes must be a number.');
		if (typeof minimumPause !== 'number')
			throw new NodeOperationError(this.getNode(), 'minimumPause must be a number.');

		const url = `${baseURL}/backend/api/v1/timestamps/pauseConfigs`;
		const requestOptions: IDataObject = {
			method: 'POST',
			url,
			headers: { apiToken, 'Content-Type': 'application/json' },
			body: { fromMinutes, minimumPause },
			json: true,
		};

		try {
			const response = await this.helpers.httpRequest(
				requestOptions as unknown as import('n8n-workflow').IHttpRequestOptions,
			);
			return response;
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : String(error);
			throw new NodeOperationError(this.getNode(), `Failed to create pause config: ${message}`);
		}
	}

	// UPDATE pause config
	if (operation === 'updatePauseConfig') {
		const pauseConfigId = this.getNodeParameter('pauseConfigId', i, 0) as number;
		const fromMinutes = this.getNodeParameter('fromMinutes', i, 0) as number;
		const minimumPause = this.getNodeParameter('minimumPause', i, 0) as number;

		if (!pauseConfigId || pauseConfigId <= 0)
			throw new NodeOperationError(this.getNode(), 'Valid pauseConfigId is required.');
		if (typeof fromMinutes !== 'number')
			throw new NodeOperationError(this.getNode(), 'fromMinutes must be a number.');
		if (typeof minimumPause !== 'number')
			throw new NodeOperationError(this.getNode(), 'minimumPause must be a number.');

		const url = `${baseURL}/backend/api/v1/timestamps/pauseConfigs/${pauseConfigId}`;
		const requestOptions: IDataObject = {
			method: 'PUT',
			url,
			headers: { apiToken, 'Content-Type': 'application/json' },
			body: { fromMinutes, minimumPause },
			json: true,
		};

		try {
			const response = await this.helpers.httpRequest(
				requestOptions as unknown as import('n8n-workflow').IHttpRequestOptions,
			);
			return response;
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : String(error);
			throw new NodeOperationError(this.getNode(), `Failed to update pause config: ${message}`);
		}
	}

	// DELETE pause config
	if (operation === 'deletePauseConfig') {
		const pauseConfigId = this.getNodeParameter('pauseConfigId', i, 0) as number;
		if (!pauseConfigId || pauseConfigId <= 0)
			throw new NodeOperationError(this.getNode(), 'Valid pauseConfigId is required.');

		const url = `${baseURL}/backend/api/v1/timestamps/pauseConfigs/${pauseConfigId}`;
		const requestOptions: IDataObject = {
			method: 'DELETE',
			url,
			headers: { apiToken, 'Content-Type': 'application/json' },
			json: true,
		};

		try {
			const response = await this.helpers.httpRequest(
				requestOptions as unknown as import('n8n-workflow').IHttpRequestOptions,
			);
			return response;
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : String(error);
			throw new NodeOperationError(this.getNode(), `Failed to delete pause config: ${message}`);
		}
	}

	throw new NodeOperationError(this.getNode(), 'Unhandled operation');
}
