import { IExecuteFunctions, INodeProperties, NodeOperationError, NodeApiError, JsonObject } from 'n8n-workflow';
import { getTanssBaseUrl, tanssHttpRequest } from './request';

type ChatsCollection = Record<string, unknown>;

export const chatsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options' as const,
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['chats'],
			},
		},
		options: [
			{ name: 'Create Chat', value: 'createChat', description: 'Creates a new chat', action: 'Create a chat' },
			{ name: 'Get Chats', value: 'getChats', description: 'Get a list of chats', action: 'Get chats' },
			{ name: 'Get Chat', value: 'getChat', description: 'Gets a chat', action: 'Get a chat' },
			{
				name: 'Get Chat Close Requests',
				value: 'getChatCloseRequests',
				description: 'Gets chat close requests',
				action: 'Get chat close requests',
			},
			{
				name: 'Create Chat Message',
				value: 'createChatMessage',
				description: 'Creates a new chat message',
				action: 'Create a chat message',
			},
			{ name: 'Add Participant', value: 'addChatParticipant', description: 'Adds a participant', action: 'Add a participant' },
			{
				name: 'Delete Participant',
				value: 'deleteChatParticipant',
				description: 'Deletes a participant',
				action: 'Delete a participant',
			},
			{ name: 'Close Chat', value: 'closeChat', description: 'Closes a chat', action: 'Close a chat' },
			{
				name: 'Accept/Decline Close Request',
				value: 'acceptDeclineCloseRequest',
				description: 'Accepts or declines a chat closing request',
				action: 'Accept or decline close request',
			},
			{ name: 'Re-Open Chat', value: 'reOpenChat', description: 'Re-opens a chat', action: 'Re-open a chat' },
		],
		default: 'createChat',
	},
];

