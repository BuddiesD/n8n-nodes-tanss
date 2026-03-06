import { IExecuteFunctions, INodeProperties, NodeOperationError } from 'n8n-workflow';

export const peripheryOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options' as const,
		noDataExpression: true,
		displayOptions: { show: { resource: ['peripheries'] } },
		options: [
			{ name: 'Get Periphery', value: 'getPeriphery', description: 'Fetches a periphery by ID', action: 'Get periphery' },
			{ name: 'List Peripheries', value: 'listPeripheries', description: 'Gets a list of peripheries with filters', action: 'List peripheries' },
			{ name: 'Get Periphery Types', value: 'getPeripheryTypes', description: 'Gets a list of all periphery types', action: 'Get periphery types' },
			{ name: 'Create Periphery Type', value: 'createPeripheryType', description: 'Creates a new periphery type', action: 'Create periphery type' },
			{ name: 'Update Periphery Type', value: 'updatePeripheryType', description: 'Updates a periphery type', action: 'Update periphery type' },
			{ name: 'Delete Periphery Type', value: 'deletePeripheryType', description: 'Deletes a periphery type', action: 'Delete periphery type' },
			{
				name: 'Assign Periphery',
				value: 'assignPeriphery',
				description: 'Assigns a periphery to another pc or periphery',
				action: 'Assign periphery',
			},
			{
				name: 'Delete Periphery Assignment',
				value: 'deletePeripheryAssignment',
				description: 'Deletes a periphery assignment to another pc or periphery',
				action: 'Delete periphery assignment',
			},
			{ name: 'Update Periphery', value: 'updatePeriphery', description: 'Updates a periphery', action: 'Update periphery' },
			{ name: 'Create Periphery', value: 'createPeriphery', description: 'Creates a periphery', action: 'Create periphery' },
			{ name: 'Delete Periphery', value: 'deletePeriphery', description: 'Deletes a periphery', action: 'Delete periphery' },
		],
		default: 'getPeriphery',
	},
	{
		displayName: 'Periphery Type ID',
		name: 'peripheryTypeIdParam',
		type: 'number' as const,
		default: 0,
		displayOptions: { show: { resource: ['peripheries'], operation: ['updatePeripheryType', 'deletePeripheryType'] } },
		description: 'ID of the periphery type to update (path param)',
	},
	{
		displayName: 'Create Periphery Type Fields',
		name: 'createPeripheryTypeFields',
		type: 'collection' as const,
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['peripheries'], operation: ['createPeripheryType'] } },
		options: [
			{ displayName: 'ID', name: 'id', type: 'number' as const, default: 0 },
			{ displayName: 'Name', name: 'name', type: 'string' as const, default: '' },
			{ displayName: 'Image', name: 'image', type: 'string' as const, default: '' },
		],
	},
	{
		displayName: 'Update Periphery Type Fields',
		name: 'updatePeripheryTypeFields',
		type: 'collection' as const,
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['peripheries'], operation: ['updatePeripheryType'] } },
		options: [
			{ displayName: 'ID', name: 'id', type: 'number' as const, default: 0 },
			{ displayName: 'Name', name: 'name', type: 'string' as const, default: '' },
			{ displayName: 'Image', name: 'image', type: 'string' as const, default: '' },
		],
	},
	{
		displayName: 'Assignment Target',
		name: 'assignmentParams',
		type: 'collection' as const,
		placeholder: 'Add Params',
		default: {},
		displayOptions: { show: { resource: ['peripheries'], operation: ['assignPeriphery', 'deletePeripheryAssignment'] } },
		options: [
			{ displayName: 'Periphery ID', name: 'peripheryId', type: 'number' as const, default: 0, description: 'ID of the periphery to (de)assign' },
			{ displayName: 'linkTypeId', name: 'linkTypeId', type: 'number' as const, default: 0, description: 'Link type of the target (e.g. 1 = pc)' },
			{ displayName: 'linkId', name: 'linkId', type: 'number' as const, default: 0, description: 'Link ID of the target (e.g. PC ID)' },
		],
	},
];

