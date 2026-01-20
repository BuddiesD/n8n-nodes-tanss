import { IExecuteFunctions, INodeProperties, NodeOperationError } from 'n8n-workflow';

export const ticketListOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options' as const,
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['ticketList'],
			},
		},
		options: [
			{
				name: 'Get All Project Tickets',
				value: 'getProjectTickets',
				description: 'Get a list of all projects',
				action: 'Get a list of all projects',
			},
			{
				name: 'Get Company Tickets',
				value: 'getCompanyTickets',
				description: 'Get tickets for a specific company',
				action: 'Get tickets for a specific company',
			},
			{
				name: 'Get Custom Ticket List',
				value: 'getCustomTicketList',
				description: 'Get a custom ticket list with query parameters',
				action: 'Get a custom ticket list',
			},
			{
				name: 'Get General Tickets',
				value: 'getGeneralTickets',
				description: 'Get general tickets assigned to no employee',
				action: 'Get general tickets assigned to no employee',
			},
			{
				name: 'Get Local Admin Tickets',
				value: 'getLocalAdminTickets',
				description: 'Gets a list of all tickets which are assigned to local ticket admins',
				action: 'Get a list of local admin tickets',
			},
			{
				name: 'Get Not Identified Tickets',
				value: 'getNotIdentifiedTickets',
				description: 'Get tickets not assigned to any company',
				action: 'Get tickets not assigned to any company',
			},
			{
				name: 'Get Own Tickets',
				value: 'getOwnTickets',
				description: 'Get tickets assigned to the current employee',
				action: 'Get tickets assigned to the current employee',
			},
			{
				name: 'Get Repair Tickets',
				value: 'getRepairTickets',
				description: 'Gets a list of repair tickets',
				action: 'Get a list of repair tickets',
			},
			{
				name: 'Get Technician Tickets',
				value: 'getTechnicianTickets',
				description: 'Get tickets assigned to other technicians',
				action: 'Get tickets assigned to other technicians',
			},
			{
				name: 'Get Tickets With Role',
				value: 'getTicketsWithRole',
				description: 'Gets a list of all tickets which a technician has a role in',
				action: 'Get a list of tickets with technician role',
			},
		],
		default: 'getOwnTickets',
	},
];

export const ticketListFields: INodeProperties[] = [
	{
		displayName: 'API Token',
		name: 'apiToken',
		type: 'string' as const,
		required: true,
		typeOptions: {
			password: true,
		},
		default: '',
		description: 'API token obtained from the TANSS API login',
		displayOptions: {
			show: {
				resource: ['ticketList'],
			},
		},
	},
	{
		displayName: 'Company ID',
		name: 'companyId',
		type: 'number' as const,
		displayOptions: {
			show: {
				resource: ['ticketList'],
				operation: ['getCompanyTickets'],
			},
		},
		default: 0,
		description: 'ID of the company for which to fetch tickets',
	},
	{
		displayName: 'Custom Ticket Query',
		name: 'customTicketQuery',
		type: 'collection' as const,
		displayOptions: {
			show: {
				resource: ['ticketList'],
				operation: ['getCustomTicketList'],
			},
		},
		default: {},
		placeholder: 'Add Field',
		options: [
			{
				displayName: 'Companies',
				name: 'companies',
				type: 'string' as const,
				typeOptions: { multipleValues: true },
				default: [],
			},
			{
				displayName: 'Departments',
				name: 'departments',
				type: 'string' as const,
				typeOptions: { multipleValues: true },
				default: [],
			},
			{
				displayName: 'IDs',
				name: 'ids',
				type: 'string' as const,
				typeOptions: { multipleValues: true },
				default: [],
			},
			{
				displayName: 'Include Done Tickets',
				name: 'includeDoneTickets',
				type: 'boolean' as const,
				default: false,
			},
			{ displayName: 'Is Repair', name: 'isRepair', type: 'boolean' as const, default: false },
			{ displayName: 'Items Per Page', name: 'itemsPerPage', type: 'number' as const, default: 20 },
			{
				displayName: 'Modified Within Timeframe',
				name: 'modifiedWithinTimeframe',
				type: 'fixedCollection' as const,
				typeOptions: { multipleValues: false },
				default: {},
				options: [
					{
						name: 'timeframe',
						displayName: 'Timeframe',
						values: [
							{
								displayName: 'From',
								name: 'from',
								type: 'number' as const,
								default: 0,
								description: 'Unix timestamp of the "from" date',
							},
							{
								displayName: 'To',
								name: 'to',
								type: 'number' as const,
								default: 0,
								description: 'Unix timestamp of the "to" date',
							},
						],
					},
				],
			},
			{
				displayName: 'Not Assigned To Employees',
				name: 'notAssignedToEmployees',
				type: 'multiOptions' as const,
				typeOptions: { multipleValues: true },
				default: [],
			},
			{ displayName: 'Page', name: 'page', type: 'number' as const, default: 1 },
			{ displayName: 'Phase ID', name: 'phaseId', type: 'number' as const, default: 0 },
			{ displayName: 'Project ID', name: 'projectId', type: 'number' as const, default: 0 },
			{ displayName: 'Remitter ID', name: 'remitterId', type: 'number' as const, default: 0 },
			{
				displayName: 'Staff',
				name: 'staff',
				type: 'string' as const,
				typeOptions: { multipleValues: true },
				default: [],
			},
			{
				displayName: 'States',
				name: 'states',
				type: 'multiOptions' as const,
				typeOptions: { multipleValues: true },
				default: [],
			},
			{
				displayName: 'Types',
				name: 'types',
				type: 'multiOptions' as const,
				typeOptions: { multipleValues: true },
				default: [],
			},
		],
	},
];