export const chatsFields: INodeProperties[] = [
	{
		displayName: 'Chat ID',
		name: 'chatId',
		type: 'number' as const,
		required: true,
		default: 0,
		description: 'ID of the chat',
		displayOptions: {
			show: {
				resource: ['chats'],
				operation: ['getChat', 'closeChat', 'acceptDeclineCloseRequest', 'reOpenChat'],
			},
		},
	},
	{
		displayName: 'With Messages',
		name: 'withMessages',
		type: 'boolean' as const,
		default: true,
		description: 'If false, no messages will be loaded',
		displayOptions: {
			show: {
				resource: ['chats'],
				operation: ['getChat'],
			},
		},
	},
	{
		displayName: 'Accept',
		name: 'accept',
		type: 'boolean' as const,
		required: true,
		default: true,
		description: 'True accepts close request, false declines it',
		displayOptions: {
			show: {
				resource: ['chats'],
				operation: ['acceptDeclineCloseRequest'],
			},
		},
	},
	{
		displayName: 'Chats Filter Fields',
		name: 'chatsFilterFields',
		type: 'collection' as const,
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['chats'],
				operation: ['getChats'],
			},
		},
		options: [
			{ displayName: 'Employee ID', name: 'employeeId', type: 'number' as const, default: 0 },
			{ displayName: 'Only Expected Time Expired', name: 'onlyExpectedTimeExpired', type: 'boolean' as const, default: false },
			{
				displayName: 'Chat IDs (JSON Array)',
				name: 'chatIds',
				type: 'json' as const,
				default: '[]',
				description: 'Array of chat IDs, e.g. [1,2,3]',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options' as const,
				options: [
					{ name: 'OPEN', value: 'OPEN' },
					{ name: 'CLOSED', value: 'CLOSED' },
				],
				default: 'OPEN',
			},
			{ displayName: 'Search String', name: 'searchString', type: 'string' as const, default: '' },
			{ displayName: 'Link Type ID', name: 'linkTypeId', type: 'number' as const, default: 0 },
			{ displayName: 'Link ID', name: 'linkId', type: 'number' as const, default: 0 },
			{
				displayName: 'Link IDs (JSON Array)',
				name: 'linkIds',
				type: 'json' as const,
				default: '[]',
				description: 'Array of assignment IDs, e.g. [100,101]',
			},
			{ displayName: 'Creator ID', name: 'creatorId', type: 'number' as const, default: 0 },
			{
				displayName: 'Show Only Participated Chat',
				name: 'showOnlyParticapatedChat',
				type: 'boolean' as const,
				default: false,
			},
			{
				displayName: 'Load Messages',
				name: 'loadMessages',
				type: 'options' as const,
				options: [
					{ name: 'NONE', value: 'NONE' },
					{ name: 'ALL', value: 'ALL' },
					{ name: 'LAST', value: 'LAST' },
				],
				default: 'NONE',
			},
			{ displayName: 'Fill Linked Entities', name: 'fillLinkedEntities', type: 'boolean' as const, default: false },
			{ displayName: 'Minimum Creation Date (Timestamp)', name: 'minimumCreationDate', type: 'number' as const, default: 0 },
			{ displayName: 'Items Per Page', name: 'itemsPerPage', type: 'number' as const, default: 0 },
			{ displayName: 'Page', name: 'page', type: 'number' as const, default: 0 },
		],
	},
	{
		displayName: 'Create Chat Fields',
		name: 'createChatFields',
		type: 'collection' as const,
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['chats'],
				operation: ['createChat'],
			},
		},
		options: [
			{ displayName: 'ID', name: 'id', type: 'number' as const, default: 0 },
			{ displayName: 'Description', name: 'description', type: 'string' as const, default: '' },
			{ displayName: 'Link Type ID', name: 'linkTypeId', type: 'number' as const, default: 0 },
			{ displayName: 'Link ID', name: 'linkId', type: 'number' as const, default: 0 },
			{
				displayName: 'Status',
				name: 'status',
				type: 'options' as const,
				options: [
					{ name: 'OPEN', value: 'OPEN' },
					{ name: 'CLOSED', value: 'CLOSED' },
				],
				default: 'OPEN',
			},
			{ displayName: 'Closed By Employee ID', name: 'closedByEmployeeId', type: 'number' as const, default: 0 },
			{ displayName: 'Expected Response Time (Timestamp)', name: 'expectedResponseTime', type: 'number' as const, default: 0 },
			{ displayName: 'Created By Employee ID', name: 'createdByEmployeeId', type: 'number' as const, default: 0 },
			{ displayName: 'Creation Date (Timestamp)', name: 'creationDate', type: 'number' as const, default: 0 },
			{
				displayName: 'Messages (JSON Array)',
				name: 'messages',
				type: 'json' as const,
				default: '[]',
				description: 'Array of chat message objects',
			},
			{
				displayName: 'Participants (JSON Array)',
				name: 'participants',
				type: 'json' as const,
				default: '[]',
				description: 'Array of participant objects',
			},
			{
				displayName: 'Logs (JSON Array)',
				name: 'logs',
				type: 'json' as const,
				default: '[]',
				description: 'Array of log objects',
			},
		],
	},
	{
		displayName: 'Create Chat Message Fields',
		name: 'createChatMessageFields',
		type: 'collection' as const,
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['chats'],
				operation: ['createChatMessage'],
			},
		},
		options: [
			{ displayName: 'Chat ID', name: 'chatId', type: 'number' as const, default: 0 },
			{ displayName: 'Content', name: 'content', type: 'string' as const, default: '' },
			{ displayName: 'Expected Response (Minutes)', name: 'expectedResponse', type: 'number' as const, default: 0 },
		],
	},
	{
		displayName: 'Add Participant Fields',
		name: 'addParticipantFields',
		type: 'collection' as const,
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['chats'],
				operation: ['addChatParticipant'],
			},
		},
		options: [
			{ displayName: 'Chat ID', name: 'chatId', type: 'number' as const, default: 0 },
			{ displayName: 'Employee ID', name: 'employeeId', type: 'number' as const, default: 0 },
			{ displayName: 'Department ID', name: 'departmentId', type: 'number' as const, default: 0 },
		],
	},
	{
		displayName: 'Delete Participant Fields',
		name: 'deleteParticipantFields',
		type: 'collection' as const,
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['chats'],
				operation: ['deleteChatParticipant'],
			},
		},
		options: [
			{ displayName: 'Chat ID', name: 'chatId', type: 'number' as const, default: 0 },
			{ displayName: 'Employee ID', name: 'employeeId', type: 'number' as const, default: 0 },
			{ displayName: 'Department ID', name: 'departmentId', type: 'number' as const, default: 0 },
		],
	},
];

