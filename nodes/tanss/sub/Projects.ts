import { IExecuteFunctions, INodeProperties, NodeOperationError, NodeApiError, JsonObject } from 'n8n-workflow';
import { getTanssBaseUrl, tanssHttpRequest } from './request';

export const projectOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options' as const,
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['projects'],
			},
		},
		options: [
			{
				name: 'Get Project Tickets',
				value: 'getProjectTickets',
				description: 'Get a list of all projects',
				action: 'Get a list of all projects',
			},
			{
				name: 'Get Project Status',
				value: 'getProjectStatus',
				description: 'Get aggregated status information for a project',
				action: 'Get project status',
			},
			{
				name: 'Get Project Sub-Tickets',
				value: 'getProjectSubTickets',
				description: 'Get sub-tickets and appointments belonging to a project',
				action: 'Get project sub-tickets',
			},
			{
				name: 'Create Project Phase',
				value: 'createProjectPhase',
				description: 'Create a new phase inside a project',
				action: 'Create a project phase',
			},
			{
				name: 'Update Project Phase',
				value: 'updateProjectPhase',
				description: 'Update a project phase',
				action: 'Update a project phase',
			},
			{
				name: 'Delete Project Phase',
				value: 'deleteProjectPhase',
				description: 'Delete a project phase',
				action: 'Delete a project phase',
			},
			{
				name: 'Get Company Tickets For Project',
				value: 'getCompanyTicketsForProject',
				description: 'Get open project-type tickets at the same company as a given ticket',
				action: 'Get company tickets for project',
			},
			{
				name: 'Get Projects For Ticket',
				value: 'getProjectsForTicket',
				description: 'Get projects and their phases that a ticket can be assigned to',
				action: 'Get projects for ticket',
			},
			{
				name: 'Assign Ticket To Project',
				value: 'assignTicketToProject',
				description: 'Assign a ticket to a project and optionally a phase',
				action: 'Assign ticket to project',
			},
		],
		default: 'getProjectTickets',
	},
];

