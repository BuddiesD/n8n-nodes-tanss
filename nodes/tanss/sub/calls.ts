import { IExecuteFunctions, INodeProperties, NodeOperationError, IDataObject } from 'n8n-workflow';

export const callsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options' as const,
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['calls'],
			},
		},
		options: [
			{
				name: 'Create / Import Call',
				value: 'createCall',
				description: 'Creates/imports a phone call into the database',
				action: 'Create call',
			},
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
				name: 'Update Phone Call',
				value: 'updateCall',
				description: 'Updates an existing phone call by ID',
				action: 'Update call',
			},
			{
				name: 'Identify Phone Call',
				value: 'identifyCall',
				description: 'Identifies a phone call and resolves company / employee IDs',
				action: 'Identify call',
			},
			{
				name: 'Get All Employee Assignments',
				value: 'getEmployeeAssignments',
				description: 'Get all assignments between idStrings and TANSS employees',
				action: 'Get employee assignments',
			},
			{
				name: 'Create Employee Assignment',
				value: 'createEmployeeAssignment',
				description: 'Creates a new assignment between an idString and a TANSS employee',
				action: 'Create employee assignment',
			},
			{
				name: 'Delete Employee Assignment',
				value: 'deleteEmployeeAssignment',
				description: 'Deletes an assignment between an idString and a TANSS employee',
				action: 'Delete employee assignment',
			},
			{
				name: 'Creates a Call Notification',
				value: 'createNotification',
				description: 'Generates a notification (popup) for an incoming or outgoing call',
				action: 'Create call notification',
			},
		],
		default: 'createCall',
	},
];