function normalizeArrayJson(value: unknown): unknown[] | undefined {
	if (value === undefined || value === null || value === '') return undefined;
	if (Array.isArray(value)) return value;
	return undefined;
}

function normalizeChatCreateBody(fields: ChatsCollection): Record<string, unknown> {
	const body = { ...fields } as Record<string, unknown>;

	const messages = normalizeArrayJson(fields.messages);
	const participants = normalizeArrayJson(fields.participants);
	const logs = normalizeArrayJson(fields.logs);

	if (messages !== undefined) body.messages = messages;
	if (participants !== undefined) body.participants = participants;
	if (logs !== undefined) body.logs = logs;

	return body;
}

function normalizeChatsFilterBody(fields: ChatsCollection): Record<string, unknown> {
	const body = { ...fields } as Record<string, unknown>;

	const chatIds = normalizeArrayJson(fields.chatIds);
	const linkIds = normalizeArrayJson(fields.linkIds);

	if (chatIds !== undefined) body.chatIds = chatIds;
	if (linkIds !== undefined) body.linkIds = linkIds;

	return body;
}

function parseResponseBody(rawBody: unknown): unknown {
	if (typeof rawBody !== 'string') return rawBody;
	try {
		return JSON.parse(rawBody);
	} catch {
		return rawBody;
	}
}

