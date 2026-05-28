import { IExecuteFunctions, INodeProperties, NodeOperationError, NodeApiError, JsonObject } from 'n8n-workflow';
import { getTanssBaseUrl, isGeneratedTokenMode, tanssHttpRequest } from './request';

export const componentsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options' as const,
		noDataExpression: true,
		displayOptions: { show: { resource: ['components'] } },
		options: [
			{ name: 'Get Component', value: 'getComponent', action: 'Get component' },
			{ name: 'Create Component', value: 'createComponent', action: 'Create component' },
			{ name: 'Update Component', value: 'updateComponent', action: 'Update component' },
			{ name: 'Delete Component', value: 'deleteComponent', action: 'Delete component' },
			{ name: 'List Components', value: 'listComponents', action: 'List components' },
			{ name: 'Get Component Types', value: 'getComponentTypes', action: 'Get component types' },
			{ name: 'Create Component Type', value: 'createComponentType', action: 'Create component type' },
			{ name: 'Update Component Type', value: 'updateComponentType', action: 'Update component type' },
			{ name: 'Delete Component Type', value: 'deleteComponentType', action: 'Delete component type' },
		],
		default: 'getComponent',
	},
];

const componentCreateUpdateFieldOptions: INodeProperties[] = [
	{ displayName: 'Inventory Number', name: 'inventoryNumber', type: 'string' as const, default: '' },
	{ displayName: 'Component Type ID', name: 'componentTypeId', type: 'number' as const, default: 0 },
	{ displayName: 'PC ID', name: 'pcId', type: 'number' as const, default: 0 },
	{ displayName: 'Periphery ID', name: 'peripheryId', type: 'number' as const, default: 0 },
	{ displayName: 'Manufacturer ID', name: 'manufacturerId', type: 'number' as const, default: 0 },
	{ displayName: 'Type', name: 'type', type: 'string' as const, default: '' },
	{ displayName: 'Serial Number', name: 'serialNumber', type: 'string' as const, default: '' },
	{ displayName: 'Megabytes', name: 'megabytes', type: 'number' as const, default: 0 },
	{ displayName: 'HDD Type ID', name: 'hddTypeId', type: 'number' as const, default: 0 },
	{ displayName: 'SCSI ID', name: 'scsiId', type: 'string' as const, default: '' },
	{ displayName: 'On Board', name: 'onBoard', type: 'boolean' as const, default: false },
	{ displayName: 'Company ID', name: 'companyId', type: 'number' as const, default: 0 },
	{ displayName: 'Remark', name: 'remark', type: 'string' as const, default: '' },
	{ displayName: 'Active', name: 'active', type: 'boolean' as const, default: true },
	{ displayName: 'Date (Timestamp)', name: 'date', type: 'number' as const, default: 0 },
	{ displayName: 'Billing Number', name: 'billingNumber', type: 'string' as const, default: '' },
	{ displayName: 'Article Number', name: 'articleNumber', type: 'string' as const, default: '' },
	{ displayName: 'Storage ID', name: 'storageId', type: 'number' as const, default: 0 },
	{ displayName: 'Purchase Price', name: 'purchasePrice', type: 'number' as const, default: 0 },
	{ displayName: 'Selling Price', name: 'sellingPrice', type: 'number' as const, default: 0 },
	{ displayName: 'Description', name: 'description', type: 'string' as const, default: '' },
];

