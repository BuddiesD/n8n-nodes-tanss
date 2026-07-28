import { IExecuteFunctions, INodeProperties, NodeOperationError, NodeApiError, JsonObject } from 'n8n-workflow';
import { getTanssBaseUrl, tanssHttpRequest } from './request';

export const checklistsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options' as const,
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['checklists'],
			},
		},
		options: [
			{
				name: 'Assign Checklist',
				value: 'assignChecklist',
				description: 'Assigns a checklist to a ticket',
				action: 'Assigns a checklist to a ticket',
			},
			{
				name: 'Check Item',
				value: 'checkItem',
				description: 'Checks or unchecks an item in a checklist',
				action: 'Checks/unchecks an item',
			},
			{
				name: 'Copy Checklist',
				value: 'copyChecklist',
				description: 'Duplicates an existing checklist template',
				action: 'Copies a checklist',
			},
			{
				name: 'Create New Version',
				value: 'createNewVersion',
				description: 'Creates a successor version of an existing checklist',
				action: 'Creates a new checklist version',
			},
			{
				name: 'Delete Checklist',
				value: 'deleteChecklist',
				description: 'Deletes a checklist template',
				action: 'Deletes a checklist',
			},
			{
				name: 'Get Assigned Checklists',
				value: 'getAssignedChecklists',
				description: 'Gets all checklists assigned to a ticket',
				action: 'Gets all checklists assigned to a ticket',
			},
			{
				name: 'Get Checklist',
				value: 'getChecklist',
				description: 'Loads a checklist in edit-mode',
				action: 'Gets a checklist template',
			},
			{
				name: 'Get Checklist Process',
				value: 'getChecklistProcess',
				description: 'Gets checklist details for processing within a ticket',
				action: 'Gets checklist details for processing within a ticket',
			},
			{
				name: 'Get Checklists',
				value: 'getChecklists',
				description: 'Gets a list of selectable checklists',
				action: 'Gets a list of checklists',
			},
			{
				name: 'Remove Checklist',
				value: 'removeChecklist',
				description: 'Removes a checklist assignment from a ticket',
				action: 'Removes a checklist assignment from a ticket',
			},
			{
				name: 'Update Checklist',
				value: 'updateChecklist',
				description: 'Updates an existing checklist template',
				action: 'Updates a checklist',
			},
			{
				name: 'Update Checklist Action',
				value: 'updateChecklistAction',
				description: 'Updates the persisted state of a single checklist action',
				action: 'Updates a checklist action',
			},
		],
		default: 'assignChecklist',
	},
];

