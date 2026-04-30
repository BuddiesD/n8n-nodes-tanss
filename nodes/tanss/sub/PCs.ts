import { IExecuteFunctions, INodeProperties, NodeOperationError, NodeApiError, JsonObject } from 'n8n-workflow';
import { getTanssBaseUrl, isGeneratedTokenMode, tanssHttpRequest } from './request';

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
		displayName: 'PC ID',
		name: 'pcId',
		type: 'number' as const,
		required: true,
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
		name: 'createCompanyId',
		type: 'number' as const,
		required: true,
		displayOptions: {
			show: {
				resource: ['pc'],
				operation: ['createPc'],
			},
		},
		default: 0,
	},
	{
		displayName: 'Model',
		name: 'createModel',
		type: 'string' as const,
		required: true,
		displayOptions: {
			show: {
				resource: ['pc'],
				operation: ['createPc'],
			},
		},
		default: '',
		description: 'Model of the PC or server',
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
			{ displayName: 'Company ID', name: 'companyId', type: 'number' as const, default: 0 },
			{ displayName: 'Model', name: 'model', type: 'string' as const, default: '' },
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
				type: 'fixedCollection' as const,
				typeOptions: { multipleValues: true },
				default: {},
				placeholder: 'Add OS ID',
				options: [
					{
						name: 'values',
						displayName: 'OS IDs',
						values: [
							{
								displayName: 'OS ID',
								name: 'osId',
								type: 'number' as const,
								default: 0,
								description: 'OS ID to include in the result filter',
							},
						],
					},
				],
			},
			{
				displayName: 'Type',
				name: 'servers',
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
	const credentials = { baseURL: await getTanssBaseUrl.call(this, i) };
	const pcsBasePath = isGeneratedTokenMode.call(this, i) ? '/backend/api/deviceManagement/v1/pcs' : '/backend/api/v1/pcs';

	if (!credentials) throw new NodeOperationError(this.getNode(), 'No credentials returned!');
	const pcId = this.getNodeParameter('pcId', i, 0) as number;
	const pcData = this.getNodeParameter('pcData', i, {}) as Record<string, unknown>;
	const createCompanyId = this.getNodeParameter('createCompanyId', i, 0) as number;
	const createModel = this.getNodeParameter('createModel', i, '') as string;

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
		case 'getPcById':
			if (!pcId || typeof pcId !== 'number' || pcId <= 0)
				throw new NodeOperationError(this.getNode(), 'Field "PC ID" is required and must be a valid ID.');
			url = `${credentials.baseURL}${pcsBasePath}/${pcId}`;
			requestOptions.method = 'GET';
			break;

		case 'updatePc': {
			if (!pcId || typeof pcId !== 'number' || pcId <= 0)
				throw new NodeOperationError(this.getNode(), 'Field "PC ID" is required and must be a valid ID.');
			url = `${credentials.baseURL}${pcsBasePath}/${pcId}`;
			const body: Record<string, unknown> = { ...pcData };
			if (Object.keys(body).length === 0) throw new NodeOperationError(this.getNode(), 'No data provided for updating the PC.');
			requestOptions.method = 'PUT';
			requestOptions.body = body;
			break;
		}

		case 'createPc': {
			url = `${credentials.baseURL}${pcsBasePath}`;
			const body = { ...pcData, companyId: createCompanyId, model: createModel };
			if (Object.keys(body).length === 0) throw new NodeOperationError(this.getNode(), 'No data provided for creating the PC.');
			if (!body.model) throw new NodeOperationError(this.getNode(), 'Field "Model" is required for creating a PC.');
			if (!body.companyId || typeof body.companyId !== 'number' || body.companyId <= 0)
				throw new NodeOperationError(this.getNode(), 'Field "Company ID" is required and must be a valid company ID.');
			requestOptions.method = 'POST';
			requestOptions.body = body;
			break;
		}

		case 'deletePc':
			if (!pcId || typeof pcId !== 'number' || pcId <= 0)
				throw new NodeOperationError(this.getNode(), 'Field "PC ID" is required and must be a valid ID.');
			url = `${credentials.baseURL}${pcsBasePath}/${pcId}`;
			requestOptions.method = 'DELETE';
			break;

		case 'listPcs': {
			url = `${credentials.baseURL}${pcsBasePath}`;
			const listQuery = this.getNodeParameter('listQuery', i, {}) as Record<string, unknown>;
			const osIdsInput = listQuery.osIds as { values?: Array<{ osId?: number }> } | undefined;
			if (osIdsInput?.values && Array.isArray(osIdsInput.values)) {
				const parsedOsIds = osIdsInput.values.map((entry) => Number(entry.osId)).filter((id) => Number.isInteger(id) && id > 0);

				if (parsedOsIds.length > 0) {
					listQuery.osIds = parsedOsIds;
				} else {
					delete listQuery.osIds;
				}
			}
			requestOptions.method = 'PUT';
			requestOptions.body = listQuery;
			break;
		}

		default:
			throw new NodeOperationError(this.getNode(), `The operation "${operation}" is not recognized.`);
	}

	requestOptions.url = url;

	try {
		if (operation === 'deletePc') {
			const fullResponse = (await tanssHttpRequest.call(this, i, {
				...(requestOptions as unknown as Record<string, unknown>),
				simple: false,
				resolveWithFullResponse: true,
			} as unknown as import('n8n-workflow').IHttpRequestOptions)) as unknown as {
				statusCode?: number;
				body?: unknown;
			};

			const statusCode = fullResponse?.statusCode ?? 0;
			if (statusCode === 204) {
				return { success: true, statusCode, message: 'PC deleted successfully.' };
			}

			const tanssBody = (fullResponse?.body ?? null) as { error?: { localizedText?: string; text?: string; type?: string } } | null;
			const tanssError = tanssBody?.error;

			return {
				success: false,
				statusCode,
				message: tanssError?.localizedText ?? tanssError?.text ?? `Delete request failed (status ${statusCode})`,
				error: tanssError ?? tanssBody,
			};
		}

		const responseData = await tanssHttpRequest.call(this, i, requestOptions as unknown as import('n8n-workflow').IHttpRequestOptions);
		return responseData;
	} catch (error: unknown) {
		if (operation === 'deletePc') {
			const anyErr = error as {
				statusCode?: number;
				response?: { status?: number; statusCode?: number; body?: unknown; data?: unknown };
			};
			const statusCode = anyErr?.response?.statusCode ?? anyErr?.response?.status ?? anyErr?.statusCode ?? 0;
			const rawBody = anyErr?.response?.body ?? anyErr?.response?.data;

			let parsedBody: unknown = rawBody;
			if (typeof rawBody === 'string') {
				try {
					parsedBody = JSON.parse(rawBody);
				} catch {
					parsedBody = rawBody;
				}
			}

			const tanssError = (parsedBody as { error?: { localizedText?: string; text?: string; type?: string } } | null)?.error;

			return {
				success: false,
				statusCode,
				message:
					tanssError?.localizedText ?? tanssError?.text ?? (error instanceof Error ? error.message : `Delete request failed (status ${statusCode})`),
				error: tanssError ?? parsedBody,
			};
		}

		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}
