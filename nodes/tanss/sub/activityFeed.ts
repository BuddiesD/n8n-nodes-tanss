import { IDataObject, IExecuteFunctions, INodeProperties, JsonObject, NodeApiError, NodeOperationError } from 'n8n-workflow';
import { getTanssBaseUrl, tanssHttpRequest } from './request';

const activityFeedTriggerTypes = [
	{ name: 'Ticket Assigned to Another Technician', value: 'TICKET_ASSIGNED_TO_ANOTHER_TECHNICIAN' },
	{ name: 'Ticket Closed', value: 'TICKET_CLOSED' },
	{ name: 'Ticket Created', value: 'TICKET_CREATED' },
	{ name: 'Ticket Email Received', value: 'TICKET_EMAIL_RECEIVED' },
	{ name: 'Ticket New Comment', value: 'TICKET_NEW_COMMENT' },
	{ name: 'Ticket New Deadline', value: 'TICKET_NEW_DEADLINE' },
	{ name: 'Ticket New Due Date', value: 'TICKET_NEW_DUE_DATE' },
	{ name: 'Ticket New Service Cap', value: 'TICKET_NEW_SERVICE_CAP' },
	{ name: 'Ticket New Support', value: 'TICKET_NEW_SUPPORT' },
	{ name: 'Ticket Not More Assigned to Self', value: 'TICKET_NOT_MORE_ASSIGNED_TO_SELF' },
	{ name: 'Ticket Reminder', value: 'TICKET_REMINDER' },
	{ name: 'Ticket Resubmission Hit', value: 'TICKET_RESUBMISSION_HIT' },
	{ name: 'Ticket Status Changed', value: 'TICKET_STATUS_CHANGED' },
	{ name: 'Ticket Tags Changed', value: 'TICKET_TAGS_CHANGED' },
];

const activityFeedLinkTypes = [
	{ name: 'PC', value: 'PC' },
	{ name: 'Company', value: 'COMPANY' },
	{ name: 'Employee', value: 'EMPLOYEE' },
	{ name: 'Periphery', value: 'PERIPHERY' },
	{ name: 'Component', value: 'COMPONENT' },
	{ name: 'Software License', value: 'SOFTWARELICENSE' },
	{ name: 'Support', value: 'SUPPORT' },
	{ name: 'Voucher', value: 'VOUCHER' },
	{ name: 'Document', value: 'DOCUMENT' },
	{ name: 'Document S2T', value: 'DOCUMENT_S2T' },
	{ name: 'Ticket', value: 'TICKET' },
	{ name: 'Knowledge Base', value: 'KNOWLEDGE_BASE' },
	{ name: 'Permission', value: 'PERMISSION' },
	{ name: 'Permission Package', value: 'PERMISSION_PACKAGE' },
	{ name: 'Group', value: 'GROUP' },
	{ name: 'Callback', value: 'CALLBACK' },
	{ name: 'Consultation', value: 'CONSULTATION' },
	{ name: 'SLA', value: 'SLA' },
	{ name: 'Contract', value: 'CONTRACT' },
	{ name: 'Prepaid Purchase', value: 'PREPAID_PURCHASE' },
	{ name: 'Event', value: 'EVENT' },
	{ name: 'File Links', value: 'FILE_LINKS' },
	{ name: 'Birthday', value: 'BIRTHDAY' },
	{ name: 'Domain', value: 'DOMAIN' },
	{ name: 'TeamViewer', value: 'TEAMVIEWER' },
	{ name: 'Remote Support', value: 'REMOTE_SUPPORT' },
	{ name: 'Docusnap', value: 'DOCUSNAP' },
	{ name: 'Material', value: 'MATERIAL' },
	{ name: 'Chat', value: 'CHAT' },
	{ name: 'ToDo', value: 'TODO' },
	{ name: 'Docusnap SNMP', value: 'DOCUSNAP_SNMP' },
	{ name: 'Vacation Request', value: 'VACATION_REQUEST' },
	{ name: 'Ticket Board Panel', value: 'TICKET_BOARD_PANEL' },
	{ name: 'Department', value: 'DEPARTMENT' },
	{ name: 'Company Type', value: 'COMPANY_TYPE' },
	{ name: 'Ticket Type', value: 'TICKET_TYPE' },
	{ name: 'Mail', value: 'MAIL' },
	{ name: 'Offer', value: 'OFFER' },
	{ name: 'Ticket State', value: 'TICKET_STATE' },
	{ name: 'Overtime Additional Charge', value: 'OVERTIME_ADDITIONAL_CHARGE' },
	{ name: 'Checklist', value: 'CHECKLIST' },
];

export const activityFeedOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options' as const,
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['activityFeed'],
			},
		},
		options: [
			{
				name: 'Get Number of Unseen Events',
				value: 'getUnseenEventsCount',
				description: 'Gets the total number of unseen activity feed events',
				action: 'Get the number of unseen events',
			},
			{
				name: 'List User Items',
				value: 'listUserItems',
				description: 'Gets a list of activity feed items for the current user',
				action: 'List user items',
			},
			{
				name: 'Mark All as Seen',
				value: 'markAllAsSeen',
				description: 'Marks all unseen activity feed events as seen',
				action: 'Mark all as seen',
			},
		],
		default: 'listUserItems',
	},
];