export const componentsFields: INodeProperties[] = [
	{
		displayName: 'Component ID',
		name: 'componentId',
		type: 'number' as const,
		required: true,
		default: 0,
		displayOptions: { show: { resource: ['components'], operation: ['getComponent', 'updateComponent', 'deleteComponent'] } },
		description: 'ID of the component',
	},
	{
		displayName: 'Create Component Fields',
		name: 'createComponentFields',
		type: 'collection' as const,
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['components'], operation: ['createComponent'] } },
		options: [{ displayName: 'ID', name: 'id', type: 'number' as const, default: 0 }, ...componentCreateUpdateFieldOptions],
	},
	{
		displayName: 'Update Component Fields',
		name: 'updateComponentFields',
		type: 'collection' as const,
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['components'], operation: ['updateComponent'] } },
		options: componentCreateUpdateFieldOptions,
	},
	{
		displayName: 'List Components Filters',
		name: 'listComponentFilters',
		type: 'collection' as const,
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: { resource: ['components'], operation: ['listComponents'] } },
		options: [
			{ displayName: 'Company ID', name: 'companyId', type: 'number' as const, default: 0, description: 'Show only entries of this company' },
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
			},
			{
				displayName: 'Component Type ID',
				name: 'componentTypeId',
				type: 'number' as const,
				default: 0,
				description: 'ID of the component type to be filtered',
			},
			{ displayName: 'PC ID', name: 'pcId', type: 'number' as const, default: 0, description: 'If only components of a given pc shall be displayed' },
			{
				displayName: 'Periphery ID',
				name: 'peripheryId',
				type: 'number' as const,
				default: 0,
				description: 'If only components of a given periphery shall be displayed',
			},
			{
				displayName: 'Built In Filter',
				name: 'builtInFilter',
				type: 'options' as const,
				options: [
					{ name: 'NOT_BUILT_IN_COMPONENTS', value: 'NOT_BUILT_IN_COMPONENTS' },
					{ name: 'COMPONENTS_IN_PCS', value: 'COMPONENTS_IN_PCS' },
					{ name: 'COMPONENTS_IN_PERIPHERIES', value: 'COMPONENTS_IN_PERIPHERIES' },
				],
				default: 'NOT_BUILT_IN_COMPONENTS',
				description: 'Filter settings for built in state of the component',
			},
		],
	},

	{
		displayName: 'Component Type ID',
		name: 'componentTypeIdParam',
		type: 'number' as const,
		required: true,
		default: 0,
		displayOptions: { show: { resource: ['components'], operation: ['updateComponentType', 'deleteComponentType'] } },
		description: 'ID of the component type (path param)',
	},

	{
		displayName: 'Create Component Type Fields',
		name: 'createComponentTypeFields',
		type: 'collection' as const,
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['components'], operation: ['createComponentType'] } },
		options: [
			{ displayName: 'ID', name: 'id', type: 'number' as const, default: 0 },
			{ displayName: 'Type', name: 'type', type: 'string' as const, default: '' },
			{ displayName: 'Short Name', name: 'shortName', type: 'string' as const, default: '' },
			{ displayName: 'Shown', name: 'shown', type: 'boolean' as const, default: true },
		],
	},

	{
		displayName: 'Update Component Type Fields',
		name: 'updateComponentTypeFields',
		type: 'collection' as const,
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['components'], operation: ['updateComponentType'] } },
		options: [
			{ displayName: 'ID', name: 'id', type: 'number' as const, default: 0 },
			{ displayName: 'Type', name: 'type', type: 'string' as const, default: '' },
			{ displayName: 'Short Name', name: 'shortName', type: 'string' as const, default: '' },
			{ displayName: 'Shown', name: 'shown', type: 'boolean' as const, default: true },
		],
	},
];