export const callsFields: INodeProperties[] = [
	{
		displayName: 'API Token',
		name: 'apiToken',
		type: 'string' as const,
		required: true,
		typeOptions: { password: true },
		default: '',
		description: 'API token obtained from the TANSS web interface (must be generated in TANSS)',
		displayOptions: {
			show: {
				resource: ['calls'],
			},
		},
	},
	{
		displayName: 'Use Raw Call JSON (Optional)',
		name: 'callJson',
		type: 'string' as const,
		default: '',
		description:
			'If provided (valid JSON), this object will be posted as-is. Otherwise the fields below / collection are used to build the payload.',
		displayOptions: {
			show: {
				resource: ['calls'],
				operation: ['createCall', 'updateCall'],
			},
		},
	},

	{
		displayName: 'Use Raw Notification JSON (Optional)',
		name: 'notificationJson',
		type: 'string' as const,
		default: '',
		description: 'If provided (valid JSON), this object will be posted as-is',
		displayOptions: {
			show: {
				resource: ['calls'],
				operation: ['createNotification'],
			},
		},
	},
	{
		displayName: 'Notification Fields',
		name: 'notificationFields',
		type: 'collection' as const,
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: ['calls'],
				operation: ['createNotification'],
			},
		},
		default: {},
		options: [
			{ displayName: 'ID', name: 'id', type: 'number' as const, default: 0 },
			{ displayName: 'callId', name: 'callId', type: 'string' as const, default: '' },
			{
				displayName: 'telephoneSystemId',
				name: 'telephoneSystemId',
				type: 'number' as const,
				default: 0,
			},
			{ displayName: 'Date (Timestamp)', name: 'date', type: 'number' as const, default: 0 },
			{
				displayName: 'From Phone Number',
				name: 'fromPhoneNumber',
				type: 'string' as const,
				default: '',
			},
			{
				displayName: 'fromPhoneNrInfos (JSON)',
				name: 'fromPhoneNrInfos',
				type: 'string' as const,
				default: '',
				description: 'Optional JSON object',
			},
			{
				displayName: 'To Phone Number',
				name: 'toPhoneNumber',
				type: 'string' as const,
				default: '',
			},
			{
				displayName: 'toPhoneNrInfos (JSON)',
				name: 'toPhoneNrInfos',
				type: 'string' as const,
				default: '',
				description: 'Optional JSON object',
			},
			{
				displayName: 'Direction',
				name: 'direction',
				type: 'options' as const,
				options: [
					{ name: 'INTERNAL', value: 'INTERNAL' },
					{ name: 'INCOMING', value: 'INCOMING' },
					{ name: 'OUTGOING', value: 'OUTGOING' },
				],
				default: 'INTERNAL',
			},
			{
				displayName: 'connectionEstablished',
				name: 'connectionEstablished',
				type: 'boolean' as const,
				default: false,
			},
			{
				displayName: 'durationTotal (Seconds)',
				name: 'durationTotal',
				type: 'number' as const,
				default: 0,
			},
			{
				displayName: 'durationCall (Seconds)',
				name: 'durationCall',
				type: 'number' as const,
				default: 0,
			},
			{ displayName: 'Group', name: 'group', type: 'string' as const, default: '' },
			{
				displayName: 'Phone Participants JSON',
				name: 'phoneParticipantsJson',
				type: 'string' as const,
				default: '',
				description: 'JSON array of phone participant objects. If provided, this will be used.',
			},
			{
				displayName: 'Phone Participants (Collection)',
				name: 'phoneParticipants',
				type: 'fixedCollection' as const,
				placeholder: 'Add participant',
				typeOptions: { multipleValues: true },
				default: {},
				options: [
					{
						displayName: 'Participant',
						name: 'participant',
						values: [
							{
								displayName: 'phoneCallId',
								name: 'phoneCallId',
								type: 'number' as const,
								default: 0,
							},
							{ displayName: 'idString', name: 'idString', type: 'string' as const, default: '' },
							{
								displayName: 'employeeId',
								name: 'employeeId',
								type: 'number' as const,
								default: 0,
							},
						],
					},
				],
			},
		],
	},

	{
		displayName: 'Use Raw Filter JSON (Optional)',
		name: 'filterJson',
		type: 'string' as const,
		default: '',
		description:
			'If provided (valid JSON), this object will be sent as the request body for the list call',
		displayOptions: {
			show: {
				resource: ['calls'],
				operation: ['getCalls'],
			},
		},
	},

	{
		displayName: 'Filter Settings',
		name: 'getCallsFilters',
		type: 'collection' as const,
		placeholder: 'Add Filter',
		displayOptions: {
			show: {
				resource: ['calls'],
				operation: ['getCalls'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Timeframe From (Timestamp)',
				name: 'timeFrom',
				type: 'number' as const,
				default: 0,
				description: 'Unix timestamp of the "from" date',
			},
			{
				displayName: 'Timeframe To (Timestamp)',
				name: 'timeTo',
				type: 'number' as const,
				default: 0,
				description: 'Unix timestamp of the "to" date',
			},
			{
				displayName: 'Show Tries As Well',
				name: 'showTrysAsWell',
				type: 'boolean' as const,
				default: false,
				description: 'If true, include calls without established connection',
			},
			{
				displayName: 'Number Filters (Comma Separated)',
				name: 'numberFilters',
				type: 'string' as const,
				default: '',
				description: 'One or more telephone number filters, comma-separated',
			},
			{
				displayName: 'Employee ID',
				name: 'employeeIdFilter',
				type: 'number' as const,
				default: 0,
				description: 'Only show phone calls of this employee',
			},
			{
				displayName: 'Company ID',
				name: 'companyIdFilter',
				type: 'number' as const,
				default: 0,
				description: 'Only show phone calls of this company',
			},
			{
				displayName: 'Number Infos',
				name: 'numberInfos',
				type: 'boolean' as const,
				default: false,
				description: 'If true, fromPhoneNrInfos and toPhoneNrInfos will be determined',
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
				description: 'Filter by call directions',
			},
		],
	},

	{
		displayName: 'Phone Call ID',
		name: 'phoneCallId',
		type: 'number' as const,
		default: 0,
		description: 'ID of the phone call to fetch/update',
		displayOptions: {
			show: {
				resource: ['calls'],
				operation: ['getCallById', 'updateCall'],
			},
		},
	},
	{
		displayName: 'Use Raw Identify JSON (Optional)',
		name: 'identifyJson',
		type: 'string' as const,
		default: '',
		description: 'If provided (valid JSON), this object will be posted as-is to identify endpoint',
		displayOptions: {
			show: {
				resource: ['calls'],
				operation: ['identifyCall'],
			},
		},
	},
	{
		displayName: 'Identify Fields',
		name: 'identifyFields',
		type: 'collection' as const,
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: ['calls'],
				operation: ['identifyCall'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'From Phone Number',
				name: 'fromPhoneNumber',
				type: 'string' as const,
				default: '',
				description: 'Phone number of the caller',
			},
			{
				displayName: 'To Phone Number',
				name: 'toPhoneNumber',
				type: 'string' as const,
				default: '',
				description: 'Phone number of the called party',
			},
		],
	},

	{
		displayName: 'Use Raw Employee Assignment JSON (Optional)',
		name: 'employeeAssignmentJson',
		type: 'string' as const,
		default: '',
		description:
			'If provided (valid JSON), this object will be posted as-is to employeeAssignment endpoints',
		displayOptions: {
			show: {
				resource: ['calls'],
				operation: ['createEmployeeAssignment', 'deleteEmployeeAssignment'],
			},
		},
	},
	{
		displayName: 'Employee Assignment Fields',
		name: 'employeeAssignmentFields',
		type: 'collection' as const,
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: ['calls'],
				operation: ['createEmployeeAssignment', 'deleteEmployeeAssignment'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Employee ID',
				name: 'employeeId',
				type: 'number' as const,
				default: 0,
				description: 'ID of the TANSS employee',
			},
			{
				displayName: 'Username / idString',
				name: 'username',
				type: 'string' as const,
				default: '',
				description: 'Identifier string of the employee (idString)',
			},
		],
	},
	{
		displayName: 'Create Call Fields',
		name: 'createCallFields',
		type: 'collection' as const,
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: ['calls'],
				operation: ['createCall', 'updateCall'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Date (Timestamp)',
				name: 'date',
				type: 'number' as const,
				default: 0,
				description: 'Unix timestamp representing the begin of the phone call',
			},
			{
				displayName: 'fromPhoneNumber',
				name: 'fromPhoneNumber',
				type: 'string' as const,
				default: '',
				description: 'Phone number (or identifier) of the caller',
			},
			{
				displayName: 'toPhoneNumber',
				name: 'toPhoneNumber',
				type: 'string' as const,
				default: '',
				description: 'Phone number (or identifier) of the called party',
			},
			{
				displayName: 'Direction',
				name: 'direction',
				type: 'options' as const,
				options: [
					{ name: 'INTERNAL', value: 'INTERNAL' },
					{ name: 'INCOMING', value: 'INCOMING' },
					{ name: 'OUTGOING', value: 'OUTGOING' },
				],
				default: 'INTERNAL',
				description: 'Defines the direction of the call',
			},
			{
				displayName: 'callId',
				name: 'callId',
				type: 'string' as const,
				default: '',
				description: 'External ID of the phone call',
			},
			{
				displayName: 'telephoneSystemId',
				name: 'telephoneSystemId',
				type: 'number' as const,
				default: 0,
			},
			{ displayName: 'fromCompanyId', name: 'fromCompanyId', type: 'number' as const, default: 0 },
			{
				displayName: 'fromCompanyPercent',
				name: 'fromCompanyPercent',
				type: 'number' as const,
				default: 0,
			},
			{
				displayName: 'fromEmployeeId',
				name: 'fromEmployeeId',
				type: 'number' as const,
				default: 0,
			},
			{ displayName: 'toCompanyId', name: 'toCompanyId', type: 'number' as const, default: 0 },
			{
				displayName: 'toCompanyPercent',
				name: 'toCompanyPercent',
				type: 'number' as const,
				default: 0,
			},
			{ displayName: 'toEmployeeId', name: 'toEmployeeId', type: 'number' as const, default: 0 },
			{
				displayName: 'connectionEstablished',
				name: 'connectionEstablished',
				type: 'boolean' as const,
				default: false,
			},
			{
				displayName: 'durationTotal (Seconds)',
				name: 'durationTotal',
				type: 'number' as const,
				default: 0,
			},
			{
				displayName: 'durationCall (Seconds)',
				name: 'durationCall',
				type: 'number' as const,
				default: 0,
			},
			{ displayName: 'Group', name: 'group', type: 'string' as const, default: '' },
			{
				displayName: 'numberIdentifyState',
				name: 'numberIdentifyState',
				type: 'string' as const,
				default: '',
			},

			{
				displayName: 'Phone Participants JSON',
				name: 'phoneParticipantsJson',
				type: 'string' as const,
				default: '',
				description: 'JSON array of phone participant objects. If provided, this will be used.',
			},
			{
				displayName: 'Phone Participants (Collection)',
				name: 'phoneParticipants',
				type: 'fixedCollection' as const,
				placeholder: 'Add participant',
				typeOptions: { multipleValues: true },
				default: {},
				options: [
					{
						displayName: 'Participant',
						name: 'participant',
						values: [
							{ displayName: 'idString', name: 'idString', type: 'string' as const, default: '' },
							{
								displayName: 'employeeId',
								name: 'employeeId',
								type: 'number' as const,
								default: 0,
							},
						],
					},
				],
			},
		],
	},
];