export const checklistsFields: INodeProperties[] = [
	{
		displayName: 'Link Type ID',
		name: 'linkTypeId',
		type: 'number' as const,
		required: true,
		displayOptions: {
			show: {
				resource: ['checklists'],
				operation: ['assignChecklist', 'removeChecklist', 'getAssignedChecklists', 'getChecklistProcess', 'updateChecklistAction', 'checkItem'],
			},
		},
		default: 11,
		description: 'Link type ID (11 = ticket)',
	},
	{
		displayName: 'Link ID',
		name: 'linkId',
		type: 'number' as const,
		required: true,
		displayOptions: {
			show: {
				resource: ['checklists'],
				operation: ['assignChecklist', 'removeChecklist', 'getAssignedChecklists', 'getChecklistProcess', 'updateChecklistAction', 'checkItem'],
			},
		},
		default: 0,
		description: 'ID of the ticket',
	},
	{
		displayName: 'Checklist ID',
		name: 'checklistId',
		type: 'number' as const,
		required: true,
		displayOptions: {
			show: {
				resource: ['checklists'],
				operation: [
					'assignChecklist',
					'removeChecklist',
					'getChecklistProcess',
					'copyChecklist',
					'createNewVersion',
					'deleteChecklist',
					'getChecklist',
					'updateChecklist',
				],
			},
		},
		default: 0,
		description: 'ID of the checklist',
	},
	{
		displayName: 'Filters',
		name: 'getChecklistsFilters',
		type: 'collection' as const,
		placeholder: 'Add Filter',
		displayOptions: {
			show: {
				resource: ['checklists'],
				operation: ['getChecklists'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Company ID',
				name: 'companyId',
				type: 'number' as const,
				default: 0,
				description: 'Optional company ID to filter the checklists',
			},
			{
				displayName: 'Department ID',
				name: 'departmentId',
				type: 'number' as const,
				default: 0,
				description: 'Optional department ID to filter the checklists',
			},
		],
	},
	{
		displayName: 'Update Included In Checklists',
		name: 'updateIncludedInChecklists',
		type: 'boolean' as const,
		displayOptions: {
			show: {
				resource: ['checklists'],
				operation: ['createNewVersion'],
			},
		},
		default: false,
		description: 'If true, rewire parent checklists embedding the source to the new version',
	},
	{
		displayName: 'Check Item Body',
		name: 'checkItemFields',
		type: 'collection' as const,
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: ['checklists'],
				operation: ['checkItem'],
			},
		},
		default: {},
		options: [
			{ displayName: 'Item ID', name: 'itemId', type: 'number' as const, default: 0 },
			{ displayName: 'Checklist ID', name: 'checklistId', type: 'number' as const, default: 0 },
			{ displayName: 'Main Checklist ID', name: 'mainChecklistId', type: 'number' as const, default: 0 },
			{ displayName: 'Value', name: 'value', type: 'number' as const, default: 1, description: '1 = check, 0 = uncheck' },
			{ displayName: 'Multi Select ID', name: 'multiSelectId', type: 'number' as const, default: 0 },
			{ displayName: 'Vars', name: 'vars', type: 'json' as const, default: '', description: 'Optional vars for checking this field' },
		],
	},
	{
		displayName: 'Update Checklist Action Body',
		name: 'updateChecklistActionFields',
		type: 'collection' as const,
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: ['checklists'],
				operation: ['updateChecklistAction'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Checklist ID',
				name: 'checklistId',
				type: 'number' as const,
				default: 0,
				description: 'Identifier of the checklist the action belongs to',
			},
			{
				displayName: 'Checklist Main ID',
				name: 'checklistMainId',
				type: 'number' as const,
				default: 0,
				description: 'Identifier of the top-level checklist',
			},
			{
				displayName: 'Checklist Item ID',
				name: 'checklistItemId',
				type: 'number' as const,
				default: 0,
				description: 'Identifier of the checklist item the action refers to',
			},
			{
				displayName: 'Value',
				name: 'value',
				type: 'number' as const,
				default: 0,
				description: 'Recorded value for the action; a positive value marks the item as checked',
			},
			{ displayName: 'Date', name: 'date', type: 'number' as const, default: 0, description: 'Timestamp when the action was performed' },
			{
				displayName: 'User ID',
				name: 'userId',
				type: 'number' as const,
				default: 0,
				description: 'Identifier of the employee who performed the action',
			},
			{ displayName: 'Support ID', name: 'supportId', type: 'number' as const, default: 0, description: 'Identifier of the related support ticket' },
			{ displayName: 'Hidden', name: 'hidden', type: 'boolean' as const, default: false, description: 'Whether the action is hidden' },
		],
	},
	{
		displayName: 'Update Checklist Body',
		name: 'updateChecklistFields',
		type: 'collection' as const,
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: ['checklists'],
				operation: ['updateChecklist'],
			},
		},
		default: {},
		options: [
			{ displayName: 'ID', name: 'id', type: 'number' as const, default: 0, description: 'Unique identifier of the checklist' },
			{ displayName: 'Name', name: 'name', type: 'string' as const, default: '', description: 'Name of the checklist' },
			{ displayName: 'Description', name: 'description', type: 'string' as const, default: '', description: 'Description of the checklist' },
			{
				displayName: 'Type',
				name: 'type',
				type: 'options' as const,
				default: 'CHECKLIST',
				description: 'Kind of checklist',
				options: [
					{ name: 'Checklist', value: 'CHECKLIST' },
					{ name: 'Template', value: 'TEMPLATE' },
					{ name: 'Adhoc', value: 'ADHOC' },
				],
			},
			{
				displayName: 'Creator ID',
				name: 'creatorId',
				type: 'number' as const,
				default: 0,
				description: 'Identifier of the employee who created the checklist',
			},
			{ displayName: 'Active', name: 'active', type: 'boolean' as const, default: true, description: 'Whether the checklist is currently active' },
			{
				displayName: 'Position',
				name: 'position',
				type: 'options' as const,
				default: 'DEFAULT',
				description: 'Display position of the checklist',
				options: [
					{ name: 'Default', value: 'DEFAULT' },
					{ name: 'Top', value: 'TOP' },
				],
			},
			{
				displayName: 'Completed',
				name: 'completed',
				type: 'boolean' as const,
				default: false,
				description: 'Whether the checklist has been completed',
			},
		],
	},
];