type PeripheryServiceAssignment = { serviceId?: number };

type PeripheryIpField = {
	ip?: string;
	mac?: string;
	remark?: string;
	dhcp?: boolean;
	id?: number;
	assignmentType?: string;
	assignmentId?: number;
	serviceAssignments?: { service?: PeripheryServiceAssignment[] };
};

type PeripheryBodyInput = Record<string, unknown> & {
	fields?: { field?: Record<string, unknown>[] };
	ips?: { ipFields?: PeripheryIpField[] };
	guarantee?: Record<string, unknown>;
	peripheryTypeId?: number | null;
};

type AssignmentParams = {
	peripheryId?: number;
	linkTypeId?: number;
	linkId?: number;
};

export const peripheryFields: INodeProperties[] = [
	{
		displayName: 'API Token',
		name: 'apiToken',
		type: 'string' as const,
		required: true,
		typeOptions: { password: true },
		default: '',
		description: 'API token obtained from the TANSS API login',
		displayOptions: { show: { resource: ['peripheries'] } },
	},
	{
		displayName: 'Periphery ID',
		name: 'peripheryId',
		type: 'number' as const,
		default: 0,
		displayOptions: { show: { resource: ['peripheries'], operation: ['getPeriphery', 'updatePeriphery', 'deletePeriphery'] } },
		description: 'ID of the periphery',
	},
	{
		displayName: 'Create Periphery Fields',
		name: 'createPeripheryFields',
		type: 'collection' as const,
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['peripheries'], operation: ['createPeriphery'] } },
		options: [
			{ displayName: 'ID', name: 'id', type: 'number' as const, default: 0 },
			{ displayName: 'companyId', name: 'companyId', type: 'number' as const, default: 0 },
			{ displayName: 'Date (Timestamp)', name: 'date', type: 'number' as const, default: 0 },
			{ displayName: 'peripheryTypeId', name: 'peripheryTypeId', type: 'number' as const, default: 0 },
			{ displayName: 'manufacturerId', name: 'manufacturerId', type: 'number' as const, default: 0 },
			{ displayName: 'Type', name: 'type', type: 'string' as const, default: '' },
			{ displayName: 'Location', name: 'location', type: 'string' as const, default: '' },
			{ displayName: 'Remark', name: 'remark', type: 'string' as const, default: '' },
			{ displayName: 'internalRemark', name: 'internalRemark', type: 'string' as const, default: '' },
			{ displayName: 'serialNumber', name: 'serialNumber', type: 'string' as const, default: '' },
			{ displayName: 'inventoryNumber', name: 'inventoryNumber', type: 'string' as const, default: '' },
			{ displayName: 'Version', name: 'version', type: 'string' as const, default: '' },
			{ displayName: 'Active', name: 'active', type: 'boolean' as const, default: true },
			{ displayName: 'employeeId', name: 'employeeId', type: 'number' as const, default: 0 },
			{ displayName: 'pcId', name: 'pcId', type: 'number' as const, default: 0 },
			{ displayName: 'billingNumber', name: 'billingNumber', type: 'string' as const, default: '' },
			{ displayName: 'articleNumber', name: 'articleNumber', type: 'string' as const, default: '' },
			{ displayName: 'storageId', name: 'storageId', type: 'number' as const, default: 0 },
			{ displayName: 'purchasePrice', name: 'purchasePrice', type: 'number' as const, default: 0 },
			{ displayName: 'sellingPrice', name: 'sellingPrice', type: 'number' as const, default: 0 },
			{
				displayName: 'ownageType',
				name: 'ownageType',
				type: 'options' as const,
				options: [
					{ name: 'OWN', value: 'OWN' },
					{ name: 'FOREIGN', value: 'FOREIGN' },
					{ name: 'OWN_RENT', value: 'OWN_RENT' },
					{ name: 'FOREIGN_RENT', value: 'FOREIGN_RENT' },
				],
				default: 'OWN',
			},
			{ displayName: 'Name', name: 'name', type: 'string' as const, default: '' },
			{ displayName: 'Description', name: 'description', type: 'string' as const, default: '' },
			{ displayName: 'manufacturerNumber', name: 'manufacturerNumber', type: 'string' as const, default: '' },
			{
				displayName: 'Fields',
				name: 'fields',
				type: 'fixedCollection' as const,
				typeOptions: { multipleValues: true },
				placeholder: 'Add Field',
				default: {},
				description: 'Additional fields',
				options: [
					{
						displayName: 'Field',
						name: 'field',
						values: [
							{ displayName: 'additionalFieldId', name: 'additionalFieldId', type: 'number' as const, default: 0 },
							{ displayName: 'Title', name: 'title', type: 'string' as const, default: '' },
							{ displayName: 'Value', name: 'value', type: 'string' as const, default: '' },
						],
					},
				],
			},
			{
				displayName: 'IPs',
				name: 'ips',
				type: 'fixedCollection' as const,
				typeOptions: { multipleValues: true },
				placeholder: 'Add IP',
				default: {},
				description: 'List of IP objects',
				options: [
					{
						displayName: 'IP',
						name: 'ipFields',
						values: [
							{
								displayName: 'assignmentId',
								name: 'assignmentId',
								default: 0,
							},
							{
								displayName: 'assignmentType',
								name: 'assignmentType',
								options: [
									{
										name: 'PC',
										value: 'PC',
									},
									{
										name: 'PERIPHERY',
										value: 'PERIPHERY',
									},
									{
										name: 'EMPLOYEE',
										value: 'EMPLOYEE',
									},
								],
								default: 'PC',
							},
							{
								displayName: 'dhcp',
								name: 'dhcp',
								default: true,
							},
							{
								displayName: 'id',
								name: 'id',
								default: 0,
							},
							{
								displayName: 'ip',
								name: 'ip',
								default: '',
							},
							{
								displayName: 'mac',
								name: 'mac',
								default: '',
							},
							{
								displayName: 'remark',
								name: 'remark',
								default: '',
							},
							{
								displayName: 'serviceAssignments',
								name: 'serviceAssignments',
								options: [
									{
										displayName: 'Service',
										name: 'service',
										values: [
											{
												displayName: 'serviceId',
												name: 'serviceId',
												default: 0,
											},
										],
									},
								],
							},
						],
					},
				],
			},
			{
				displayName: 'Guarantee',
				name: 'guarantee',
				type: 'collection' as const,
				placeholder: 'Add Guarantee',
				default: {},
				options: [
					{ displayName: 'linkTypeId', name: 'linkTypeId', type: 'number' as const, default: 0 },
					{ displayName: 'linkId', name: 'linkId', type: 'number' as const, default: 0 },
					{ displayName: 'purchaseDate (Timestamp)', name: 'purchaseDate', type: 'number' as const, default: 0 },
					{ displayName: 'guaranteeMonth', name: 'guaranteeMonth', type: 'number' as const, default: 0 },
					{ displayName: 'guaranteeExpire', name: 'guaranteeExpire', type: 'number' as const, default: 0 },
					{ displayName: 'warrantyMonth', name: 'warrantyMonth', type: 'number' as const, default: 0 },
					{ displayName: 'warrantyExpire', name: 'warrantyExpire', type: 'number' as const, default: 0 },
					{ displayName: 'Remark', name: 'remark', type: 'string' as const, default: '' },
				],
			},
		],
	},
	{
		displayName: 'Update Periphery Fields',
		name: 'updatePeripheryFields',
		type: 'collection' as const,
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['peripheries'], operation: ['updatePeriphery'] } },
		options: [
			{ displayName: 'ID', name: 'id', type: 'number' as const, default: 0 },
			{ displayName: 'companyId', name: 'companyId', type: 'number' as const, default: 0 },
			{ displayName: 'Date (Timestamp)', name: 'date', type: 'number' as const, default: 0 },
			{ displayName: 'peripheryTypeId', name: 'peripheryTypeId', type: 'number' as const, default: 0 },
			{ displayName: 'manufacturerId', name: 'manufacturerId', type: 'number' as const, default: 0 },
			{ displayName: 'Type', name: 'type', type: 'string' as const, default: '' },
			{ displayName: 'Location', name: 'location', type: 'string' as const, default: '' },
			{ displayName: 'Remark', name: 'remark', type: 'string' as const, default: '' },
			{ displayName: 'internalRemark', name: 'internalRemark', type: 'string' as const, default: '' },
			{ displayName: 'serialNumber', name: 'serialNumber', type: 'string' as const, default: '' },
			{ displayName: 'inventoryNumber', name: 'inventoryNumber', type: 'string' as const, default: '' },
			{ displayName: 'Version', name: 'version', type: 'string' as const, default: '' },
			{ displayName: 'Active', name: 'active', type: 'boolean' as const, default: true },
			{ displayName: 'employeeId', name: 'employeeId', type: 'number' as const, default: 0 },
			{ displayName: 'pcId', name: 'pcId', type: 'number' as const, default: 0 },
			{ displayName: 'billingNumber', name: 'billingNumber', type: 'string' as const, default: '' },
			{ displayName: 'articleNumber', name: 'articleNumber', type: 'string' as const, default: '' },
			{ displayName: 'storageId', name: 'storageId', type: 'number' as const, default: 0 },
			{ displayName: 'purchasePrice', name: 'purchasePrice', type: 'number' as const, default: 0 },
			{ displayName: 'sellingPrice', name: 'sellingPrice', type: 'number' as const, default: 0 },
			{
				displayName: 'ownageType',
				name: 'ownageType',
				type: 'options' as const,
				options: [
					{ name: 'OWN', value: 'OWN' },
					{ name: 'FOREIGN', value: 'FOREIGN' },
					{ name: 'OWN_RENT', value: 'OWN_RENT' },
					{ name: 'FOREIGN_RENT', value: 'FOREIGN_RENT' },
				],
				default: 'OWN',
			},
			{ displayName: 'Name', name: 'name', type: 'string' as const, default: '' },
			{ displayName: 'Description', name: 'description', type: 'string' as const, default: '' },
			{ displayName: 'manufacturerNumber', name: 'manufacturerNumber', type: 'string' as const, default: '' },
			{
				displayName: 'Fields',
				name: 'fields',
				type: 'fixedCollection' as const,
				typeOptions: { multipleValues: true },
				placeholder: 'Add Field',
				default: {},
				description: 'Additional fields',
				options: [
					{
						displayName: 'Field',
						name: 'field',
						values: [
							{ displayName: 'additionalFieldId', name: 'additionalFieldId', type: 'number' as const, default: 0 },
							{ displayName: 'Title', name: 'title', type: 'string' as const, default: '' },
							{ displayName: 'Value', name: 'value', type: 'string' as const, default: '' },
						],
					},
				],
			},
			{
				displayName: 'IPs',
				name: 'ips',
				type: 'fixedCollection' as const,
				typeOptions: { multipleValues: true },
				placeholder: 'Add IP',
				default: {},
				description: 'List of IP objects',
				options: [
					{
						displayName: 'IP',
						name: 'ipFields',
						values: [
							{
								displayName: 'assignmentId',
								name: 'assignmentId',
								default: 0,
							},
							{
								displayName: 'assignmentType',
								name: 'assignmentType',
								options: [
									{
										name: 'PC',
										value: 'PC',
									},
									{
										name: 'PERIPHERY',
										value: 'PERIPHERY',
									},
									{
										name: 'EMPLOYEE',
										value: 'EMPLOYEE',
									},
								],
								default: 'PC',
							},
							{
								displayName: 'dhcp',
								name: 'dhcp',
								default: true,
							},
							{
								displayName: 'id',
								name: 'id',
								default: 0,
							},
							{
								displayName: 'ip',
								name: 'ip',
								default: '',
							},
							{
								displayName: 'mac',
								name: 'mac',
								default: '',
							},
							{
								displayName: 'remark',
								name: 'remark',
								default: '',
							},
							{
								displayName: 'serviceAssignments',
								name: 'serviceAssignments',
								options: [
									{
										displayName: 'Service',
										name: 'service',
										values: [
											{
												displayName: 'serviceId',
												name: 'serviceId',
												default: 0,
											},
										],
									},
								],
							},
						],
					},
				],
			},
			{
				displayName: 'Guarantee',
				name: 'guarantee',
				type: 'collection' as const,
				placeholder: 'Add Guarantee',
				default: {},
				options: [
					{ displayName: 'linkTypeId', name: 'linkTypeId', type: 'number' as const, default: 0 },
					{ displayName: 'linkId', name: 'linkId', type: 'number' as const, default: 0 },
					{ displayName: 'purchaseDate (Timestamp)', name: 'purchaseDate', type: 'number' as const, default: 0 },
					{ displayName: 'guaranteeMonth', name: 'guaranteeMonth', type: 'number' as const, default: 0 },
					{ displayName: 'guaranteeExpire', name: 'guaranteeExpire', type: 'number' as const, default: 0 },
					{ displayName: 'warrantyMonth', name: 'warrantyMonth', type: 'number' as const, default: 0 },
					{ displayName: 'warrantyExpire', name: 'warrantyExpire', type: 'number' as const, default: 0 },
					{ displayName: 'Remark', name: 'remark', type: 'string' as const, default: '' },
				],
			},
		],
	},
	{
		displayName: 'List Peripheries Filters',
		name: 'listPeripheryFilters',
		type: 'collection' as const,
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: { resource: ['peripheries'], operation: ['listPeripheries'] } },
		options: [
			{ displayName: 'companyId', name: 'companyId', type: 'number' as const, default: 0, description: 'Show only entries of this company' },
			{
				displayName: 'Branches',
				name: 'branches',
				type: 'options' as const,
				options: [
					{ name: 'COMPANY_ONLY', value: 'COMPANY_ONLY' },
					{ name: 'BRANCHES_ONLY', value: 'BRANCHES_ONLY' },
					{ name: 'COMPANY_AND_BRANCHES', value: 'COMPANY_AND_BRANCHES' },
					{ name: 'SPECIFIC_BRANCH', value: 'SPECIFIC_BRANCH' },
				],
				default: 'COMPANY_ONLY',
				description: 'Filter settings for branches',
			},
			{
				displayName: 'Active',
				name: 'active',
				type: 'options' as const,
				options: [
					{ name: 'ACTIVE_ONLY', value: 'ACTIVE_ONLY' },
					{ name: 'INACTIVE_ONLY', value: 'INACTIVE_ONLY' },
					{ name: 'ACTIVE_AND_INACTIVE', value: 'ACTIVE_AND_INACTIVE' },
				],
				default: 'ACTIVE_AND_INACTIVE',
				description: 'Filter settings for active state',
			},
			{
				displayName: 'peripheryTypeId',
				name: 'peripheryTypeId',
				type: 'number' as const,
				default: 0,
				description: 'ID of the periphery type to be filtered',
			},
		],
	},
];

