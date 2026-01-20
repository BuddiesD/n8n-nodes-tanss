import { IExecuteFunctions, INodeProperties, NodeOperationError } from 'n8n-workflow';

export const pcOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options' as const,
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['pc'],
			},
		},
		options: [
			{
				name: 'Create PC',
				value: 'createPc',
				description: 'Creates a new PC or server',
				action: 'Creates a PC',
			},
			{
				name: 'Delete PC',
				value: 'deletePc',
				description: 'Deletes a PC or server',
				action: 'Deletes a PC',
			},
			{
				name: 'Get PC by ID',
				value: 'getPcById',
				description: 'Fetches a PC or server by a given ID',
				action: 'Fetches a PC by ID',
			},
			{
				name: 'List PCs',
				value: 'listPcs',
				description: 'Gets a list of PCs or servers',
				action: 'List pcs',
			},
			{
				name: 'Update PC',
				value: 'updatePc',
				description: 'Updates a PC or server',
				action: 'Updates a PC',
			},
		],
		default: 'getPcById',
	},
];

export const pcFields: INodeProperties[] = [
	{
		displayName: 'API Token',
		name: 'apiToken',
		type: 'string',
		required: true,
		typeOptions: { password: true },
		default: '',
		description: 'Enter the API token for the TANSS API',
		displayOptions: {
			show: {
				resource: ['pc'],
			},
		},
	},
	{
		displayName: 'PC ID',
		name: 'pcId',
		type: 'number' as const,
		displayOptions: {
			show: {
				resource: ['pc'],
				operation: ['getPcById', 'updatePc', 'deletePc'],
			},
		},
		default: 0,
		description: 'ID of the PC or server',
	},
	{
		displayName: 'Company ID',
		name: 'companyId',
		type: 'number' as const,
		required: true,
		displayOptions: {
			show: {
				resource: ['pc'],
				operation: ['createPc', 'updatePc'],
			},
		},
		default: 0,
		description: 'ID der Firma',
	},
	{
		displayName: 'Model',
		name: 'model',
		type: 'string' as const,
		required: true,
		displayOptions: {
			show: {
				resource: ['pc'],
				operation: ['createPc', 'updatePc'],
			},
		},
		default: '',
		description: 'Modell des PCs oder Servers',
	},
	{
		displayName: 'PC Data',
		name: 'pcData',
		type: 'collection' as const,
		displayOptions: {
			show: {
				resource: ['pc'],
				operation: ['updatePc', 'createPc'],
			},
		},
		default: {},
		placeholder: 'Add Field',
		options: [
			{ displayName: 'Active', name: 'active', type: 'boolean' as const, default: false },
			{ displayName: 'AnyDesk ID', name: 'anydeskId', type: 'string' as const, default: '' },
			{
				displayName: 'AnyDesk Password',
				name: 'anydeskPassword',
				type: 'string' as const,
				default: '',
				typeOptions: { password: true },
			},
			{
				displayName: 'Article Number',
				name: 'articleNumber',
				type: 'string' as const,
				default: '',
			},
			{
				displayName: 'Billing Number',
				name: 'billingNumber',
				type: 'string' as const,
				default: '',
			},
			{ displayName: 'BIOS', name: 'bios', type: 'string' as const, default: '' },
			{ displayName: 'BIOS Release', name: 'biosRelease', type: 'string' as const, default: '' },
			{ displayName: 'CPU Frequency', name: 'cpuFrequency', type: 'number' as const, default: 0 },
			{
				displayName: 'CPU Manufacturer ID',
				name: 'cpuManufacturerId',
				type: 'number' as const,
				default: 0,
			},
			{ displayName: 'CPU Number', name: 'cpuNumber', type: 'number' as const, default: 0 },
			{ displayName: 'CPU Type ID', name: 'cpuTypeId', type: 'number' as const, default: 0 },
			{ displayName: 'Date', name: 'date', type: 'number' as const, default: 0 },
			{ displayName: 'Description', name: 'description', type: 'string' as const, default: '' },
			{ displayName: 'Employee ID', name: 'employeeId', type: 'number' as const, default: 0 },
			{ displayName: 'Host ID', name: 'hostId', type: 'number' as const, default: 0 },
			{
				displayName: 'Internal Remark',
				name: 'internalRemark',
				type: 'string' as const,
				default: '',
			},
			{
				displayName: 'Inventory Number',
				name: 'inventoryNumber',
				type: 'string' as const,
				default: '',
			},
			{
				displayName: 'Keyboard Serial Number',
				name: 'keyboardSerialNumber',
				type: 'string' as const,
				default: '',
			},
			{ displayName: 'Location', name: 'location', type: 'string' as const, default: '' },
			{
				displayName: 'Mainboard Manufacturer ID',
				name: 'mainboardManufacturerId',
				type: 'number' as const,
				default: 0,
			},
			{
				displayName: 'Mainboard Manufacturer Revision',
				name: 'mainboardManufacturerRevision',
				type: 'string' as const,
				default: '',
			},
			{
				displayName: 'Mainboard Serial Number',
				name: 'mainboardSerialNumber',
				type: 'string' as const,
				default: '',
			},
			{
				displayName: 'Manufacturer ID',
				name: 'manufacturerId',
				type: 'number' as const,
				default: 0,
			},
			{
				displayName: 'Manufacturer Number',
				name: 'manufacturerNumber',
				type: 'string' as const,
				default: '',
			},
			{
				displayName: 'Mouse Serial Number',
				name: 'mouseSerialNumber',
				type: 'string' as const,
				default: '',
			},
			{ displayName: 'Name', name: 'name', type: 'string' as const, default: '' },
			{ displayName: 'OS ID', name: 'osId', type: 'number' as const, default: 0 },
			{
				displayName: 'Ownage Type',
				name: 'ownageType',
				type: 'options' as const,
				options: [
					{ name: 'Foreign', value: 'FOREIGN' },
					{ name: 'Foreign Rent', value: 'FOREIGN_RENT' },
					{ name: 'Own', value: 'OWN' },
					{ name: 'Own Rent', value: 'OWN_RENT' },
				],
				default: 'OWN',
			},
			{ displayName: 'Purchase Price', name: 'purchasePrice', type: 'number' as const, default: 0 },
			{ displayName: 'Remark', name: 'remark', type: 'string' as const, default: '' },
			{ displayName: 'Reserved CPU', name: 'reservedCpu', type: 'number' as const, default: 0 },
			{
				displayName: 'Reserved Hard Disk',
				name: 'reservedHardDisk',
				type: 'number' as const,
				default: 0,
			},
			{ displayName: 'Reserved RAM', name: 'reservedRam', type: 'number' as const, default: 0 },
			{ displayName: 'Selling Price', name: 'sellingPrice', type: 'number' as const, default: 0 },
			{ displayName: 'Serial Number', name: 'serialNumber', type: 'string' as const, default: '' },
			{ displayName: 'Server', name: 'server', type: 'boolean' as const, default: false },
			{
				displayName: 'Service Technician ID',
				name: 'serviceTechnicianId',
				type: 'number' as const,
				default: 0,
			},
			{ displayName: 'Show Remark', name: 'showRemark', type: 'boolean' as const, default: false },
			{ displayName: 'Software', name: 'software', type: 'string' as const, default: '' },
			{ displayName: 'Storage ID', name: 'storageId', type: 'number' as const, default: 0 },
			{ displayName: 'TeamViewer ID', name: 'teamviewerId', type: 'string' as const, default: '' },
			{
				displayName: 'TeamViewer Password',
				name: 'teamviewerPassword',
				type: 'string' as const,
				default: '',
				typeOptions: { password: true },
			},
		],
	},
	{
		displayName: 'List Query',
		name: 'listQuery',
		type: 'collection' as const,
		displayOptions: {
			show: {
				resource: ['pc'],
				operation: ['listPcs'],
			},
		},
		default: {},
		placeholder: 'Add Field',
		options: [
			{
				displayName: 'Active',
				name: 'active',
				type: 'options' as const,
				options: [
					{ name: 'Active Only', value: 'ACTIVE_ONLY' },
					{ name: 'Inactive Only', value: 'INACTIVE_ONLY' },
					{ name: 'Active and Inactive', value: 'ACTIVE_AND_INACTIVE' },
				],
				default: 'ACTIVE_ONLY',
			},
			{
				displayName: 'Branches',
				name: 'branches',
				type: 'options' as const,
				options: [
					{ name: 'Company Only', value: 'COMPANY_ONLY' },
					{ name: 'Branches Only', value: 'BRANCHES_ONLY' },
					{ name: 'Company and Branches', value: 'COMPANY_AND_BRANCHES' },
					{ name: 'Specific Branch', value: 'SPECIFIC_BRANCH' },
				],
				default: 'COMPANY_ONLY',
			},
			{ displayName: 'Company ID', name: 'companyId', type: 'number' as const, default: 0 },
			{
				displayName: 'OS IDs',
				name: 'osIds',
				type: 'multiOptions' as const,
				typeOptions: { multipleValues: true },
				options: [],
				default: [],
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'options' as const,
				options: [
					{ name: 'PCs Only', value: 'PCS_ONLY' },
					{ name: 'Servers Only', value: 'SERVERS_ONLY' },
					{ name: 'Servers and PCs', value: 'SERVERS_AND_PCS' },
				],
				default: 'PCS_ONLY',
			},
		],
	},
];