export const projectFields: INodeProperties[] = [
	{
		displayName: 'Project ID',
		name: 'projectId',
		type: 'number' as const,
		required: true,
		default: 0,
		description: 'ID of the project',
		displayOptions: {
			show: {
				resource: ['projects'],
				operation: ['getProjectStatus', 'getProjectSubTickets'],
			},
		},
	},
	{
		displayName: 'Ticket ID',
		name: 'ticketId',
		type: 'number' as const,
		required: true,
		default: 0,
		description: 'ID of the ticket',
		displayOptions: {
			show: {
				resource: ['projects'],
				operation: ['getCompanyTicketsForProject', 'getProjectsForTicket', 'assignTicketToProject'],
			},
		},
	},
	{
		displayName: 'Phase ID',
		name: 'phaseId',
		type: 'number' as const,
		required: true,
		default: 0,
		description: 'ID of the project phase',
		displayOptions: {
			show: {
				resource: ['projects'],
				operation: ['updateProjectPhase', 'deleteProjectPhase'],
			},
		},
	},
	{
		displayName: 'Create Phase Fields',
		name: 'createPhaseFields',
		type: 'collection' as const,
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['projects'],
				operation: ['createProjectPhase'],
			},
		},
		options: [
			{ displayName: 'Project ID', name: 'projectId', type: 'number' as const, default: 0, description: 'ID of the project this phase belongs to' },
			{ displayName: 'Rank', name: 'rank', type: 'number' as const, default: 0, description: 'Ordering rank of the phase within the project' },
			{ displayName: 'Name', name: 'name', type: 'string' as const, default: '', description: 'Display name of the project phase' },
			{ displayName: 'Start Date (Timestamp)', name: 'startDate', type: 'number' as const, default: 0, description: 'Start date as Unix timestamp' },
			{ displayName: 'End Date (Timestamp)', name: 'endDate', type: 'number' as const, default: 0, description: 'End date as Unix timestamp' },
			{
				displayName: 'Closed Pre-Phases Required',
				name: 'closedPrePhasesRequired',
				type: 'boolean' as const,
				default: false,
				description: 'Whether all preceding phases must be closed before this one can start',
			},
			{
				displayName: 'Billing Type',
				name: 'billingType',
				type: 'options' as const,
				default: 'DEFAULT',
				description: 'Billing mode governing how work in the phase is invoiced',
				options: [
					{ name: 'DEFAULT', value: 'DEFAULT' },
					{ name: 'TICKET_MUST_BE_CLOSED', value: 'TICKET_MUST_BE_CLOSED' },
					{ name: 'ALL_TICKETS_MUST_BE_CLOSED', value: 'ALL_TICKETS_MUST_BE_CLOSED' },
				],
			},
			{
				displayName: 'Clearance Mode',
				name: 'clearanceMode',
				type: 'options' as const,
				default: 'DEFAULT',
				description: 'Clearance mode controlling whether tickets in the phase may be cleared',
				options: [
					{ name: 'DEFAULT', value: 'DEFAULT' },
					{ name: 'DONT_CLEAR_SUPPORTS', value: 'DONT_CLEAR_SUPPORTS' },
					{ name: 'MAY_CLEAR_SUPPORTS', value: 'MAY_CLEAR_SUPPORTS' },
				],
			},
		],
	},
	{
		displayName: 'Update Phase Fields',
		name: 'updatePhaseFields',
		type: 'collection' as const,
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['projects'],
				operation: ['updateProjectPhase'],
			},
		},
		options: [
			{ displayName: 'Project ID', name: 'projectId', type: 'number' as const, default: 0, description: 'ID of the project this phase belongs to' },
			{ displayName: 'Rank', name: 'rank', type: 'number' as const, default: 0, description: 'Ordering rank of the phase within the project' },
			{ displayName: 'Name', name: 'name', type: 'string' as const, default: '', description: 'Display name of the project phase' },
			{ displayName: 'Start Date (Timestamp)', name: 'startDate', type: 'number' as const, default: 0, description: 'Start date as Unix timestamp' },
			{ displayName: 'End Date (Timestamp)', name: 'endDate', type: 'number' as const, default: 0, description: 'End date as Unix timestamp' },
			{
				displayName: 'Closed Pre-Phases Required',
				name: 'closedPrePhasesRequired',
				type: 'boolean' as const,
				default: false,
				description: 'Whether all preceding phases must be closed before this one can start',
			},
			{
				displayName: 'Billing Type',
				name: 'billingType',
				type: 'options' as const,
				default: 'DEFAULT',
				description: 'Billing mode governing how work in the phase is invoiced',
				options: [
					{ name: 'DEFAULT', value: 'DEFAULT' },
					{ name: 'TICKET_MUST_BE_CLOSED', value: 'TICKET_MUST_BE_CLOSED' },
					{ name: 'ALL_TICKETS_MUST_BE_CLOSED', value: 'ALL_TICKETS_MUST_BE_CLOSED' },
				],
			},
			{
				displayName: 'Clearance Mode',
				name: 'clearanceMode',
				type: 'options' as const,
				default: 'DEFAULT',
				description: 'Clearance mode controlling whether tickets in the phase may be cleared',
				options: [
					{ name: 'DEFAULT', value: 'DEFAULT' },
					{ name: 'DONT_CLEAR_SUPPORTS', value: 'DONT_CLEAR_SUPPORTS' },
					{ name: 'MAY_CLEAR_SUPPORTS', value: 'MAY_CLEAR_SUPPORTS' },
				],
			},
		],
	},
	{
		displayName: 'Assign Ticket Fields',
		name: 'assignTicketFields',
		type: 'collection' as const,
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['projects'],
				operation: ['assignTicketToProject'],
			},
		},
		options: [
			{
				displayName: 'Project ID',
				name: 'projectId',
				type: 'number' as const,
				default: 0,
				description: 'ID of the project to assign the ticket to (0 to detach)',
			},
			{
				displayName: 'Phase ID',
				name: 'phaseId',
				type: 'number' as const,
				default: 0,
				description: 'ID of the project phase to assign the ticket to',
			},
		],
	},
	{
		displayName: 'Options',
		name: 'updatePhaseOptions',
		type: 'collection' as const,
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['projects'],
				operation: ['updateProjectPhase'],
			},
		},
		options: [
			{
				displayName: 'Adjust Start',
				name: 'adjustStart',
				type: 'boolean' as const,
				default: false,
				description: "When true, shift neighbouring phases to keep the timeline consistent after changing this phase's start",
			},
			{
				displayName: 'Adjust End',
				name: 'adjustEnd',
				type: 'boolean' as const,
				default: false,
				description: "When true, shift neighbouring phases to keep the timeline consistent after changing this phase's end",
			},
		],
	},
];

