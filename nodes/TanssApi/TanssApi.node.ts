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
									{
											name: 'Tickets',
											value: 'tickets',
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
											name: 'Get General Tickets',
											value: 'getGeneralTickets',
											description: 'Gets a list of general tickets assigned to no employee',
											action: 'Gets a list of general tickets',
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
											name: 'Get Technician Tickets',
											value: 'getTechnicianTickets',
											description: 'Gets a list of tickets of all technicians (excluding currently logged in employee)',
											action: 'Gets a list of technician tickets',
									},
							],
							default: 'getOwnTickets',
							noDataExpression: true,
					},
					{
							displayName: 'Operation',
							name: 'operation',
							type: 'options',
							displayOptions: {
									show: {
											category: ['tickets'],
									},
							},
							options: [
									{
											name: 'Get Ticket by ID',
											value: 'getTicketById',
											description: 'Fetches a ticket by ID and returns all aspects of the ticket',
											action: 'Fetches a ticket by ID',
									},
									{
											name: 'Create Comment',
											value: 'createComment',
											description: 'Creates a comment for a given ticket',
											action: 'Creates a comment for a given ticket',
									},
									{
											name: 'Get Ticket History',
											value: 'getTicketHistory',
											description: 'Fetches the history of a ticket by ID',
											action: 'Fetches the history of a ticket by ID',
									},
									{
											name: 'Update Ticket',
											value: 'updateTicket',
											description: 'Updates a ticket with the provided information',
											action: 'Updates a ticket',
									},
							],
							default: 'getTicketById',
							noDataExpression: true,
					},
					{
							displayName: 'API Token',
							name: 'apiToken',
							type: 'string',
							displayOptions: {
									show: {
											category: ['ticketLists', 'tickets'],
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
							displayName: 'Ticket ID',
							name: 'ticketId',
							type: 'number',
							displayOptions: {
									show: {
											operation: ['getTicketById', 'createComment', 'getTicketHistory', 'updateTicket'],
									},
							},
							default: 0,
							required: true,
							description: 'The ID of the ticket to fetch, comment on, or update',
					},
					{
							displayName: 'Company ID',
							name: 'companyId',
							type: 'number',
							displayOptions: {
									show: {
											operation: ['getCompanyTickets'],
									},
							},
							default: 0,
							required: true,
							description: 'ID of the company for which to fetch tickets',
					},
					{
							displayName: 'Comment Title',
							name: 'commentTitle',
							type: 'string',
							displayOptions: {
									show: {
											operation: ['createComment'],
									},
							},
							default: '',
							description: 'Title of the comment to be created',
					},
					{
							displayName: 'Comment Content',
							name: 'commentContent',
							type: 'string',
							displayOptions: {
									show: {
											operation: ['createComment'],
									},
							},
							default: '',
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
							description: 'Whether the comment is internal or not',
					},
					{
							displayName: 'Title',
							name: 'title',
							type: 'string',
							displayOptions: {
									show: {
											operation: ['updateTicket'],
									},
							},
							default: '',
							description: 'The title of the ticket',
					},
					{
							displayName: 'Content',
							name: 'content',
							type: 'string',
							displayOptions: {
									show: {
											operation: ['updateTicket'],
									},
							},
							default: '',
							description: 'The content of the ticket',
					},
					{
							displayName: 'Company ID',
							name: 'companyId',
							type: 'number',
							displayOptions: {
									show: {
											operation: ['updateTicket'],
									},
							},
							default: 0,
							description: 'Company ID of the ticket',
					},
					{
							displayName: 'Remitter ID',
							name: 'remitterId',
							type: 'number',
							displayOptions: {
									show: {
											operation: ['updateTicket'],
									},
							},
							default: 0,
							description: 'ID of the remitter for the ticket',
					},
					{
							displayName: 'External Ticket ID',
							name: 'extTicketId',
							type: 'string',
							displayOptions: {
									show: {
											operation: ['updateTicket'],
									},
							},
							default: '',
							description: 'External ID for the ticket',
					},
					{
							displayName: 'Assigned to Employee ID',
							name: 'assignedToEmployeeId',
							type: 'number',
							displayOptions: {
									show: {
											operation: ['updateTicket'],
									},
							},
							default: 0,
							description: 'ID of the employee the ticket is assigned to',
					},
					{
							displayName: 'Assigned to Department ID',
							name: 'assignedToDepartmentId',
							type: 'number',
							displayOptions: {
									show: {
											operation: ['updateTicket'],
									},
							},
							default: 0,
							description: 'ID of the department the ticket is assigned to',
					},
					{
							displayName: 'Status ID',
							name: 'statusId',
							type: 'number',
							displayOptions: {
									show: {
											operation: ['updateTicket'],
									},
							},
							default: 0,
							description: 'ID of the status of the ticket',
					},
					{
							displayName: 'Type ID',
							name: 'typeId',
							type: 'number',
							displayOptions: {
									show: {
											operation: ['updateTicket'],
									},
							},
							default: 0,
							description: 'ID of the type of the ticket',
					},
					{
							displayName: 'Link Type ID',
							name: 'linkTypeId',
							type: 'number',
							displayOptions: {
									show: {
											operation: ['updateTicket'],
									},
							},
							default: 0,
							description: 'ID of the link type if assigned to a device/employee',
					},
					{
							displayName: 'Link ID',
							name: 'linkId',
							type: 'number',
							displayOptions: {
									show: {
											operation: ['updateTicket'],
									},
							},
							default: 0,
							description: 'ID of the link if assigned to a device/employee',
					},
					{
							displayName: 'Deadline Date',
							name: 'deadlineDate',
							type: 'number',
							displayOptions: {
									show: {
											operation: ['updateTicket'],
									},
							},
							default: 0,
							description: 'Timestamp for the deadline date',
					},
					{
							displayName: 'Project',
							name: 'project',
							type: 'boolean',
							displayOptions: {
									show: {
											operation: ['updateTicket'],
									},
							},
							default: false,
							description: 'Whether this ticket is a project',
					},
					{
							displayName: 'Project ID',
							name: 'projectId',
							type: 'number',
							displayOptions: {
									show: {
											operation: ['updateTicket'],
									},
							},
							default: 0,
							description: 'ID of the project if this ticket is a sub-ticket',
					},
					{
							displayName: 'Repair',
							name: 'repair',
							type: 'boolean',
							displayOptions: {
									show: {
											operation: ['updateTicket'],
									},
							},
							default: false,
							description: 'Whether this ticket is a repair ticket',
					},
					{
							displayName: 'Due Date',
							name: 'dueDate',
							type: 'number',
							displayOptions: {
									show: {
											operation: ['updateTicket'],
									},
							},
							default: 0,
							description: 'Timestamp for the due date',
					},
					{
							displayName: 'Attention',
							name: 'attention',
							type: 'options',
							displayOptions: {
									show: {
											operation: ['updateTicket'],
									},
							},
							options: [
									{ name: 'No', value: 'NO' },
									{ name: 'Yes', value: 'YES' },
									{ name: 'Resubmission', value: 'RESUBMISSION' },
									{ name: 'Mail', value: 'MAIL' },
							],
							default: 'NO',
							description: 'Attention flag state of the ticket',
					},
					{
							displayName: 'Order By ID',
							name: 'orderById',
							type: 'number',
							displayOptions: {
									show: {
											operation: ['updateTicket'],
									},
							},
							default: 0,
							description: 'Order By ID of how the remitter gave the order',
					},
					{
							displayName: 'Installation Fee',
							name: 'installationFee',
							type: 'options',
							displayOptions: {
									show: {
											operation: ['updateTicket'],
									},
							},
							options: [
									{ name: 'No', value: 'NO' },
									{ name: 'Yes', value: 'YES' },
									{ name: 'No Project Installation Fee', value: 'NO_PROJECT_INSTALLATION_FEE' },
							],
							default: 'NO',
							description: 'Installation fee status',
					},
					{
							displayName: 'Installation Fee Drive Mode',
							name: 'installationFeeDriveMode',
							type: 'options',
							displayOptions: {
									show: {
											operation: ['updateTicket'],
									},
							},
							options: [
									{ name: 'None', value: 'NONE' },
									{ name: 'Drive Included', value: 'DRIVE_INCLUDED' },
									{ name: 'Drive Excluded', value: 'DRIVE_EXCLUDED' },
							],
							default: 'NONE',
					},
					{
							displayName: 'Installation Fee Amount',
							name: 'installationFeeAmount',
							type: 'number',
							displayOptions: {
									show: {
											operation: ['updateTicket'],
									},
							},
							default: 0,
							description: 'Amount for the installation fee',
					},
					{
							displayName: 'Separate Billing',
							name: 'separateBilling',
							type: 'boolean',
							displayOptions: {
									show: {
											operation: ['updateTicket'],
									},
							},
							default: false,
							description: 'Whether the ticket should be billed separately',
					},
					{
							displayName: 'Service Cap Amount',
							name: 'serviceCapAmount',
							type: 'number',
							displayOptions: {
									show: {
											operation: ['updateTicket'],
									},
							},
							default: 0,
							description: 'Service cap amount for the ticket',
					},
					{
							displayName: 'Relationship Link Type ID',
							name: 'relationshipLinkTypeId',
							type: 'number',
							displayOptions: {
									show: {
											operation: ['updateTicket'],
									},
							},
							default: 0,
							description: 'Link Type ID of the relationship if the ticket has one',
					},
					{
							displayName: 'Relationship Link ID',
							name: 'relationshipLinkId',
							type: 'number',
							displayOptions: {
									show: {
											operation: ['updateTicket'],
									},
							},
							default: 0,
							description: 'Link ID of the relationship if the ticket has one',
					},
					{
							displayName: 'Resubmission Date',
							name: 'resubmissionDate',
							type: 'number',
							displayOptions: {
									show: {
											operation: ['updateTicket'],
									},
							},
							default: 0,
							description: 'Timestamp for the resubmission date',
					},
					{
							displayName: 'Estimated Minutes',
							name: 'estimatedMinutes',
							type: 'number',
							displayOptions: {
									show: {
											operation: ['updateTicket'],
									},
							},
							default: 0,
							description: 'Estimated minutes planned for the ticket',
					},
					{
							displayName: 'Local Ticket Admin Flag',
							name: 'localTicketAdminFlag',
							type: 'options',
							displayOptions: {
									show: {
											operation: ['updateTicket'],
									},
							},
							options: [
									{ name: 'None', value: 'NONE' },
									{ name: 'Local Admin', value: 'LOCAL_ADMIN' },
									{ name: 'Technician', value: 'TECHNICIAN' },
							],
							default: 'NONE',
							description: 'Ticket admin assignment state',
					},
					{
							displayName: 'Local Ticket Admin Employee ID',
							name: 'localTicketAdminEmployeeId',
							type: 'number',
							displayOptions: {
									show: {
											operation: ['updateTicket'],
									},
							},
							default: 0,
							description: 'Employee ID of the local ticket admin assigned',
					},
					{
							displayName: 'Phase ID',
							name: 'phaseId',
							type: 'number',
							displayOptions: {
									show: {
											operation: ['updateTicket'],
									},
							},
							default: 0,
							description: 'ID of the phase if the ticket is assigned to a project phase',
					},
					{
							displayName: 'Resubmission Text',
							name: 'resubmissionText',
							type: 'string',
							displayOptions: {
									show: {
											operation: ['updateTicket'],
									},
							},
							default: '',
							description: 'Text for the resubmission of the ticket',
					},
					{
							displayName: 'Order Number',
							name: 'orderNumber',
							type: 'string',
							displayOptions: {
									show: {
											operation: ['updateTicket'],
									},
							},
							default: '',
							description: 'Order number for the ticket',
					},
					{
							displayName: 'Reminder',
							name: 'reminder',
							type: 'number',
							displayOptions: {
									show: {
											operation: ['updateTicket'],
									},
							},
							default: 0,
							description: 'Timestamp for the reminder',
					},
					{
							displayName: 'Clearance Mode',
							name: 'clearanceMode',
							type: 'options',
							displayOptions: {
									show: {
											operation: ['updateTicket'],
									},
							},
							options: [
									{ name: 'Default', value: 'DEFAULT' },
									{ name: 'Don\'t Clear Supports', value: 'DONT_CLEAR_SUPPORTS' },
									{ name: 'May Clear Supports', value: 'MAY_CLEAR_SUPPORTS' },
							],
							default: 'DEFAULT',
							description: 'How the supports of a ticket may be cleared',
					},
			],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
			const items = this.getInputData();
			const returnData: INodeExecutionData[] = [];

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
									case 'getNotIdentifiedTickets':
											url = `${credentials.baseURL}/api/v1/tickets/notIdentified`;
											requestOptions = {
													method: 'GET' as IHttpRequestMethods,
													url,
													headers: { apiToken, 'Content-Type': 'application/json' },
													json: true,
											};
											break;
									case 'getProjectTickets':
											url = `${credentials.baseURL}/api/v1/tickets/projects`;
											requestOptions = {
													method: 'GET' as IHttpRequestMethods,
													url,
													headers: { apiToken, 'Content-Type': 'application/json' },
													json: true,
											};
											break;
									case 'getTechnicianTickets':
											url = `${credentials.baseURL}/api/v1/tickets/technician`;
											requestOptions = {
													method: 'GET' as IHttpRequestMethods,
													url,
													headers: { apiToken, 'Content-Type': 'application/json' },
													json: true,
											};
											break;
									default:
											throw new NodeOperationError(this.getNode(), `The operation "${operation}" is not recognized in category "ticketLists".`);
							}
					} else if (category === 'tickets') {
							switch (operation) {
									case 'getTicketById':
											const ticketId = this.getNodeParameter('ticketId', i) as number;
											url = `${credentials.baseURL}/api/v1/tickets/${ticketId}`;
											requestOptions = {
													method: 'GET' as IHttpRequestMethods,
													url,
													headers: { apiToken, 'Content-Type': 'application/json' },
													json: true,
											};
											break;
									case 'createComment':
											const commentTicketId = this.getNodeParameter('ticketId', i) as number;
											const commentTitle = this.getNodeParameter('commentTitle', i) as string;
											const commentContent = this.getNodeParameter('commentContent', i) as string;
											const internal = this.getNodeParameter('internal', i) as boolean;

											url = `${credentials.baseURL}/api/v1/tickets/${commentTicketId}/comments`;
											requestOptions = {
													method: 'POST' as IHttpRequestMethods,
													url,
													headers: { apiToken, 'Content-Type': 'application/json' },
													body: {
															title: commentTitle,
															content: commentContent,
															internal: internal,
															commentOfId: commentTicketId,
													},
													json: true,
											};
											break;
									case 'getTicketHistory':
											const historyTicketId = this.getNodeParameter('ticketId', i) as number;
											url = `${credentials.baseURL}/api/v1/tickets/history/${historyTicketId}`;
											requestOptions = {
													method: 'GET' as IHttpRequestMethods,
													url,
													headers: { apiToken, 'Content-Type': 'application/json' },
													json: true,
											};
											break;
									case 'updateTicket':
											const updateTicketId = this.getNodeParameter('ticketId', i) as number;

											url = `${credentials.baseURL}/api/v1/tickets/${updateTicketId}`;

											const ticketUpdates: any = {
													title: this.getNodeParameter('title', i, ''),
													content: this.getNodeParameter('content', i, ''),
													companyId: this.getNodeParameter('companyId', i, 0),
													remitterId: this.getNodeParameter('remitterId', i, 0),
													extTicketId: this.getNodeParameter('extTicketId', i, ''),
													assignedToEmployeeId: this.getNodeParameter('assignedToEmployeeId', i, 0),
													assignedToDepartmentId: this.getNodeParameter('assignedToDepartmentId', i, 0),
													statusId: this.getNodeParameter('statusId', i, 0),
													typeId: this.getNodeParameter('typeId', i, 0),
													linkTypeId: this.getNodeParameter('linkTypeId', i, 0),
													linkId: this.getNodeParameter('linkId', i, 0),
													deadlineDate: this.getNodeParameter('deadlineDate', i, 0),
													project: this.getNodeParameter('project', i, false),
													projectId: this.getNodeParameter('projectId', i, 0),
													repair: this.getNodeParameter('repair', i, false),
													dueDate: this.getNodeParameter('dueDate', i, 0),
													attention: this.getNodeParameter('attention', i, 'NO'),
													orderById: this.getNodeParameter('orderById', i, 0),
													installationFee: this.getNodeParameter('installationFee', i, 'NO'),
													installationFeeDriveMode: this.getNodeParameter('installationFeeDriveMode', i, 'NONE'),
													installationFeeAmount: this.getNodeParameter('installationFeeAmount', i, 0),
													separateBilling: this.getNodeParameter('separateBilling', i, false),
													serviceCapAmount: this.getNodeParameter('serviceCapAmount', i, 0),
													relationshipLinkTypeId: this.getNodeParameter('relationshipLinkTypeId', i, 0),
													relationshipLinkId: this.getNodeParameter('relationshipLinkId', i, 0),
													resubmissionDate: this.getNodeParameter('resubmissionDate', i, 0),
													estimatedMinutes: this.getNodeParameter('estimatedMinutes', i, 0),
													localTicketAdminFlag: this.getNodeParameter('localTicketAdminFlag', i, 'NONE'),
													localTicketAdminEmployeeId: this.getNodeParameter('localTicketAdminEmployeeId', i, 0),
													phaseId: this.getNodeParameter('phaseId', i, 0),
													resubmissionText: this.getNodeParameter('resubmissionText', i, ''),
													orderNumber: this.getNodeParameter('orderNumber', i, ''),
													reminder: this.getNodeParameter('reminder', i, 0),
													clearanceMode: this.getNodeParameter('clearanceMode', i, 'DEFAULT'),
											};

											Object.keys(ticketUpdates).forEach((key) => {
													if (ticketUpdates[key] === '' || ticketUpdates[key] === 0 || ticketUpdates[key] === false) {
															delete ticketUpdates[key];
													}
											});

											if (Object.keys(ticketUpdates).length === 0) {
													throw new NodeOperationError(this.getNode(), 'No fields have been set for updating the ticket.');
											}

											requestOptions = {
													method: 'PUT' as IHttpRequestMethods,
													url,
													headers: { apiToken, 'Content-Type': 'application/json' },
													body: ticketUpdates,
													json: true,
											};
											break;
									default:
											throw new NodeOperationError(this.getNode(), `The operation "${operation}" is not recognized in category "tickets".`);
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