export async function handleTicketList(this: IExecuteFunctions, i: number) {
	const operation = this.getNodeParameter('operation', i) as string;
	const credentials = await this.getCredentials('tanssApi');

	if (!credentials) {
		throw new NodeOperationError(this.getNode(), 'No credentials returned!');
	}

	const apiToken = this.getNodeParameter('apiToken', i, '') as string;

	let url = '';
	const requestOptions: {
		method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD';
		headers: { apiToken: string; 'Content-Type': string };
		json: boolean;
		url?: string;
		body?: unknown;
	} = {
		method: 'GET',
		headers: {
			apiToken,
			'Content-Type': 'application/json',
		},
		json: true,
	};

	switch (operation) {
		case 'getOwnTickets':
			url = `${credentials.baseURL}/backend/api/v1/tickets/own`;
			break;
		case 'getGeneralTickets':
			url = `${credentials.baseURL}/backend/api/v1/tickets/general`;
			break;
		case 'getCompanyTickets': {
			const companyId = this.getNodeParameter('companyId', i) as number;
			url = `${credentials.baseURL}/backend/api/v1/tickets/company/${companyId}`;
			break;
		}
		case 'getNotIdentifiedTickets':
			url = `${credentials.baseURL}/backend/api/v1/tickets/notIdentified`;
			break;
		case 'getProjectTickets':
			url = `${credentials.baseURL}/backend/api/v1/tickets/projects`;
			break;
		case 'getTechnicianTickets':
			url = `${credentials.baseURL}/backend/api/v1/tickets/technician`;
			break;
		case 'getRepairTickets':
			url = `${credentials.baseURL}/backend/api/v1/tickets/repair`;
			break;
		case 'getLocalAdminTickets':
			url = `${credentials.baseURL}/backend/api/v1/tickets/localAdminOverview`;
			break;
		case 'getTicketsWithRole':
			url = `${credentials.baseURL}/backend/api/v1/tickets/withRole`;
			break;
		case 'getCustomTicketList': {
			url = `${credentials.baseURL}/backend/api/v1/tickets`;
			const customTicketQuery = this.getNodeParameter('customTicketQuery', i, {}) as Record<
				string,
				unknown
			>;
			requestOptions.method = 'PUT';
			requestOptions.body = customTicketQuery;
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
		return responseData;
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		throw new NodeOperationError(this.getNode(), `Failed to execute ${operation}: ${errorMessage}`);
	}
}