export async function handleChecklists(this: IExecuteFunctions, i: number) {
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
		case 'assignChecklist': {
			const linkTypeId = this.getNodeParameter('linkTypeId', i, 11) as number;
			const linkId = this.getNodeParameter('linkId', i, 0) as number;
			const checklistId = this.getNodeParameter('checklistId', i, 0) as number;
			url = `${credentials.baseURL}/backend/api/v1/checklists/assignment/${linkTypeId}/${linkId}/${checklistId}`;
			requestOptions.method = 'POST';
			break;
		}
		case 'removeChecklist': {
			const linkTypeId = this.getNodeParameter('linkTypeId', i, 11) as number;
			const linkId = this.getNodeParameter('linkId', i, 0) as number;
			const checklistId = this.getNodeParameter('checklistId', i, 0) as number;
			url = `${credentials.baseURL}/backend/api/v1/checklists/assignment/${linkTypeId}/${linkId}/${checklistId}`;
			requestOptions.method = 'DELETE';
			break;
		}
		case 'getAssignedChecklists': {
			const linkTypeId = this.getNodeParameter('linkTypeId', i, 11) as number;
			const linkId = this.getNodeParameter('linkId', i, 0) as number;
			url = `${credentials.baseURL}/backend/api/v1/checklists/assignment/${linkTypeId}/${linkId}`;
			requestOptions.method = 'GET';
			break;
		}
		case 'getChecklistProcess': {
			const linkTypeId = this.getNodeParameter('linkTypeId', i, 11) as number;
			const linkId = this.getNodeParameter('linkId', i, 0) as number;
			const checklistId = this.getNodeParameter('checklistId', i, 0) as number;
			url = `${credentials.baseURL}/backend/api/v1/checklists/${checklistId}/process?linkTypeId=${linkTypeId}&linkId=${linkId}`;
			requestOptions.method = 'GET';
			break;
		}
		case 'checkItem': {
			const checkItemFields = this.getNodeParameter('checkItemFields', i, {}) as Record<string, unknown>;
			if (Object.keys(checkItemFields).length === 0) throw new NodeOperationError(this.getNode(), 'No fields provided for checking the item.');
			const linkTypeId = this.getNodeParameter('linkTypeId', i, 11) as number;
			const linkId = this.getNodeParameter('linkId', i, 0) as number;
			url = `${credentials.baseURL}/backend/api/v1/checklists/check`;
			requestOptions.method = 'PUT';
			requestOptions.body = { ...checkItemFields, linkTypeId, linkId };
			break;
		}
		case 'getChecklists': {
			const getChecklistsFilters = this.getNodeParameter('getChecklistsFilters', i, {}) as Record<string, unknown>;
			const companyId = (getChecklistsFilters.companyId ?? 0) as number;
			const departmentId = (getChecklistsFilters.departmentId ?? 0) as number;
			const queryParams = new URLSearchParams();
			if (companyId > 0) queryParams.append('companyId', String(companyId));
			if (departmentId > 0) queryParams.append('departmentId', String(departmentId));
			const queryString = queryParams.toString();
			url = `${credentials.baseURL}/backend/api/v1/checklists${queryString ? '?' + queryString : ''}`;
			requestOptions.method = 'GET';
			break;
		}
		case 'updateChecklistAction': {
			const updateChecklistActionFields = this.getNodeParameter('updateChecklistActionFields', i, {}) as Record<string, unknown>;
			if (Object.keys(updateChecklistActionFields).length === 0)
				throw new NodeOperationError(this.getNode(), 'No fields provided for updating the checklist action.');
			url = `${credentials.baseURL}/backend/api/v1/checklists/action`;
			requestOptions.method = 'PUT';
			requestOptions.body = updateChecklistActionFields;
			break;
		}
		case 'copyChecklist': {
			const checklistId = this.getNodeParameter('checklistId', i, 0) as number;
			url = `${credentials.baseURL}/backend/api/v1/checklists/copy/${checklistId}`;
			requestOptions.method = 'POST';
			break;
		}
		case 'createNewVersion': {
			const checklistId = this.getNodeParameter('checklistId', i, 0) as number;
			const updateIncludedInChecklists = this.getNodeParameter('updateIncludedInChecklists', i, false) as boolean;
			url = `${credentials.baseURL}/backend/api/v1/checklists/createNewVersion/${checklistId}${updateIncludedInChecklists ? '?updateIncludedInChecklists=true' : ''}`;
			requestOptions.method = 'POST';
			break;
		}
		case 'deleteChecklist': {
			const checklistId = this.getNodeParameter('checklistId', i, 0) as number;
			url = `${credentials.baseURL}/backend/api/v1/checklists/${checklistId}`;
			requestOptions.method = 'DELETE';
			break;
		}
		case 'getChecklist': {
			const checklistId = this.getNodeParameter('checklistId', i, 0) as number;
			url = `${credentials.baseURL}/backend/api/v1/checklists/${checklistId}`;
			requestOptions.method = 'GET';
			break;
		}
		case 'updateChecklist': {
			const checklistId = this.getNodeParameter('checklistId', i, 0) as number;
			const updateChecklistFields = this.getNodeParameter('updateChecklistFields', i, {}) as Record<string, unknown>;
			if (Object.keys(updateChecklistFields).length === 0)
				throw new NodeOperationError(this.getNode(), 'No fields provided for updating the checklist.');
			url = `${credentials.baseURL}/backend/api/v1/checklists/${checklistId}`;
			requestOptions.method = 'PUT';
			requestOptions.body = updateChecklistFields;
			break;
		}
		default:
			throw new NodeOperationError(this.getNode(), `The operation "${operation}" is not recognized.`);
	}

	requestOptions.url = url;

	try {
		if (operation === 'removeChecklist' || operation === 'deleteChecklist') {
			const fullResponse = (await tanssHttpRequest.call(this, i, {
				...(requestOptions as unknown as Record<string, unknown>),
				simple: false,
				resolveWithFullResponse: true,
			} as unknown as import('n8n-workflow').IHttpRequestOptions)) as unknown as {
				statusCode?: number;
				body?: unknown;
			};

			const statusCode = fullResponse?.statusCode ?? 0;
			const tanssBody = (fullResponse?.body ?? null) as { error?: { localizedText?: string; text?: string; type?: string } } | null;
			const tanssError = tanssBody?.error;

			if (statusCode === 200 || statusCode === 204 || (!tanssError && statusCode === 0)) {
				return { success: true, statusCode, message: 'Checklist removed successfully.' };
			}

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
		if (operation === 'removeChecklist' || operation === 'deleteChecklist') {
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