export async function handleChats(this: IExecuteFunctions, i: number) {
	const operation = this.getNodeParameter('operation', i) as string;
	const credentials = { baseURL: await getTanssBaseUrl.call(this, i) };
	if (!credentials) throw new NodeOperationError(this.getNode(), 'No credentials returned!');
	const chatId = this.getNodeParameter('chatId', i, 0) as number;
	const baseURL = credentials.baseURL as string;

	let url = '';
	const requestOptions: {
		method: 'GET' | 'POST' | 'PUT' | 'DELETE';
		headers: { 'Content-Type': string };
		json: boolean;
		body?: Record<string, unknown>;
		url: string;
		returnFullResponse?: boolean;
	} = {
		method: 'GET',
		headers: { 'Content-Type': 'application/json' },
		json: true,
		url,
	};

	switch (operation) {
		case 'createChat': {
			const createFields = this.getNodeParameter('createChatFields', i, {}) as ChatsCollection;
			if (Object.keys(createFields).length === 0) throw new NodeOperationError(this.getNode(), 'No fields provided for creating chat.');
			url = `${baseURL}/backend/api/v1/chats`;
			requestOptions.method = 'POST';
			requestOptions.body = normalizeChatCreateBody(createFields);
			break;
		}
		case 'getChats': {
			const filterFields = this.getNodeParameter('chatsFilterFields', i, {}) as ChatsCollection;
			url = `${baseURL}/backend/api/v1/chats`;
			requestOptions.method = 'PUT';
			requestOptions.body = normalizeChatsFilterBody(filterFields);
			break;
		}
		case 'getChat': {
			if (!chatId || chatId <= 0) throw new NodeOperationError(this.getNode(), 'A valid chatId is required.');
			const withMessages = this.getNodeParameter('withMessages', i, true) as boolean;
			url = `${baseURL}/backend/api/v1/chats/${chatId}?withMessages=${withMessages ? 'true' : 'false'}`;
			requestOptions.method = 'GET';
			break;
		}
		case 'getChatCloseRequests': {
			url = `${baseURL}/backend/api/v1/chats/closeRequests`;
			requestOptions.method = 'GET';
			break;
		}
		case 'createChatMessage': {
			const messageFields = this.getNodeParameter('createChatMessageFields', i, {}) as ChatsCollection;
			if (!messageFields.chatId || Number(messageFields.chatId) <= 0)
				throw new NodeOperationError(this.getNode(), 'chatId is required for creating a chat message.');
			if (!messageFields.content || String(messageFields.content).trim() === '')
				throw new NodeOperationError(this.getNode(), 'content is required for creating a chat message.');
			url = `${baseURL}/backend/api/v1/chats/messages`;
			requestOptions.method = 'POST';
			requestOptions.body = messageFields as Record<string, unknown>;
			break;
		}
		case 'addChatParticipant': {
			const participantFields = this.getNodeParameter('addParticipantFields', i, {}) as ChatsCollection;
			if (!participantFields.chatId || Number(participantFields.chatId) <= 0)
				throw new NodeOperationError(this.getNode(), 'chatId is required for adding a participant.');
			const hasEmployee = Number(participantFields.employeeId || 0) > 0;
			const hasDepartment = Number(participantFields.departmentId || 0) > 0;
			if (!hasEmployee && !hasDepartment)
				throw new NodeOperationError(this.getNode(), 'Either employeeId or departmentId is required for adding a participant.');
			url = `${baseURL}/backend/api/v1/chats/participants`;
			requestOptions.method = 'POST';
			requestOptions.body = participantFields as Record<string, unknown>;
			break;
		}
		case 'deleteChatParticipant': {
			const participantFields = this.getNodeParameter('deleteParticipantFields', i, {}) as ChatsCollection;
			const queryChatId = Number(participantFields.chatId || 0);
			const queryEmployeeId = Number(participantFields.employeeId || 0);
			const queryDepartmentId = Number(participantFields.departmentId || 0);
			if (!queryChatId || queryChatId <= 0) throw new NodeOperationError(this.getNode(), 'chatId is required for deleting a participant.');
			if (!queryEmployeeId && !queryDepartmentId)
				throw new NodeOperationError(this.getNode(), 'Either employeeId or departmentId is required for deleting a participant.');
			const query = [`chatId=${encodeURIComponent(String(queryChatId))}`];
			if (queryEmployeeId > 0) query.push(`employeeId=${encodeURIComponent(String(queryEmployeeId))}`);
			if (queryDepartmentId > 0) query.push(`departmentId=${encodeURIComponent(String(queryDepartmentId))}`);
			url = `${baseURL}/backend/api/v1/chats/participants?${query.join('&')}`;
			requestOptions.method = 'DELETE';
			break;
		}
		case 'closeChat': {
			if (!chatId || chatId <= 0) throw new NodeOperationError(this.getNode(), 'A valid chatId is required.');
			url = `${baseURL}/backend/api/v1/chats/close/${chatId}`;
			requestOptions.method = 'POST';
			break;
		}
		case 'acceptDeclineCloseRequest': {
			if (!chatId || chatId <= 0) throw new NodeOperationError(this.getNode(), 'A valid chatId is required.');
			const accept = this.getNodeParameter('accept', i, true) as boolean;
			url = `${baseURL}/backend/api/v1/chats/close/${chatId}?accept=${accept ? 'true' : 'false'}`;
			requestOptions.method = 'PUT';
			break;
		}
		case 'reOpenChat': {
			if (!chatId || chatId <= 0) throw new NodeOperationError(this.getNode(), 'A valid chatId is required.');
			url = `${baseURL}/backend/api/v1/chats/reOpen/${chatId}`;
			requestOptions.method = 'POST';
			break;
		}
		default:
			throw new NodeOperationError(this.getNode(), `The operation "${operation}" is not recognized for Chats.`);
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
				return { success: true, statusCode: 204, message: 'Participant deleted successfully.' };
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
		const anyErr = error as {
			statusCode?: number;
			response?: { status?: number; statusCode?: number; body?: unknown; data?: unknown };
		};
		const statusCode = anyErr?.response?.statusCode ?? anyErr?.response?.status ?? anyErr?.statusCode ?? 0;
		const rawBody = anyErr?.response?.body ?? anyErr?.response?.data;
		const parsedBody = parseResponseBody(rawBody);

		if (requestOptions.method === 'DELETE') {
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