export async function handleCalls(this: IExecuteFunctions, i: number) {
	const operation = this.getNodeParameter('operation', i) as string;

	const credentials = await this.getCredentials('tanssApi');
	if (!credentials) throw new NodeOperationError(this.getNode(), 'No credentials returned!');
	const apiToken = this.getNodeParameter('apiToken', i, '') as string;
	const typedCredentials = credentials as { baseURL?: string };
	const baseURL = typedCredentials.baseURL;
	if (!baseURL) throw new NodeOperationError(this.getNode(), 'No baseURL in credentials');

	if (operation === 'createCall') {
		const callJson = this.getNodeParameter('callJson', i, '') as string;

		let body: IDataObject = {};

		// Priority: callJson (raw) > createCallFields collection > individual fields
		if (callJson && callJson.trim() !== '') {
			try {
				const parsed = JSON.parse(callJson);
				if (typeof parsed !== 'object' || parsed === null) {
					throw new Error('callJson must be an object');
				}
				body = parsed as IDataObject;
			} catch {
				throw new NodeOperationError(this.getNode(), 'callJson must be valid JSON object.');
			}
		} else {
			const createCallFields = this.getNodeParameter('createCallFields', i, {}) as IDataObject;
			if (createCallFields && Object.keys(createCallFields).length > 0) {
				Object.assign(body, createCallFields);

				if (
					createCallFields.phoneParticipants &&
					typeof createCallFields.phoneParticipants === 'object' &&
					'participant' in (createCallFields.phoneParticipants as Record<string, unknown>)
				) {
					const parts = (createCallFields.phoneParticipants as Record<string, unknown>)
						.participant as unknown as Array<{ idString?: string; employeeId?: number }>;
					const list = parts.map((p) => {
						const obj: IDataObject = {};
						if (p.idString) obj.idString = p.idString;
						if (p.employeeId && p.employeeId > 0) obj.employeeId = p.employeeId;
						return obj;
					});
					body.phoneParticipants = list;
				}

				if (
					createCallFields.phoneParticipantsJson &&
					typeof createCallFields.phoneParticipantsJson === 'string' &&
					createCallFields.phoneParticipantsJson.trim() !== ''
				) {
					try {
						const parsed = JSON.parse(createCallFields.phoneParticipantsJson as string);
						if (Array.isArray(parsed)) body.phoneParticipants = parsed;
					} catch {
						throw new NodeOperationError(
							this.getNode(),
							'createCallFields.phoneParticipantsJson must be valid JSON array.',
						);
					}
				}
			} else {
				const optionalString = (name: string) => {
					const v = this.getNodeParameter(name, i, '') as string;
					return v === '' ? undefined : v;
				};
				const optionalNumber = (name: string) => {
					const v = this.getNodeParameter(name, i, 0) as number;
					return v === 0 ? undefined : v;
				};
				const optionalBoolean = (name: string) => {
					return this.getNodeParameter(name, i, false) as boolean;
				};

				const callId = optionalString('callId');
				const telephoneSystemId = optionalNumber('telephoneSystemId');
				const date = optionalNumber('date');
				const fromPhoneNumber = optionalString('fromPhoneNumber');
				const fromCompanyId = optionalNumber('fromCompanyId');
				const fromCompanyPercent = optionalNumber('fromCompanyPercent');
				const fromEmployeeId = optionalNumber('fromEmployeeId');
				const toPhoneNumber = optionalString('toPhoneNumber');
				const toCompanyId = optionalNumber('toCompanyId');
				const toCompanyPercent = optionalNumber('toCompanyPercent');
				const toEmployeeId = optionalNumber('toEmployeeId');
				const direction = this.getNodeParameter('direction', i, '') as string;
				const connectionEstablished = optionalBoolean('connectionEstablished');
				const durationTotal = optionalNumber('durationTotal');
				const durationCall = optionalNumber('durationCall');
				const group = optionalString('group');
				const numberIdentifyState = optionalString('numberIdentifyState');

				if (callId !== undefined) body.callId = callId;
				if (telephoneSystemId !== undefined) body.telephoneSystemId = telephoneSystemId;
				if (date !== undefined) body.date = date;
				if (fromPhoneNumber !== undefined) body.fromPhoneNumber = fromPhoneNumber;
				if (fromCompanyId !== undefined) body.fromCompanyId = fromCompanyId;
				if (fromCompanyPercent !== undefined) body.fromCompanyPercent = fromCompanyPercent;
				if (fromEmployeeId !== undefined) body.fromEmployeeId = fromEmployeeId;
				if (toPhoneNumber !== undefined) body.toPhoneNumber = toPhoneNumber;
				if (toCompanyId !== undefined) body.toCompanyId = toCompanyId;
				if (toCompanyPercent !== undefined) body.toCompanyPercent = toCompanyPercent;
				if (toEmployeeId !== undefined) body.toEmployeeId = toEmployeeId;
				if (direction) body.direction = direction;
				body.connectionEstablished = connectionEstablished;
				if (durationTotal !== undefined) body.durationTotal = durationTotal;
				if (durationCall !== undefined) body.durationCall = durationCall;
				if (group !== undefined) body.group = group;
				if (numberIdentifyState !== undefined) body.numberIdentifyState = numberIdentifyState;

				const participantsJson = this.getNodeParameter('phoneParticipantsJson', i, '') as string;
				if (participantsJson && participantsJson.trim() !== '') {
					try {
						const parsed = JSON.parse(participantsJson);
						if (!Array.isArray(parsed)) throw new Error('phoneParticipantsJson must be an array');
						body.phoneParticipants = parsed;
					} catch {
						throw new NodeOperationError(
							this.getNode(),
							'phoneParticipantsJson must be valid JSON array.',
						);
					}
				} else {
					const parts = this.getNodeParameter('phoneParticipants', i, { participant: [] }) as {
						participant?: Array<{ idString?: string; employeeId?: number }>;
					};
					const list = (parts.participant ?? [])
						.map((p) => {
							const obj: IDataObject = {};
							if (p.idString) obj.idString = p.idString;
							if (p.employeeId && p.employeeId > 0) obj.employeeId = p.employeeId;
							return obj;
						})
						.filter(Boolean);
					if (list.length) body.phoneParticipants = list;
				}
			}
		}

		const url = `${baseURL}/backend/api/calls/v1`;
		const requestOptions: IDataObject = {
			method: 'POST',
			url,
			headers: { apiToken, 'Content-Type': 'application/json' },
			body,
			json: true,
		};

		try {
			const response = await this.helpers.httpRequest(
				requestOptions as unknown as import('n8n-workflow').IHttpRequestOptions,
			);
			return response;
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : String(error);
			throw new NodeOperationError(this.getNode(), `Failed to create/import call: ${message}`);
		}
	}

	if (operation === 'getCalls') {
		const filterJson = this.getNodeParameter('filterJson', i, '') as string;
		let body: IDataObject = {};

		if (filterJson && filterJson.trim() !== '') {
			try {
				const parsed = JSON.parse(filterJson);
				if (typeof parsed !== 'object' || parsed === null) {
					throw new Error('filterJson must be an object');
				}
				body = parsed as IDataObject;
			} catch {
				throw new NodeOperationError(this.getNode(), 'filterJson must be valid JSON object.');
			}
		} else {
			const filters = this.getNodeParameter('getCallsFilters', i, {}) as IDataObject;

			const timeFrom = (filters.timeFrom as number) || 0;
			const timeTo = (filters.timeTo as number) || 0;
			if (timeFrom || timeTo) {
				const timeframe: IDataObject = {};
				if (timeFrom && timeFrom > 0) timeframe.from = timeFrom;
				if (timeTo && timeTo > 0) timeframe.to = timeTo;
				body.timeframe = timeframe;
			}

			if (filters.showTrysAsWell === true) body.showTrysAsWell = true;

			if (
				filters.numberFilters &&
				typeof filters.numberFilters === 'string' &&
				(filters.numberFilters as string).trim() !== ''
			) {
				const arr = (filters.numberFilters as string)
					.split(',')
					.map((s) => s.trim())
					.filter(Boolean);
				if (arr.length) body.numberFilters = arr;
			}

			if (
				filters.employeeIdFilter &&
				typeof filters.employeeIdFilter === 'number' &&
				filters.employeeIdFilter > 0
			)
				body.employeeId = filters.employeeIdFilter;
			if (
				filters.companyIdFilter &&
				typeof filters.companyIdFilter === 'number' &&
				filters.companyIdFilter > 0
			)
				body.companyId = filters.companyIdFilter;
			if (filters.numberInfos === true) body.numberInfos = true;

			if (
				filters.directions &&
				Array.isArray(filters.directions) &&
				(filters.directions as string[]).length
			) {
				body.directions = filters.directions;
			}
		}

		const url = `${baseURL}/backend/api/calls/v1`;
		const requestOptions: IDataObject = {
			method: 'PUT',
			url,
			headers: { apiToken, 'Content-Type': 'application/json' },
			body,
			json: true,
		};

		try {
			const response = await this.helpers.httpRequest(
				requestOptions as unknown as import('n8n-workflow').IHttpRequestOptions,
			);
			return response;
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : String(error);
			throw new NodeOperationError(this.getNode(), `Failed to fetch calls list: ${message}`);
		}
	}

	if (operation === 'getCallById') {
		const phoneCallId = this.getNodeParameter('phoneCallId', i, 0) as number;
		if (!phoneCallId || phoneCallId <= 0) {
			throw new NodeOperationError(this.getNode(), 'A valid Phone Call ID is required.');
		}

		const url = `${baseURL}/backend/api/calls/v1/${encodeURIComponent(String(phoneCallId))}`;
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
			throw new NodeOperationError(this.getNode(), `Failed to fetch phone call: ${message}`);
		}
	}

	if (operation === 'updateCall') {
		const phoneCallId = this.getNodeParameter('phoneCallId', i, 0) as number;
		if (!phoneCallId || phoneCallId <= 0) {
			throw new NodeOperationError(this.getNode(), 'A valid Phone Call ID is required for update.');
		}

		const callJson = this.getNodeParameter('callJson', i, '') as string;

		let body: IDataObject = {};

		if (callJson && callJson.trim() !== '') {
			try {
				const parsed = JSON.parse(callJson);
				if (typeof parsed !== 'object' || parsed === null) {
					throw new Error('callJson must be an object');
				}
				body = parsed as IDataObject;
			} catch {
				throw new NodeOperationError(this.getNode(), 'callJson must be valid JSON object.');
			}
		} else {
			const createCallFields = this.getNodeParameter('createCallFields', i, {}) as IDataObject;
			if (createCallFields && Object.keys(createCallFields).length > 0) {
				Object.assign(body, createCallFields);

				if (
					createCallFields.phoneParticipants &&
					typeof createCallFields.phoneParticipants === 'object' &&
					'participant' in (createCallFields.phoneParticipants as Record<string, unknown>)
				) {
					const parts = (createCallFields.phoneParticipants as Record<string, unknown>)
						.participant as unknown as Array<{ idString?: string; employeeId?: number }>;
					const list = parts.map((p) => {
						const obj: IDataObject = {};
						if (p.idString) obj.idString = p.idString;
						if (p.employeeId && p.employeeId > 0) obj.employeeId = p.employeeId;
						return obj;
					});
					body.phoneParticipants = list;
				}

				if (
					createCallFields.phoneParticipantsJson &&
					typeof createCallFields.phoneParticipantsJson === 'string' &&
					createCallFields.phoneParticipantsJson.trim() !== ''
				) {
					try {
						const parsed = JSON.parse(createCallFields.phoneParticipantsJson as string);
						if (Array.isArray(parsed)) body.phoneParticipants = parsed;
					} catch {
						throw new NodeOperationError(
							this.getNode(),
							'createCallFields.phoneParticipantsJson must be valid JSON array.',
						);
					}
				}
			} else {
				const optionalString = (name: string) => {
					const v = this.getNodeParameter(name, i, '') as string;
					return v === '' ? undefined : v;
				};
				const optionalNumber = (name: string) => {
					const v = this.getNodeParameter(name, i, 0) as number;
					return v === 0 ? undefined : v;
				};
				const optionalBoolean = (name: string) => {
					return this.getNodeParameter(name, i, false) as boolean;
				};

				const callId = optionalString('callId');
				const telephoneSystemId = optionalNumber('telephoneSystemId');
				const date = optionalNumber('date');
				const fromPhoneNumber = optionalString('fromPhoneNumber');
				const fromCompanyId = optionalNumber('fromCompanyId');
				const fromCompanyPercent = optionalNumber('fromCompanyPercent');
				const fromEmployeeId = optionalNumber('fromEmployeeId');
				const toPhoneNumber = optionalString('toPhoneNumber');
				const toCompanyId = optionalNumber('toCompanyId');
				const toCompanyPercent = optionalNumber('toCompanyPercent');
				const toEmployeeId = optionalNumber('toEmployeeId');
				const direction = this.getNodeParameter('direction', i, '') as string;
				const connectionEstablished = optionalBoolean('connectionEstablished');
				const durationTotal = optionalNumber('durationTotal');
				const durationCall = optionalNumber('durationCall');
				const group = optionalString('group');
				const numberIdentifyState = optionalString('numberIdentifyState');

				if (callId !== undefined) body.callId = callId;
				if (telephoneSystemId !== undefined) body.telephoneSystemId = telephoneSystemId;
				if (date !== undefined) body.date = date;
				if (fromPhoneNumber !== undefined) body.fromPhoneNumber = fromPhoneNumber;
				if (fromCompanyId !== undefined) body.fromCompanyId = fromCompanyId;
				if (fromCompanyPercent !== undefined) body.fromCompanyPercent = fromCompanyPercent;
				if (fromEmployeeId !== undefined) body.fromEmployeeId = fromEmployeeId;
				if (toPhoneNumber !== undefined) body.toPhoneNumber = toPhoneNumber;
				if (toCompanyId !== undefined) body.toCompanyId = toCompanyId;
				if (toCompanyPercent !== undefined) body.toCompanyPercent = toCompanyPercent;
				if (toEmployeeId !== undefined) body.toEmployeeId = toEmployeeId;
				if (direction) body.direction = direction;
				body.connectionEstablished = connectionEstablished;
				if (durationTotal !== undefined) body.durationTotal = durationTotal;
				if (durationCall !== undefined) body.durationCall = durationCall;
				if (group !== undefined) body.group = group;
				if (numberIdentifyState !== undefined) body.numberIdentifyState = numberIdentifyState;

				const participantsJson = this.getNodeParameter('phoneParticipantsJson', i, '') as string;
				if (participantsJson && participantsJson.trim() !== '') {
					try {
						const parsed = JSON.parse(participantsJson);
						if (!Array.isArray(parsed)) throw new Error('phoneParticipantsJson must be an array');
						body.phoneParticipants = parsed;
					} catch {
						throw new NodeOperationError(
							this.getNode(),
							'phoneParticipantsJson must be valid JSON array.',
						);
					}
				} else {
					const parts = this.getNodeParameter('phoneParticipants', i, { participant: [] }) as {
						participant?: Array<{ idString?: string; employeeId?: number }>;
					};
					const list = (parts.participant ?? [])
						.map((p) => {
							const obj: IDataObject = {};
							if (p.idString) obj.idString = p.idString;
							if (p.employeeId && p.employeeId > 0) obj.employeeId = p.employeeId;
							return obj;
						})
						.filter(Boolean);
					if (list.length) body.phoneParticipants = list;
				}
			}
		}

		const url = `${baseURL}/backend/api/calls/v1/${encodeURIComponent(String(phoneCallId))}`;
		const requestOptions: IDataObject = {
			method: 'PUT',
			url,
			headers: { apiToken, 'Content-Type': 'application/json' },
			body,
			json: true,
		};

		try {
			const response = await this.helpers.httpRequest(
				requestOptions as unknown as import('n8n-workflow').IHttpRequestOptions,
			);
			return response;
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : String(error);
			throw new NodeOperationError(this.getNode(), `Failed to update phone call: ${message}`);
		}
	}

	if (operation === 'identifyCall') {
		const identifyJson = this.getNodeParameter('identifyJson', i, '') as string;
		let body: IDataObject = {};

		if (identifyJson && identifyJson.trim() !== '') {
			try {
				const parsed = JSON.parse(identifyJson);
				if (typeof parsed !== 'object' || parsed === null)
					throw new Error('identifyJson must be an object');
				body = parsed as IDataObject;
			} catch {
				throw new NodeOperationError(this.getNode(), 'identifyJson must be valid JSON object.');
			}
		} else {
			const identifyFields = this.getNodeParameter('identifyFields', i, {}) as IDataObject;
			const from = (identifyFields.fromPhoneNumber as string) || '';
			const to = (identifyFields.toPhoneNumber as string) || '';
			if (!from || !to) {
				throw new NodeOperationError(
					this.getNode(),
					'Both From Phone Number and To Phone Number are required to identify a call.',
				);
			}
			body.fromPhoneNumber = from;
			body.toPhoneNumber = to;
		}

		const url = `${baseURL}/backend/api/calls/v1/identify`;
		const requestOptions: IDataObject = {
			method: 'POST',
			url,
			headers: { apiToken, 'Content-Type': 'application/json' },
			body,
			json: true,
		};

		try {
			const response = await this.helpers.httpRequest(
				requestOptions as unknown as import('n8n-workflow').IHttpRequestOptions,
			);
			return response;
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : String(error);
			throw new NodeOperationError(this.getNode(), `Failed to identify phone call: ${message}`);
		}
	}

	if (operation === 'getEmployeeAssignments') {
		const url = `${baseURL}/backend/api/calls/v1/employeeAssignment`;
		const requestOptions: IDataObject = {
			method: 'GET',
			url,
			headers: {
				apiToken,
				Authorization: `Bearer ${apiToken}`,
				Accept: 'application/json',
			},
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
				`Failed to fetch employee assignments: ${message}`,
			);
		}
	}

	if (operation === 'createEmployeeAssignment') {
		const raw = this.getNodeParameter('employeeAssignmentJson', i, '') as string;
		let body: IDataObject = {};

		if (raw && raw.trim() !== '') {
			try {
				const parsed = JSON.parse(raw);
				if (typeof parsed !== 'object' || parsed === null)
					throw new Error('employeeAssignmentJson must be an object');
				body = parsed as IDataObject;
			} catch {
				throw new NodeOperationError(
					this.getNode(),
					'employeeAssignmentJson must be valid JSON object.',
				);
			}
		} else {
			const fields = this.getNodeParameter('employeeAssignmentFields', i, {}) as IDataObject;
			const employeeId = (fields.employeeId as number) || 0;
			const username = (fields.username as string) || '';
			if (!employeeId || employeeId <= 0)
				throw new NodeOperationError(
					this.getNode(),
					'Employee ID is required for creating assignment.',
				);
			if (!username)
				throw new NodeOperationError(
					this.getNode(),
					'Username (idString) is required for creating assignment.',
				);
			body.employeeId = employeeId;
			body.username = username;
		}

		const url = `${baseURL}/backend/api/calls/v1/employeeAssignment`;
		const requestOptions: IDataObject = {
			method: 'POST',
			url,
			headers: { apiToken, 'Content-Type': 'application/json' },
			body,
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
				`Failed to create employee assignment: ${message}`,
			);
		}
	}

	if (operation === 'deleteEmployeeAssignment') {
		const raw = this.getNodeParameter('employeeAssignmentJson', i, '') as string;
		let body: IDataObject = {};

		if (raw && raw.trim() !== '') {
			try {
				const parsed = JSON.parse(raw);
				if (typeof parsed !== 'object' || parsed === null)
					throw new Error('employeeAssignmentJson must be an object');
				body = parsed as IDataObject;
			} catch {
				throw new NodeOperationError(
					this.getNode(),
					'employeeAssignmentJson must be valid JSON object.',
				);
			}
		} else {
			const fields = this.getNodeParameter('employeeAssignmentFields', i, {}) as IDataObject;
			const employeeId = (fields.employeeId as number) || 0;
			const username = (fields.username as string) || '';
			if (!employeeId || employeeId <= 0)
				throw new NodeOperationError(
					this.getNode(),
					'Employee ID is required for deleting assignment.',
				);
			if (!username)
				throw new NodeOperationError(
					this.getNode(),
					'Username (idString) is required for deleting assignment.',
				);
			body.employeeId = employeeId;
			body.username = username;
		}

		const url = `${baseURL}/backend/api/calls/v1/employeeAssignment`;
		const requestOptions: IDataObject = {
			method: 'DELETE',
			url,
			headers: { apiToken, 'Content-Type': 'application/json' },
			body,
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
				`Failed to delete employee assignment: ${message}`,
			);
		}
	}

	throw new NodeOperationError(this.getNode(), `Operation "${operation}" not supported by Calls.`);
}
