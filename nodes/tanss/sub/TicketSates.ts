import {
	IExecuteFunctions,
	INodeProperties,
	NodeOperationError,
	IDataObject,
	IHttpRequestOptions,
} from 'n8n-workflow';

export const ticketStatesOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options' as const,
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['ticketStates'],
			},
		},
		options: [
			{
				name: 'Get Ticket States',
				value: 'getTicketStates',
				description: 'Gets a list of all ticket states',
				action: 'Get ticket states',
			},
			{
				name: 'Create Ticket State',
				value: 'createTicketState',
				description: 'Creates a new ticket state',
				action: 'Create a ticket state',
			},
			{
				name: 'Update Ticket State',
				value: 'updateTicketState',
				description: 'Updates an existing ticket state',
				action: 'Update a ticket state',
			},
			{
				name: 'Delete Ticket State',
				value: 'deleteTicketState',
				description: 'Deletes a ticket state',
				action: 'Delete a ticket state',
			},
		],
		default: 'getTicketStates',
	},
];

export const ticketStatesFields: INodeProperties[] = [
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
				resource: ['ticketStates'],
			},
		},
	},
	// ID field used by update/delete (single fetch removed)
	{
		displayName: 'Ticket State ID',
		name: 'id',
		type: 'number' as const,
		default: 0,
		description: 'ID of the ticket state',
		displayOptions: {
			show: {
				resource: ['ticketStates'],
				operation: ['updateTicketState', 'deleteTicketState'],
			},
		},
	},
	// Fields for creating or updating a ticket state
	{
		displayName: 'Name',
		name: 'name',
		type: 'string' as const,
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['ticketStates'],
				operation: ['createTicketState', 'updateTicketState'],
			},
		},
		description: 'Name of the ticket state',
	},
	{
		displayName: 'Image',
		name: 'image',
		type: 'string' as const,
		default: '',
		displayOptions: {
			show: {
				resource: ['ticketStates'],
				operation: ['createTicketState', 'updateTicketState'],
			},
		},
		description: 'Name of the image (must be in folder media/hp/bug_status)',
	},
	{
		displayName: 'Wait State',
		name: 'waitState',
		type: 'boolean' as const,
		default: false,
		displayOptions: {
			show: {
				resource: ['ticketStates'],
				operation: ['createTicketState', 'updateTicketState'],
			},
		},
		description: 'Determines if this state is a waiting state',
	},
	{
		displayName: 'Rank',
		name: 'rank',
		type: 'number' as const,
		default: 0,
		displayOptions: {
			show: {
				resource: ['ticketStates'],
				operation: ['createTicketState', 'updateTicketState'],
			},
		},
		description: 'Rank of this state (position in lists)',
	},
	{
		displayName: 'Active',
		name: 'active',
		type: 'boolean' as const,
		default: true,
		displayOptions: {
			show: {
				resource: ['ticketStates'],
				operation: ['createTicketState', 'updateTicketState'],
			},
		},
		description: "Is this an active state? (otherwise won't be shown)",
	},
];

export async function handleTicketStates(this: IExecuteFunctions, i: number) {
	const operation = this.getNodeParameter('operation', i) as string;
	const allowed = [
		'getTicketStates',
		'createTicketState',
		'updateTicketState',
		'deleteTicketState',
	] as const;
	if (!allowed.includes(operation as (typeof allowed)[number])) {
		throw new NodeOperationError(
			this.getNode(),
			`Operation "${operation}" not supported by TicketStates.`,
		);
	}

	const credentials = await this.getCredentials('tanssApi');
	if (!credentials) throw new NodeOperationError(this.getNode(), 'No credentials returned!');

	const apiToken = this.getNodeParameter('apiToken', i, '') as string;
	const typedCredentials = credentials as { baseURL?: string };
	const baseURL = typedCredentials.baseURL;
	if (!baseURL) throw new NodeOperationError(this.getNode(), 'No baseURL in credentials');

	// GET list
	if (operation === 'getTicketStates') {
		const url = `${baseURL}/backend/api/v1/admin/ticketStates`;
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
			throw new NodeOperationError(this.getNode(), `Failed to fetch ticket states: ${message}`);
		}
	}

	// CREATE
	if (operation === 'createTicketState') {
		const name = this.getNodeParameter('name', i) as string;
		if (!name)
			throw new NodeOperationError(this.getNode(), 'Name is required to create a ticket state.');
		const image = this.getNodeParameter('image', i, '') as string;
		const waitState = this.getNodeParameter('waitState', i, false) as boolean;
		const rank = this.getNodeParameter('rank', i, 0) as number;
		const active = this.getNodeParameter('active', i, true) as boolean;

		const body: IDataObject = {
			name,
			image,
			waitState,
			rank,
			active,
		};

		const url = `${baseURL}/backend/api/v1/admin/ticketStates`;
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
			throw new NodeOperationError(this.getNode(), `Failed to create ticket state: ${message}`);
		}
	}

	// UPDATE
	if (operation === 'updateTicketState') {
		const id = this.getNodeParameter('id', i, 0) as number;
		if (!id || id <= 0)
			throw new NodeOperationError(this.getNode(), 'Valid ID is required to update.');
		const name = this.getNodeParameter('name', i, '') as string;
		const image = this.getNodeParameter('image', i, '') as string;
		const waitState = this.getNodeParameter('waitState', i, false) as boolean;
		const rank = this.getNodeParameter('rank', i, 0) as number;
		const active = this.getNodeParameter('active', i, true) as boolean;

		const body: IDataObject = {
			name,
			image,
			waitState,
			rank,
			active,
		};

		const url = `${baseURL}/backend/api/v1/admin/ticketStates/${id}`;
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
			throw new NodeOperationError(this.getNode(), `Failed to update ticket state: ${message}`);
		}
	}

	// DELETE
	if (operation === 'deleteTicketState') {
		const id = this.getNodeParameter('id', i, 0) as number;
		if (!id || id <= 0)
			throw new NodeOperationError(this.getNode(), 'Valid ID is required to delete.');
		const url = `${baseURL}/backend/api/v1/admin/ticketStates/${id}`;
		const requestOptions: IDataObject = {
			method: 'DELETE',
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
			throw new NodeOperationError(this.getNode(), `Failed to delete ticket state: ${message}`);
		}
	}

	throw new NodeOperationError(this.getNode(), 'Unhandled operation');
}
