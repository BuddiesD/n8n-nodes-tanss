import {
	IExecuteFunctions,
	IHttpRequestMethods,
} from 'n8n-workflow';

import {
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

export class TanssApi implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'TANSS API',
		name: 'tanssApi',
		icon: 'file:tanss.svg',
		group: ['transform'],
		version: 1,
		description: 'Interacts with the TANSS API',
		defaults: {
			name: 'TANSS API',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'tanssApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				options: [
					{
						name: 'Login',
						value: 'login',
						description: 'Login to the TANSS API',
						action: 'Login to the TANSS API',
					},
					{
						name: 'Get Ticket',
						value: 'getTicket',
						description: 'Fetches a ticket by ID and returns its details',
						action: 'Fetches a ticket by ID and returns its details',
					},
					{
						name: 'Get Ticket History',
						value: 'getTicketHistory',
						description: 'Fetches the history of a ticket by ID',
						action: 'Fetches the history of a ticket by ID',
					},
					{
						name: 'Create Comment',
						value: 'createComment',
						description: 'Creates a comment for a given ticket',
						action: 'Creates a comment for a given ticket',
					},
				],
				default: 'login',
				noDataExpression: true,
			},
			{
				displayName: 'Ticket ID',
				name: 'ticketId',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['getTicket', 'getTicketHistory', 'createComment'],
					},
				},
				default: 0,
				required: true,
				description: 'The ID of the ticket to retrieve or comment on',
			},
			{
				displayName: 'API Token',
				name: 'apiToken',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['getTicket', 'getTicketHistory', 'createComment'],
					},
				},
				default: '',
				required: true,
				description: 'API token obtained from a previous login operation',
				typeOptions: {
					password: true,
				},
			},
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['createComment'],
					},
				},
				default: '',
				required: true,
				description: 'Title of the comment to be created',
			},
			{
				displayName: 'Content',
				name: 'content',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['createComment'],
					},
				},
				default: '',
				required: true,
				description: 'Content of the comment to be created',
			},
			{
				displayName: 'Internal',
				name: 'internal',
				type: 'boolean',
				displayOptions: {
					show: {
						operation: ['createComment'],
					},
				},
				default: false,
				required: true,
				description: 'Whether the comment is internal or not',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		// Get the credentials for all operations
		const credentials = await this.getCredentials('tanssApi');

		if (!credentials) {
			throw new NodeOperationError(this.getNode(), 'No credentials returned!');
		}

		for (let i = 0; i < items.length; i++) {
			const operation = this.getNodeParameter('operation', i) as string;

			if (operation === 'login') {
				const username = credentials.username as string;
				const password = credentials.password as string;

				const requestOptions = {
					method: 'POST' as IHttpRequestMethods,
					url: `${credentials.baseURL}/api/v1/login`,
					body: {
						username,
						password,
					},
					json: true,
				};

				try {
					// Perform login request
					const responseData = await this.helpers.request(requestOptions);
					returnData.push({ json: responseData });
				} catch (error) {
					throw new NodeOperationError(this.getNode(), `Login failed: ${error.message}`);
				}
			} else if (operation === 'getTicket') {
				// Get Ticket operation
				const ticketId = this.getNodeParameter('ticketId', i) as number;
				const apiToken = this.getNodeParameter('apiToken', i) as string;

				const requestOptions = {
					method: 'GET' as IHttpRequestMethods,
					url: `${credentials.baseURL}/api/v1/tickets/${ticketId}`,
					headers: {
						apiToken: apiToken,
						'Content-Type': 'application/json',
					},
					json: true,
				};

				try {
					// Perform get ticket request
					const responseData = await this.helpers.request(requestOptions);
					returnData.push({ json: responseData });
				} catch (error) {
					throw new NodeOperationError(this.getNode(), `Failed to fetch ticket: ${error.message}`);
				}
			} else if (operation === 'getTicketHistory') {
				// Get Ticket History operation
				const ticketId = this.getNodeParameter('ticketId', i) as number;
				const apiToken = this.getNodeParameter('apiToken', i) as string;

				const requestOptions = {
					method: 'GET' as IHttpRequestMethods,
					url: `${credentials.baseURL}/api/v1/tickets/history/${ticketId}`,
					headers: {
						apiToken: apiToken,
						'Content-Type': 'application/json',
					},
					json: true,
				};

				try {
					// Perform get ticket history request
					const responseData = await this.helpers.request(requestOptions);
					returnData.push({ json: responseData });
				} catch (error) {
					throw new NodeOperationError(this.getNode(), `Failed to fetch ticket history: ${error.message}`);
				}
			} else if (operation === 'createComment') {
				// Create Comment operation
				const ticketId = this.getNodeParameter('ticketId', i) as number;
				const apiToken = this.getNodeParameter('apiToken', i) as string;
				const title = this.getNodeParameter('title', i) as string;
				const content = this.getNodeParameter('content', i) as string;
				const internal = this.getNodeParameter('internal', i) as boolean;

				const requestOptions = {
					method: 'POST' as IHttpRequestMethods,
					url: `${credentials.baseURL}/api/v1/tickets/${ticketId}/comments`,
					headers: {
						apiToken: apiToken,
						'Content-Type': 'application/json',
					},
					body: {
						title,
						content,
						internal,
					},
					json: true,
				};

				try {
					// Perform create comment request
					const responseData = await this.helpers.request(requestOptions);
					returnData.push({ json: responseData });
				} catch (error) {
					throw new NodeOperationError(this.getNode(), `Failed to create comment: ${error.message}`);
				}
			}
		}

		return [returnData];
	}
}