export async function handleProjects(this: IExecuteFunctions, i: number) {
	const operation = this.getNodeParameter('operation', i) as string;
	const credentials = { baseURL: await getTanssBaseUrl.call(this, i) };
	if (!credentials) throw new NodeOperationError(this.getNode(), 'No credentials returned!');

	const projectId = this.getNodeParameter('projectId', i, 0) as number;
	const phaseId = this.getNodeParameter('phaseId', i, 0) as number;
	const ticketId = this.getNodeParameter('ticketId', i, 0) as number;

	let url = '';
	const requestOptions: {
		method: 'GET' | 'POST' | 'PUT' | 'DELETE';
		headers: Record<string, string>;
		json: boolean;
		url: string;
		body?: Record<string, unknown>;
		returnFullResponse?: boolean;
	} = {
		method: 'GET',
		headers: { 'Content-Type': 'application/json' },
		json: true,
		url,
	};

	switch (operation) {
		case 'getProjectTickets': {
			url = `${credentials.baseURL}/backend/api/v1/tickets/projects`;
			break;
		}
		case 'getProjectStatus': {
			if (!projectId) throw new NodeOperationError(this.getNode(), 'Project ID is required.');
			url = `${credentials.baseURL}/backend/api/v1/projects/${projectId}/status`;
			break;
		}
		case 'getProjectSubTickets': {
			if (!projectId) throw new NodeOperationError(this.getNode(), 'Project ID is required.');
			url = `${credentials.baseURL}/backend/api/v1/projects/${projectId}/tickets`;
			break;
		}
		case 'createProjectPhase': {
			const createFields = this.getNodeParameter('createPhaseFields', i, {}) as Record<string, unknown>;
			if (!createFields.projectId) throw new NodeOperationError(this.getNode(), 'Project ID is required for creating a phase.');
			url = `${credentials.baseURL}/backend/api/v1/projects/phases`;
			requestOptions.method = 'POST';
			requestOptions.body = createFields;
			break;
		}
		case 'updateProjectPhase': {
			if (!phaseId) throw new NodeOperationError(this.getNode(), 'Phase ID is required for update.');
			const updateFields = this.getNodeParameter('updatePhaseFields', i, {}) as Record<string, unknown>;
			if (Object.keys(updateFields).length === 0) throw new NodeOperationError(this.getNode(), 'No fields provided for updating project phase.');
			const updateOptions = this.getNodeParameter('updatePhaseOptions', i, {}) as Record<string, unknown>;
			url = `${credentials.baseURL}/backend/api/v1/projects/phases/${phaseId}`;
			requestOptions.method = 'PUT';
			requestOptions.body = updateFields;
			const params: string[] = [];
			if (updateOptions.adjustStart) params.push('adjustStart=true');
			if (updateOptions.adjustEnd) params.push('adjustEnd=true');
			if (params.length > 0) url += `?${params.join('&')}`;
			break;
		}
		case 'deleteProjectPhase': {
			if (!phaseId) throw new NodeOperationError(this.getNode(), 'Phase ID is required for delete.');
			url = `${credentials.baseURL}/backend/api/v1/projects/phases/${phaseId}`;
			requestOptions.method = 'DELETE';
			break;
		}
		case 'getCompanyTicketsForProject': {
			if (!ticketId) throw new NodeOperationError(this.getNode(), 'Ticket ID is required.');
			url = `${credentials.baseURL}/backend/api/v1/tickets/companyTicketsForProject/${ticketId}`;
			break;
		}
		case 'getProjectsForTicket': {
			if (!ticketId) throw new NodeOperationError(this.getNode(), 'Ticket ID is required.');
			url = `${credentials.baseURL}/backend/api/v1/tickets/projects/${ticketId}`;
			break;
		}
		case 'assignTicketToProject': {
			if (!ticketId) throw new NodeOperationError(this.getNode(), 'Ticket ID is required.');
			const assignFields = this.getNodeParameter('assignTicketFields', i, {}) as Record<string, unknown>;
			url = `${credentials.baseURL}/backend/api/v1/tickets/projects/${ticketId}`;
			requestOptions.method = 'PUT';
			requestOptions.body = assignFields;
			break;
		}
		default:
			throw new NodeOperationError(this.getNode(), `The operation "${operation}" is not recognized for Projects.`);
	}

	requestOptions.url = url;

	try {
		type FullResponse = { statusCode: number; body?: unknown };
		const options = {
			...requestOptions,
			returnFullResponse: true,
		} as unknown as import('n8n-workflow').IHttpRequestOptions;
		const fullResponse = (await tanssHttpRequest.call(this, i, options)) as unknown as FullResponse;

		if (requestOptions.method === 'DELETE') {
			if (fullResponse.statusCode === 204) {
				return { success: true, statusCode: 204, message: 'Project phase deleted successfully.' };
			}
			return {
				success: false,
				statusCode: fullResponse.statusCode,
				message: `Delete request failed (status ${fullResponse.statusCode})`,
				error: fullResponse.body ?? null,
			};
		}

		return fullResponse.body ?? (fullResponse as unknown);
	} catch (error: unknown) {
		if (requestOptions.method === 'DELETE') {
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

			return {
				success: false,
				statusCode,
				message: error instanceof Error ? error.message : `Delete request failed (status ${statusCode})`,
				error: parsedBody,
			};
		}
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}
