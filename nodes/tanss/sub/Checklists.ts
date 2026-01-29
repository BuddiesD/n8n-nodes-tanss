import { IExecuteFunctions, INodeProperties, NodeOperationError } from 'n8n-workflow';

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
				name: 'Remove Checklist',
				value: 'removeChecklist',
				description: 'Removes a checklist assignment from a ticket',
				action: 'Removes a checklist assignment from a ticket',
			},
			{
				name: 'Get Assigned Checklists',
				value: 'getAssignedChecklists',
				description: 'Gets all checklists assigned to a ticket',
				action: 'Gets all checklists assigned to a ticket',
			},
			{
				name: 'Get Checklist Process',
				value: 'getChecklistProcess',
				description: 'Gets checklist details for processing within a ticket',
				action: 'Gets checklist details for processing within a ticket',
			},
			{
				name: 'Check Item',
				value: 'checkItem',
				description: 'Checks or unchecks an item in a checklist',
				action: 'Checks/unchecks an item',
			},
		],
		default: 'assignChecklist',
	},
];

export const checklistsFields: INodeProperties[] = [
	{
		displayName: 'API Token',
		name: 'apiToken',
		type: 'string' as const,
		required: true,
		typeOptions: { password: true },
		default: '',
		description: 'API token obtained from the TANSS API login',
		displayOptions: {
			show: {
				resource: ['checklists'],
			},
		},
	},
	{
		displayName: 'Link Type ID',
		name: 'linkTypeId',
		type: 'number' as const,
		displayOptions: {
			show: {
				resource: ['checklists'],
				operation: ['assignChecklist', 'removeChecklist', 'getAssignedChecklists', 'getChecklistProcess'],
			},
		},
		default: 11,
		description: 'Link type ID (11 = ticket)',
	},
	{
		displayName: 'Link ID',
		name: 'linkId',
		type: 'number' as const,
		displayOptions: {
			show: {
				resource: ['checklists'],
				operation: ['assignChecklist', 'removeChecklist', 'getAssignedChecklists', 'getChecklistProcess'],
			},
		},
		default: 0,
		description: 'ID of the ticket',
	},
	{
		displayName: 'Checklist ID',
		name: 'checklistId',
		type: 'number' as const,
		displayOptions: {
			show: {
				resource: ['checklists'],
				operation: ['assignChecklist', 'removeChecklist', 'getChecklistProcess'],
			},
		},
		default: 0,
		description: 'ID of the checklist to assign',
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
			{ displayName: 'Link Type ID', name: 'linkTypeId', type: 'number' as const, default: 11 },
			{ displayName: 'Link ID', name: 'linkId', type: 'number' as const, default: 0 },
			{ displayName: 'Value', name: 'value', type: 'number' as const, default: 1, description: '1 = check, 0 = uncheck' },
			{ displayName: 'Multi Select ID', name: 'multiSelectId', type: 'number' as const, default: 0 },
			{ displayName: 'Vars', name: 'vars', type: 'json' as const, default: '', description: 'Optional vars for checking this field' },
		],
	},
];

export async function handleChecklists(this: IExecuteFunctions, i: number) {
	const operation = this.getNodeParameter('operation', i) as string;
	const credentials = await this.getCredentials('tanssApi');

	if (!credentials) throw new NodeOperationError(this.getNode(), 'No credentials returned!');

	const apiToken = this.getNodeParameter('apiToken', i, '') as string;
	const linkTypeId = this.getNodeParameter('linkTypeId', i, 11) as number;
	const linkId = this.getNodeParameter('linkId', i, 0) as number;
	const checklistId = this.getNodeParameter('checklistId', i, 0) as number;

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
		case 'assignChecklist': {
			url = `${credentials.baseURL}/backend/api/v1/checklists/assignment/${linkTypeId}/${linkId}/${checklistId}`;
			requestOptions.method = 'POST';
			break;
		}
		case 'removeChecklist': {
			url = `${credentials.baseURL}/backend/api/v1/checklists/assignment/${linkTypeId}/${linkId}/${checklistId}`;
			requestOptions.method = 'DELETE';
			break;
		}
		case 'getAssignedChecklists': {
			url = `${credentials.baseURL}/backend/api/v1/checklists/assignment/${linkTypeId}/${linkId}`;
			requestOptions.method = 'GET';
			break;
		}
		case 'getChecklistProcess': {
			url = `${credentials.baseURL}/backend/api/v1/checklists/${checklistId}/process?linkTypeId=${linkTypeId}&linkId=${linkId}`;
			requestOptions.method = 'GET';
			break;
		}
		case 'checkItem': {
			const checkItemFields = this.getNodeParameter('checkItemFields', i, {}) as Record<string, unknown>;
			if (Object.keys(checkItemFields).length === 0) throw new NodeOperationError(this.getNode(), 'No fields provided for checking the item.');
			url = `${credentials.baseURL}/backend/api/v1/checklists/check`;
			requestOptions.method = 'PUT';
			requestOptions.body = checkItemFields;
			break;
		}
		default:
			throw new NodeOperationError(this.getNode(), `The operation "${operation}" is not recognized.`);
	}

	requestOptions.url = url;

	try {
		const responseData = await this.helpers.httpRequest(requestOptions as unknown as import('n8n-workflow').IHttpRequestOptions);
		return responseData;
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		throw new NodeOperationError(this.getNode(), `Failed to execute ${operation}: ${errorMessage}`);
	}
}