export const activityFeedFields: INodeProperties[] = [
	{
		displayName: 'Activity Feed Filter',
		name: 'activityFeedFilter',
		type: 'collection' as const,
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['activityFeed'],
				operation: ['listUserItems'],
			},
		},
		options: [
			{
				displayName: 'Minimum Creation Date (Timestamp)',
				name: 'minimumCreationDate',
				type: 'number' as const,
				default: 0,
				description: 'If given, only newer activity feed items are fetched',
			},
			{
				displayName: 'Link IDs',
				name: 'linkIds',
				type: 'fixedCollection' as const,
				typeOptions: { multipleValues: true },
				default: {},
				placeholder: 'Add Link ID',
				options: [
					{
						displayName: 'Link ID',
						name: 'values',
						values: [
							{
								displayName: 'ID',
								name: 'id',
								type: 'number' as const,
								default: 0,
							},
						],
					},
				],
			},
			{
				displayName: 'Link Types',
				name: 'linkTypes',
				type: 'multiOptions' as const,
				options: activityFeedLinkTypes,
				default: [],
			},
			{
				displayName: 'Trigger Types',
				name: 'triggerTypes',
				type: 'multiOptions' as const,
				options: activityFeedTriggerTypes,
				default: [],
			},
			{
				displayName: 'Prevent View Event',
				name: 'preventViewEvent',
				type: 'boolean' as const,
				default: false,
				description: 'If enabled, fetched items are not marked as seen by the API',
			},
			{
				displayName: 'Include Content',
				name: 'includeContent',
				type: 'boolean' as const,
				default: false,
				description: 'If enabled, the API includes additional content such as the linked ticket object',
			},
			{
				displayName: 'Seen Filter',
				name: 'seenFilter',
				type: 'options' as const,
				options: [
					{ name: 'Both', value: 'BOTH' },
					{ name: 'Only Seen', value: 'ONLY_SEEN' },
					{ name: 'Only Unseen', value: 'ONLY_UNSEEN' },
				],
				default: 'BOTH',
			},
			{
				displayName: 'Confirmed Filter',
				name: 'confirmedFilter',
				type: 'options' as const,
				options: [
					{ name: 'Both', value: 'BOTH' },
					{ name: 'Only Confirmed', value: 'ONLY_CONFIRMED' },
					{ name: 'Only Unconfirmed', value: 'ONLY_UNCONFIRMED' },
				],
				default: 'BOTH',
			},
		],
	},
];

function assignIfPresent(body: IDataObject, key: string, value: unknown) {
	if (value === undefined || value === null) {
		return;
	}

	if (typeof value === 'string' && value.trim() === '') {
		return;
	}

	body[key] = value;
}

function extractNumberList(field: IDataObject, key: string): number[] {
	const entries = (field[key] as { values?: Array<{ id?: number }> })?.values ?? [];
	return entries
		.map((entry) => Number(entry.id))
		.filter((value) => Number.isFinite(value) && value > 0);
}

function buildActivityFeedBody(filter: IDataObject): IDataObject {
	const body: IDataObject = {};
	const minimumCreationDate = Number(filter.minimumCreationDate ?? 0);
	if (Number.isFinite(minimumCreationDate) && minimumCreationDate > 0) {
		body.minimumCreationDate = minimumCreationDate;
	}

	const linkIds = extractNumberList(filter, 'linkIds');
	if (linkIds.length > 0) {
		body.linkIds = linkIds;
	}

	const linkTypes = Array.isArray(filter.linkTypes) ? (filter.linkTypes as string[]).filter((value) => String(value).trim() !== '') : [];
	if (linkTypes.length > 0) {
		body.linkTypes = linkTypes;
	}

	const triggerTypes = Array.isArray(filter.triggerTypes) ? (filter.triggerTypes as string[]).filter((value) => String(value).trim() !== '') : [];
	if (triggerTypes.length > 0) {
		body.triggerTypes = triggerTypes;
	}

	assignIfPresent(body, 'preventViewEvent', filter.preventViewEvent);
	assignIfPresent(body, 'includeContent', filter.includeContent);
	assignIfPresent(body, 'seenFilter', filter.seenFilter);
	assignIfPresent(body, 'confirmedFilter', filter.confirmedFilter);

	return body;
}

export async function handleActivityFeed(this: IExecuteFunctions, i: number) {
	const operation = this.getNodeParameter('operation', i) as string;
	const baseURL = await getTanssBaseUrl.call(this, i);
	const requestOptions: {
		method: 'GET' | 'POST' | 'PUT';
		headers: { [key: string]: string };
		json: boolean;
		body?: IDataObject;
		url: string;
	} = {
		method: 'GET',
		headers: { Accept: 'application/json' },
		json: true,
		url: '',
	};

	switch (operation) {
		case 'listUserItems': {
			requestOptions.method = 'PUT';
			requestOptions.url = `${baseURL}/backend/api/v1/tanssEvents`;
			requestOptions.headers['Content-Type'] = 'application/json';
			const filter = this.getNodeParameter('activityFeedFilter', i, {}) as IDataObject;
			requestOptions.body = buildActivityFeedBody(filter);

			if (Object.keys(requestOptions.body).length === 0) {
				throw new NodeOperationError(this.getNode(), 'Please select at least one filter for List User Items.', {
					itemIndex: i,
				});
			}
			break;
		}
		case 'getUnseenEventsCount': {
			requestOptions.method = 'GET';
			requestOptions.url = `${baseURL}/backend/api/v1/tanssEvents/unseen`;
			break;
		}
		case 'markAllAsSeen': {
			requestOptions.method = 'POST';
			requestOptions.url = `${baseURL}/backend/api/v1/tanssEvents/mark/all/seen`;
			break;
		}
		default:
			throw new NodeApiError(this.getNode(), { message: `Unknown operation: ${operation}` } as JsonObject, { itemIndex: i });
	}

	try {
		return await tanssHttpRequest.call(this, i, requestOptions as unknown as import('n8n-workflow').IHttpRequestOptions);
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject, { itemIndex: i });
	}
}