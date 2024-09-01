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
				displayName: 'Category',
				name: 'category',
				type: 'options',
				options: [
					{
						name: 'Authentication',
						value: 'authentication',
					},
					{
						name: 'Ticket Lists',
						value: 'ticketLists',
					},
				],
				default: 'authentication',
				description: 'Category of the operation',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				displayOptions: {
					show: {
						category: ['authentication'],
					},
				},
				options: [
					{
						name: 'Login',
						value: 'login',
						description: 'Login to the TANSS API',
						action: 'Login to the TANSS API',
					},
				],
				default: 'login',
				noDataExpression: true,
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				displayOptions: {
					show: {
						category: ['ticketLists'],
					},
				},
				options: [
					{
						name: 'Get Company Tickets',
						value: 'getCompanyTickets',
						description: 'Gets a list of tickets for a given company',
						action: 'Gets a list of company tickets',
					},
					{
						name: 'Get Custom Ticket List',
						value: 'getCustomTicketList',
						description: 'Gets a custom list of tickets based on various filters',
						action: 'Gets a custom ticket list',
					},
					{
						name: 'Get General Tickets',
						value: 'getGeneralTickets',
						description: 'Gets a list of general tickets assigned to no employee',
						action: 'Gets a list of general tickets',
					},
					{
						name: 'Get Local Admin Tickets',
						value: 'getLocalAdminTickets',
						description: 'Gets a list of all tickets under control of local ticket admins',
						action: 'Gets a list of local admin tickets',
					},
					{
						name: 'Get Not Identified Tickets',
						value: 'getNotIdentifiedTickets',
						description: 'Gets a list of all tickets which couldn\'t be assigned to a company',
						action: 'Gets a list of not identified tickets',
					},
					{
						name: 'Get Own Tickets',
						value: 'getOwnTickets',
						description: 'Gets a list of own tickets assigned to the currently logged in employee',
						action: 'Gets a list of own tickets',
					},
					{
						name: 'Get Project Tickets',
						value: 'getProjectTickets',
						description: 'Gets a list of all projects',
						action: 'Gets a list of project tickets',
					},
					{
						name: 'Get Repair Tickets',
						value: 'getRepairTickets',
						description: 'Gets a list of all repair tickets',
						action: 'Gets a list of repair tickets',
					},
					{
						name: 'Get Technician Tickets',
						value: 'getTechnicianTickets',
						description: 'Gets a list of tickets of all technicians (excluding currently logged in employee)',
						action: 'Gets a list of technician tickets',
					},
					{
						name: 'Get Tickets with Role',
						value: 'getTicketsWithRole',
						description: 'Gets a list of tickets the currently logged in technician has a role in',
						action: 'Gets a list of tickets with role',
					},
				],
				default: 'getOwnTickets',
				noDataExpression: true,
			},
			{
				displayName: 'API Token',
				name: 'apiToken',
				type: 'string',
				displayOptions: {
					show: {
						category: ['ticketLists'],
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
				displayName: 'Filters',
				name: 'filters',
				type: 'fixedCollection',
				placeholder: 'Add Filter',
				displayOptions: {
					show: {
						operation: ['getCustomTicketList'],
					},
				},
				typeOptions: {
					multipleValues: true,
				},
				default: {},
				options: [
					{
						name: 'companyFilter',
						displayName: 'Company ID Filter',
						values: [
							{
								displayName: 'Company ID',
								name: 'companyId',
								type: 'number',
								default: 0,
								description: 'The ID of the company to fetch tickets for',
							},
						],
					},
					{
						name: 'staffFilter',
						displayName: 'Staff IDs Filter',
						values: [
							{
								displayName: 'Staff IDs',
								name: 'staff',
								type: 'string',
								default: '',
								description: 'Comma-separated list of staff IDs to fetch tickets assigned to these employees',
							},
						],
					},
					{
						name: 'notAssignedFilter',
						displayName: 'Not Assigned to Employees Filter',
						values: [
							{
								displayName: 'Not Assigned to Employees',
								name: 'notAssignedToEmployees',
								type: 'string',
								default: '',
								description: 'Comma-separated list of employee IDs to exclude from fetching',
							},
						],
					},
					{
						name: 'departmentFilter',
						displayName: 'Department IDs Filter',
						values: [
							{
								displayName: 'Department IDs',
								name: 'departments',
								type: 'string',
								default: '',
								description: 'Comma-separated list of department IDs to fetch tickets assigned to these departments',
							},
						],
					},
					{
						name: 'isRepairFilter',
						displayName: 'Is Repair Filter',
						values: [
							{
								displayName: 'Is Repair',
								name: 'isRepair',
								type: 'boolean',
								default: false,
								description: 'Whether to fetch only repair tickets if set to true',
							},
						],
					},
					{
						name: 'includeDoneTicketsFilter',
						displayName: 'Include Done Tickets Filter',
						values: [
							{
								displayName: 'Include Done Tickets',
								name: 'includeDoneTickets',
								type: 'boolean',
								default: false,
								description: 'Whether to include done tickets if set to true',
							},
						],
					},
					{
						name: 'ticketIdsFilter',
						displayName: 'Ticket IDs Filter',
						values: [
							{
								displayName: 'Ticket IDs',
								name: 'ids',
								type: 'string',
								default: '',
								description: 'Comma-separated list of ticket IDs to fetch',
							},
						],
					},
					{
						name: 'projectFilter',
						displayName: 'Project ID Filter',
						values: [
							{
								displayName: 'Project ID',
								name: 'projectId',
								type: 'number',
								default: 0,
								description: 'Fetch only tickets of this project',
							},
						],
					},
					{
						name: 'phaseFilter',
						displayName: 'Phase ID Filter',
						values: [
							{
								displayName: 'Phase ID',
								name: 'phaseId',
								type: 'number',
								default: 0,
								description: 'Fetch only tickets of a given phase ID',
							},
						],
					},
					{
						name: 'remitterFilter',
						displayName: 'Remitter ID Filter',
						values: [
							{
								displayName: 'Remitter ID',
								name: 'remitterId',
								type: 'number',
								default: 0,
								description: 'Fetch only tickets of this remitter ID',
							},
						],
					},
					{
						name: 'paginationFilter',
						displayName: 'Pagination Filter',
						values: [
							{
								displayName: 'Items Per Page',
								name: 'itemsPerPage',
								type: 'number',
								default: 10,
								description: 'Number of tickets to fetch per page (pagination)',
							},
							{
								displayName: 'Page Number',
								name: 'page',
								type: 'number',
								default: 1,
								description: 'Page number to fetch (pagination)',
							},
						],
					},
				],
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
			const category = this.getNodeParameter('category', i) as string;
			const operation = this.getNodeParameter('operation', i) as string;
			const apiToken = this.getNodeParameter('apiToken', i, '') as string;

			let requestOptions: any;
			let url: string;

			if (category === 'authentication') {
				if (operation === 'login') {
					const username = credentials.username as string;
					const password = credentials.password as string;
					url = `${credentials.baseURL}/api/v1/login`;
					requestOptions = {
						method: 'POST' as IHttpRequestMethods,
						url,
						body: { username, password },
						json: true,
					};
				} else {
					throw new NodeOperationError(this.getNode(), `The operation "${operation}" is not recognized in category "authentication".`);
				}
			} else if (category === 'ticketLists') {
				switch (operation) {
					case 'getOwnTickets':
						url = `${credentials.baseURL}/api/v1/tickets/own`;
						requestOptions = {
							method: 'GET' as IHttpRequestMethods,
							url,
							headers: { apiToken, 'Content-Type': 'application/json' },
							json: true,
						};
						break;
					case 'getGeneralTickets':
						url = `${credentials.baseURL}/api/v1/tickets/general`;
						requestOptions = {
							method: 'GET' as IHttpRequestMethods,
							url,
							headers: { apiToken, 'Content-Type': 'application/json' },
							json: true,
						};
						break;
					case 'getCompanyTickets':
						const companyId = this.getNodeParameter('companyId', i) as number;
						url = `${credentials.baseURL}/api/v1/tickets/company/${companyId}`;
						requestOptions = {
							method: 'GET' as IHttpRequestMethods,
							url,
							headers: { apiToken, 'Content-Type': 'application/json' },
							json: true,
						};
						break;
					case 'getCustomTicketList':
						url = `${credentials.baseURL}/api/v1/tickets`;

						const filterOptions = this.getNodeParameter('filters', i) as { filters: Array<{ [key: string]: any }> };

						const customFilters: any = {};
						if (Array.isArray(filterOptions.filters)) {
							for (const filter of filterOptions.filters) {
								for (const [key, value] of Object.entries(filter)) {
									if (value !== undefined && value !== '') {
										customFilters[key] = typeof value === 'string' && value.includes(',')
											? value.split(',').map(Number)
											: value;
									}
								}
							}
						}

						requestOptions = {
							method: 'PUT' as IHttpRequestMethods,
							url,
							headers: { apiToken, 'Content-Type': 'application/json' },
							body: customFilters,
							json: true,
						};
						break;
					default:
						throw new NodeOperationError(this.getNode(), `The operation "${operation}" is not recognized in category "ticketLists".`);
				}
			} else {
				throw new NodeOperationError(this.getNode(), `The category "${category}" is not recognized.`);
			}

			try {
				const responseData = await this.helpers.request(requestOptions);
				returnData.push({ json: responseData });
			} catch (error) {
				throw new NodeOperationError(this.getNode(), `Failed to execute ${operation}: ${error.message}`);
			}
		}

		return [returnData];
	}
}