export async function handlePc(this: IExecuteFunctions, i: number) {
	const operation = this.getNodeParameter('operation', i) as string;
	const credentials = await this.getCredentials('tanssApi');

	if (!credentials) throw new NodeOperationError(this.getNode(), 'No credentials returned!');

	const apiToken = this.getNodeParameter('apiToken', i, '') as string;
	const pcId = this.getNodeParameter('pcId', i, 0) as number;
	const pcData = this.getNodeParameter('pcData', i, {}) as Record<string, unknown>;
	const companyId = this.getNodeParameter('companyId', i, 0) as number;
	const model = this.getNodeParameter('model', i, '') as string;

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
		case 'getPcById':
			if (!pcId || typeof pcId !== 'number' || pcId <= 0)
				throw new NodeOperationError(
					this.getNode(),
					'Field "PC ID" is required and must be a valid ID.',
				);
			url = `${credentials.baseURL}/backend/api/v1/pcs/${pcId}`;
			requestOptions.method = 'GET';
			break;

		case 'updatePc': {
			url = `${credentials.baseURL}/backend/api/v1/pcs/${pcId}`;
			const body = { ...pcData, companyId, model };
			if (Object.keys(body).length === 0)
				throw new NodeOperationError(this.getNode(), 'No data provided for updating the PC.');
			requestOptions.method = 'PUT';
			requestOptions.body = body;
			break;
		}

		case 'createPc': {
			url = `${credentials.baseURL}/backend/api/v1/pcs`;
			const body = { ...pcData, companyId, model };
			if (Object.keys(body).length === 0)
				throw new NodeOperationError(this.getNode(), 'No data provided for creating the PC.');
			if (!body.model)
				throw new NodeOperationError(
					this.getNode(),
					'Field "Model" is required for creating a PC.',
				);
			if (!body.companyId || typeof body.companyId !== 'number' || body.companyId <= 0)
				throw new NodeOperationError(
					this.getNode(),
					'Field "Company ID" is required and must be a valid company ID.',
				);
			requestOptions.method = 'POST';
			requestOptions.body = body;
			break;
		}

		case 'deletePc':
			url = `${credentials.baseURL}/backend/api/v1/pcs/${pcId}`;
			requestOptions.method = 'DELETE';
			break;

		case 'listPcs': {
			url = `${credentials.baseURL}/backend/api/v1/pcs`;
			const listQuery = this.getNodeParameter('listQuery', i, {}) as Record<string, unknown>;
			requestOptions.method = 'PUT';
			requestOptions.body = listQuery;
			break;
		}

		default:
			throw new NodeOperationError(
				this.getNode(),
				`The operation "${operation}" is not recognized.`,
			);
	}

	requestOptions.url = url;

	try {
		const responseData = await this.helpers.httpRequest(
			requestOptions as unknown as import('n8n-workflow').IHttpRequestOptions,
		);

		if (
			operation === 'deletePc' &&
			(responseData === undefined || responseData === null || responseData === '')
		) {
			return { success: true, message: 'PC deleted successfully.' };
		}

		return responseData;
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		throw new NodeOperationError(this.getNode(), `Failed to execute ${operation}: ${errorMessage}`);
	}
}