export async function handlePeriphery(this: IExecuteFunctions, i: number) {
	const operation = this.getNodeParameter('operation', i) as string;
	const credentials = await this.getCredentials('tanssApi');

	if (!credentials) throw new NodeOperationError(this.getNode(), 'No credentials returned!');

	const apiToken = this.getNodeParameter('apiToken', i, '') as string;
	const peripheryId = this.getNodeParameter('peripheryId', i, 0) as number;

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

	const buildPeripheryBody = (raw: PeripheryBodyInput) => {
		const body: Record<string, unknown> & { peripheryTypeId?: number | null } = { ...raw };

		if (raw.fields && raw.fields.field) {
			body.fields = raw.fields.field;
		}

		if (raw.ips && raw.ips.ipFields) {
			body.ips = raw.ips.ipFields.map((ip) => {
				const out: {
					ip?: string;
					mac?: string;
					remark?: string;
					dhcp?: boolean;
					id?: number;
					assignmentType?: string;
					assignmentId?: number;
					serviceAssignments?: Array<{ serviceId?: number }>;
				} = {
					ip: ip.ip,
					mac: ip.mac,
					remark: ip.remark,
					dhcp: ip.dhcp,
					id: ip.id,
					assignmentType: ip.assignmentType,
					assignmentId: ip.assignmentId,
				};
				if (ip.serviceAssignments && ip.serviceAssignments.service) {
					out.serviceAssignments = ip.serviceAssignments.service.map((s) => ({ serviceId: s.serviceId }));
				} else {
					out.serviceAssignments = [];
				}
				return out;
			});
		}

		if (raw.guarantee) {
			body.guarantee = raw.guarantee;
		}

		if (body.peripheryTypeId === 0 || body.peripheryTypeId == null) {
			throw new NodeOperationError(this.getNode(), 'peripheryTypeId is missing or 0, provide a valid peripheryTypeId.');
		}

		return body;
	};

	switch (operation) {
		case 'getPeriphery': {
			url = `${credentials.baseURL}/backend/api/v1/peripheries/${peripheryId}`;
			requestOptions.method = 'GET';
			break;
		}
		case 'updatePeriphery': {
			const updatePeripheryFields = this.getNodeParameter('updatePeripheryFields', i, {}) as PeripheryBodyInput;
			if (Object.keys(updatePeripheryFields).length === 0) throw new NodeOperationError(this.getNode(), 'No fields provided for updating periphery.');
			url = `${credentials.baseURL}/backend/api/v1/peripheries/${peripheryId}`;
			requestOptions.method = 'PUT';
			requestOptions.body = buildPeripheryBody(updatePeripheryFields);
			break;
		}
		case 'createPeriphery': {
			const createPeripheryFields = this.getNodeParameter('createPeripheryFields', i, {}) as PeripheryBodyInput;
			if (Object.keys(createPeripheryFields).length === 0) throw new NodeOperationError(this.getNode(), 'No fields provided for creating periphery.');
			url = `${credentials.baseURL}/backend/api/v1/peripheries`;
			requestOptions.method = 'POST';
			requestOptions.body = buildPeripheryBody(createPeripheryFields);
			break;
		}
		case 'listPeripheries': {
			const filters = this.getNodeParameter('listPeripheryFilters', i, {}) as Record<string, unknown>;
			url = `${credentials.baseURL}/backend/api/v1/peripheries`;
			requestOptions.method = 'PUT';
			requestOptions.body = filters;
			break;
		}
		case 'getPeripheryTypes': {
			url = `${credentials.baseURL}/backend/api/v1/peripheries/types`;
			requestOptions.method = 'GET';
			break;
		}
		case 'createPeripheryType': {
			const createFields = this.getNodeParameter('createPeripheryTypeFields', i, {}) as Record<string, unknown>;
			if (Object.keys(createFields).length === 0) throw new NodeOperationError(this.getNode(), 'No fields provided for creating periphery type.');
			url = `${credentials.baseURL}/backend/api/v1/peripheries/types`;
			requestOptions.method = 'POST';
			requestOptions.body = createFields;
			break;
		}
		case 'updatePeripheryType': {
			const typeId = this.getNodeParameter('peripheryTypeIdParam', i, 0) as number;
			if (!typeId) throw new NodeOperationError(this.getNode(), 'periphery type id is required for update.');
			const updateFields = this.getNodeParameter('updatePeripheryTypeFields', i, {}) as Record<string, unknown>;
			if (Object.keys(updateFields).length === 0) throw new NodeOperationError(this.getNode(), 'No fields provided for updating periphery type.');
			url = `${credentials.baseURL}/backend/api/v1/peripheries/types/${typeId}`;
			requestOptions.method = 'PUT';
			requestOptions.body = updateFields;
			break;
		}
		case 'deletePeripheryType': {
			const typeId = this.getNodeParameter('peripheryTypeIdParam', i, 0) as number;
			if (!typeId) throw new NodeOperationError(this.getNode(), 'periphery type id is required for delete.');
			url = `${credentials.baseURL}/backend/api/v1/peripheries/types/${typeId}`;
			requestOptions.method = 'DELETE';
			break;
		}
		case 'assignPeriphery': {
			const params = this.getNodeParameter('assignmentParams', i, {}) as AssignmentParams;
			const pid = params.peripheryId as number;
			const linkTypeId = params.linkTypeId as number;
			const linkId = params.linkId as number;
			if (!pid) throw new NodeOperationError(this.getNode(), 'peripheryId is required for assignment.');
			if (!linkTypeId) throw new NodeOperationError(this.getNode(), 'linkTypeId is required for assignment.');
			if (!linkId) throw new NodeOperationError(this.getNode(), 'linkId is required for assignment.');
			url = `${credentials.baseURL}/backend/api/v1/peripheries/${pid}/buildIn/${linkTypeId}/${linkId}`;
			requestOptions.method = 'POST';
			break;
		}
		case 'deletePeripheryAssignment': {
			const params = this.getNodeParameter('assignmentParams', i, {}) as AssignmentParams;
			const pid = params.peripheryId as number;
			const linkTypeId = params.linkTypeId as number;
			const linkId = params.linkId as number;
			if (!pid) throw new NodeOperationError(this.getNode(), 'peripheryId is required for deleting assignment.');
			if (!linkTypeId) throw new NodeOperationError(this.getNode(), 'linkTypeId is required for deleting assignment.');
			if (!linkId) throw new NodeOperationError(this.getNode(), 'linkId is required for deleting assignment.');
			url = `${credentials.baseURL}/backend/api/v1/peripheries/${pid}/buildIn/${linkTypeId}/${linkId}`;
			requestOptions.method = 'DELETE';
			break;
		}
		case 'deletePeriphery': {
			url = `${credentials.baseURL}/backend/api/v1/peripheries/${peripheryId}`;
			requestOptions.method = 'DELETE';
			break;
		}
		default:
			throw new NodeOperationError(this.getNode(), `The operation "${operation}" is not recognized.`);
	}

	requestOptions.url = url;

	try {
		const responseData = await this.helpers.httpRequest(requestOptions as unknown as import('n8n-workflow').IHttpRequestOptions);
		if (operation === 'deletePeriphery' || operation === 'deletePeripheryType' || operation === 'deletePeripheryAssignment') {
			if (responseData === '' || responseData == null) {
				return {
					success: true,
					statusCode: 204,
					message:
						operation === 'deletePeriphery'
							? 'periphery was deleted succesfully'
							: operation === 'deletePeripheryType'
								? 'periphery type deleted'
								: 'periphery assignment deleted',
				};
			}
		}
		if (operation === 'assignPeriphery') {
			if (responseData === '' || responseData == null) {
				return { statusCode: 201, message: 'periphery was assigned succesfully' };
			}
		}
		return responseData;
	} catch (error: unknown) {
		const anyErr = error as {
			response?: {
				status?: number;
				data?: { error?: { localizedText?: string; text?: string } } | Record<string, unknown>;
			};
		};
		let message = error instanceof Error ? error.message : String(error);
		if (anyErr && anyErr.response) {
			try {
				const status = anyErr.response.status;
				const respData = anyErr.response.data;
				if (operation === 'deletePeriphery' || operation === 'deletePeripheryType' || operation === 'deletePeripheryAssignment') {
					const tanssError = respData && 'error' in respData ? respData.error : undefined;
					return {
						success: false,
						statusCode: status,
						message:
							tanssError?.localizedText ?? tanssError?.text ?? (status === 403 ? 'error response' : `Delete request failed (status ${status})`),
						error: tanssError ?? respData,
					};
				}
				message += `; Status: ${status}`;
				if (respData) message += `; Response: ${JSON.stringify(respData)}`;
			} catch {
				message += '; Response parse failed';
			}
		}

		if (operation === 'deletePeriphery' || operation === 'deletePeripheryType' || operation === 'deletePeripheryAssignment') {
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