export async function handleComponents(this: IExecuteFunctions, i: number) {
	const operation = this.getNodeParameter('operation', i) as string;
	const credentials = { baseURL: await getTanssBaseUrl.call(this, i) };
	const componentsBasePath = isGeneratedTokenMode.call(this, i) ? '/backend/api/deviceManagement/v1/components' : '/backend/api/v1/components';

	if (!credentials) throw new NodeOperationError(this.getNode(), 'No credentials returned!');
	const componentId = this.getNodeParameter('componentId', i, 0) as number;

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
		case 'getComponent': {
			url = `${credentials.baseURL}${componentsBasePath}/${componentId}`;
			requestOptions.method = 'GET';
			break;
		}
		case 'updateComponent': {
			const updateFields = this.getNodeParameter('updateComponentFields', i, {}) as Record<string, unknown>;
			if (!componentId) throw new NodeOperationError(this.getNode(), 'componentId is required for update.');
			if (Object.keys(updateFields).length === 0) throw new NodeOperationError(this.getNode(), 'No fields provided for updating component.');
			url = `${credentials.baseURL}${componentsBasePath}/${componentId}`;
			requestOptions.method = 'PUT';
			requestOptions.body = updateFields;
			break;
		}
		case 'deleteComponent': {
			if (!componentId) throw new NodeOperationError(this.getNode(), 'componentId is required for delete.');
			url = `${credentials.baseURL}${componentsBasePath}/${componentId}`;
			requestOptions.method = 'DELETE';
			break;
		}
		case 'createComponent': {
			const createFields = this.getNodeParameter('createComponentFields', i, {}) as Record<string, unknown>;
			if (Object.keys(createFields).length === 0) throw new NodeOperationError(this.getNode(), 'No fields provided for creating component.');
			url = `${credentials.baseURL}${componentsBasePath}`;
			requestOptions.method = 'POST';
			requestOptions.body = createFields;
			break;
		}
		case 'listComponents': {
			const filters = this.getNodeParameter('listComponentFilters', i, {}) as Record<string, unknown>;
			url = `${credentials.baseURL}${componentsBasePath}`;
			requestOptions.method = 'PUT';
			requestOptions.body = filters;
			break;
		}
		case 'getComponentTypes': {
			url = `${credentials.baseURL}${componentsBasePath}/types`;
			requestOptions.method = 'GET';
			break;
		}
		case 'createComponentType': {
			const createType = this.getNodeParameter('createComponentTypeFields', i, {}) as Record<string, unknown>;
			if (Object.keys(createType).length === 0) throw new NodeOperationError(this.getNode(), 'No fields provided for creating component type.');
			url = `${credentials.baseURL}${componentsBasePath}/types`;
			requestOptions.method = 'POST';
			requestOptions.body = createType;
			break;
		}
		case 'updateComponentType': {
			const typeId = this.getNodeParameter('componentTypeIdParam', i, 0) as number;
			if (!typeId) throw new NodeOperationError(this.getNode(), 'component type id is required for update.');
			const updateType = this.getNodeParameter('updateComponentTypeFields', i, {}) as Record<string, unknown>;
			if (Object.keys(updateType).length === 0) throw new NodeOperationError(this.getNode(), 'No fields provided for updating component type.');
			url = `${credentials.baseURL}${componentsBasePath}/types/${typeId}`;
			requestOptions.method = 'PUT';
			requestOptions.body = updateType;
			break;
		}
		case 'deleteComponentType': {
			const typeId = this.getNodeParameter('componentTypeIdParam', i, 0) as number;
			if (!typeId) throw new NodeOperationError(this.getNode(), 'component type id is required for delete.');
			url = `${credentials.baseURL}${componentsBasePath}/types/${typeId}`;
			requestOptions.method = 'DELETE';
			break;
		}
		default:
			throw new NodeOperationError(this.getNode(), `The operation "${operation}" is not recognized.`);
	}

	requestOptions.url = url;

	try {
		const responseData = await tanssHttpRequest.call(this, i, requestOptions as unknown as import('n8n-workflow').IHttpRequestOptions);
		if (operation === 'deleteComponent' || operation === 'deleteComponentType') {
			if (responseData === '' || responseData == null) {
				return {
					success: true,
					statusCode: 204,
					message: operation === 'deleteComponentType' ? 'component type deleted' : 'component deleted',
				};
			}
		}
		return responseData;
	} catch (error: unknown) {
		type TanssError = {
			localizedText?: string;
			text?: string;
		};

		const anyErr = error as {
			response?: {
				status?: number;
				data?: unknown;
			};
		};
		let message = error instanceof Error ? error.message : String(error);
		if (anyErr && anyErr.response) {
			try {
				const status = anyErr.response.status;
				const respData = anyErr.response.data;
				if (operation === 'deleteComponent' || operation === 'deleteComponentType') {
					let tanssError: TanssError | undefined;
					if (respData && typeof respData === 'object' && 'error' in respData) {
						const maybeError = (respData as { error?: unknown }).error;
						if (maybeError && typeof maybeError === 'object') {
							tanssError = maybeError as TanssError;
						}
					}
					return {
						success: false,
						statusCode: status,
						message: tanssError?.localizedText ?? tanssError?.text ?? `Delete request failed (status ${status})`,
						error: tanssError ?? respData,
					};
				}
				message += `; Status: ${status}`;
				if (respData) {
					if (typeof respData === 'object' && 'error' in respData && (respData as { error?: unknown }).error) {
						message += `; Error: ${JSON.stringify((respData as { error?: unknown }).error)}`;
					} else {
						message += `; Response: ${JSON.stringify(respData)}`;
					}
				}
			} catch {
				message += '; Response parse failed';
			}
		}

		if (operation === 'deleteComponent' || operation === 'deleteComponentType') {
			return {
				success: false,
				message: message || 'Delete request failed.',
				error: null,
			};
		}
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}
