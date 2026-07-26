import { IExecuteFunctions, INodeProperties, NodeOperationError, IDataObject, IHttpRequestOptions, NodeApiError, JsonObject } from 'n8n-workflow';
import { getTanssBaseUrl, tanssHttpRequest } from './request';

export const mailsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options' as const,
		noDataExpression: true,
		displayOptions: { show: { resource: ['mails'] } },
		options: [
			{
				name: 'Test SMTP Settings',
				value: 'testSmtp',
				description: 'Send a test email using specified SMTP settings',
				action: 'Test SMTP',
			},
			{
				name: 'Get Mail List',
				value: 'getMailList',
				description: 'Loads a filtered/paginated list of mails',
				action: 'Get mail list',
			},
			{
				name: 'Get Pending Retries',
				value: 'getPendingRetries',
				description: 'Lists failed outgoing mails queued for retry',
				action: 'Get pending retries',
			},
			{
				name: 'Retry Sending Mail',
				value: 'retrySendMail',
				description: 'Re-attempts delivery of a failed outgoing mail',
				action: 'Retry sending mail',
			},
			{
				name: 'Delete Retry Mail',
				value: 'deleteRetryMail',
				description: 'Removes a pending mail retry',
				action: 'Delete retry mail',
			},
			{
				name: 'Get Mail',
				value: 'getMail',
				description: 'Returns a single mail by ID',
				action: 'Get mail',
			},
			{
				name: 'Delete Mail',
				value: 'deleteMail',
				description: 'Removes a mail or detaches it from a ticket',
				action: 'Delete mail',
			},
		],
		default: 'testSmtp',
	},
];

export const mailsFields: INodeProperties[] = [
	{
		displayName: 'Receiver',
		name: 'receiver',
		type: 'string' as const,
		required: true,
		default: '',
		description: 'Receiver of the test message',
		displayOptions: { show: { resource: ['mails'], operation: ['testSmtp'] } },
	},
	{
		displayName: 'Retry ID',
		name: 'retryId',
		type: 'number' as const,
		required: true,
		default: 0,
		description: 'ID of the mail retry entry',
		displayOptions: { show: { resource: ['mails'], operation: ['retrySendMail', 'deleteRetryMail'] } },
	},

	{
		displayName: 'Mail ID',
		name: 'mailId',
		type: 'number' as const,
		required: true,
		default: 0,
		description: 'ID of the mail',
		displayOptions: { show: { resource: ['mails'], operation: ['getMail', 'deleteMail'] } },
	},

	{
		displayName: 'Ticket ID',
		name: 'ticketId',
		type: 'number' as const,
		default: 0,
		description: 'ID of the ticket (for assignToTicket or optional detach in deleteMail)',
		displayOptions: { show: { resource: ['mails'], operation: ['deleteMail'] } },
	},

	{
		displayName: 'Translate CID',
		name: 'translateCid',
		type: 'boolean' as const,
		default: false,
		description: 'Rewrites cid: references in HTML body to TANSS attachment URLs',
		displayOptions: { show: { resource: ['mails'], operation: ['getMail'] } },
	},

	{
		displayName: 'Mail List Filters',
		name: 'mailListFilters',
		type: 'collection' as const,
		placeholder: 'Add Field',
		displayOptions: { show: { resource: ['mails'], operation: ['getMailList'] } },
		default: {},
		options: [
			{ displayName: 'Company ID', name: 'companyId', type: 'number' as const, default: 0 },
			{ displayName: 'Fetch Ticket Infos', name: 'fetchTicketInfos', type: 'boolean' as const, default: false },
			{ displayName: 'Check Permissions', name: 'checkPermissions', type: 'boolean' as const, default: false },
			{
				displayName: 'Sort Field',
				name: 'sortField',
				type: 'options' as const,
				default: 'ID',
				options: [
					{ name: 'ID', value: 'ID' },
					{ name: 'DATE', value: 'DATE' },
				],
			},
			{
				displayName: 'Sort Order',
				name: 'sortOrder',
				type: 'options' as const,
				default: 'ASC',
				options: [
					{ name: 'ASC', value: 'ASC' },
					{ name: 'DESC', value: 'DESC' },
				],
			},
		],
	},

	{
		displayName: 'Email Settings',
		name: 'mailObject',
		type: 'collection' as const,
		placeholder: 'Add Field',
		displayOptions: { show: { resource: ['mails'], operation: ['testSmtp'] } },
		default: {},
		options: [
			{ displayName: 'SMTP Address', name: 'smtpAddress', type: 'string' as const, default: '' },
			{ displayName: 'SMTP Host', name: 'smtpHost', type: 'string' as const, default: '' },
			{ displayName: 'SMTP User', name: 'smtpUser', type: 'string' as const, default: '' },
			{
				displayName: 'SMTP Password',
				name: 'smtpPassword',
				type: 'string' as const,
				default: '',
				typeOptions: { password: true },
			},
			{ displayName: 'SMTP Auth', name: 'smtpAuth', type: 'boolean' as const, default: false },
			{
				displayName: 'SMTP Encryption Type',
				name: 'smtpEncryptionType',
				type: 'options' as const,
				default: 'NONE',
				options: [
					{ name: 'NONE', value: 'NONE' },
					{ name: 'SSL', value: 'SSL' },
					{ name: 'TLS', value: 'TLS' },
				],
			},
			{
				displayName: 'SMTP Sender Name',
				name: 'smtpSenderName',
				type: 'string' as const,
				default: '',
			},
		],
	},
];

export async function handleMails(this: IExecuteFunctions, i: number) {
	const operation = this.getNodeParameter('operation', i) as string;
	const credentials = { baseURL: await getTanssBaseUrl.call(this, i) };

	const base = credentials.baseURL as string;

	const requestOptions: {
		method: 'GET' | 'POST' | 'PUT' | 'DELETE';
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
		case 'testSmtp': {
			const receiver = this.getNodeParameter('receiver', i, '') as string;
			if (!receiver || String(receiver).trim() === '') throw new NodeOperationError(this.getNode(), 'receiver is required');
			const fields = this.getNodeParameter('mailObject', i, {}) as IDataObject;
			const body: IDataObject = {};

			if (fields.smtpAddress && String(fields.smtpAddress).trim() !== '') body.smtpAddress = String(fields.smtpAddress).trim();
			if (fields.smtpHost && String(fields.smtpHost).trim() !== '') body.smtpHost = String(fields.smtpHost).trim();
			if (fields.smtpUser && String(fields.smtpUser).trim() !== '') body.smtpUser = String(fields.smtpUser).trim();
			if (fields.smtpPassword && String(fields.smtpPassword).trim() !== '') body.smtpPassword = String(fields.smtpPassword).trim();
			if (fields.smtpAuth !== undefined) body.smtpAuth = Boolean(fields.smtpAuth);
			if (fields.smtpEncryptionType && String(fields.smtpEncryptionType).trim() !== '')
				body.smtpEncryptionType = String(fields.smtpEncryptionType).trim();
			if (fields.smtpSenderName && String(fields.smtpSenderName).trim() !== '') body.smtpSenderName = String(fields.smtpSenderName).trim();

			requestOptions.method = 'POST';
			requestOptions.url = `${base}/backend/api/v1/mails/test/smtp?receiver=${encodeURIComponent(String(receiver))}`;
			requestOptions.headers['Content-Type'] = 'application/json';
			requestOptions.body = body;
			break;
		}

		case 'getMailList': {
			const filters = this.getNodeParameter('mailListFilters', i, {}) as IDataObject;
			const body: IDataObject = {};
			if (filters.companyId !== undefined) body.companyId = Number(filters.companyId) || 0;
			if (filters.fetchTicketInfos !== undefined) body.fetchTicketInfos = Boolean(filters.fetchTicketInfos);
			if (filters.checkPermissions !== undefined) body.checkPermissions = Boolean(filters.checkPermissions);
			if (filters.sortField && String(filters.sortField).trim() !== '') body.sortField = String(filters.sortField).trim();
			if (filters.sortOrder && String(filters.sortOrder).trim() !== '') body.sortOrder = String(filters.sortOrder).trim();

			requestOptions.method = 'PUT';
			requestOptions.url = `${base}/backend/api/v1/mails`;
			requestOptions.headers['Content-Type'] = 'application/json';
			requestOptions.body = body;
			break;
		}

		case 'getPendingRetries': {
			requestOptions.method = 'GET';
			requestOptions.url = `${base}/backend/api/v1/mails/retry`;
			delete requestOptions.headers['Content-Type'];
			break;
		}

		case 'retrySendMail': {
			const retryId = Number(this.getNodeParameter('retryId', i, 0)) || 0;
			if (!retryId) throw new NodeOperationError(this.getNode(), 'Retry ID is required.');
			requestOptions.method = 'GET';
			requestOptions.url = `${base}/backend/api/v1/mails/retry/resend/${encodeURIComponent(String(retryId))}`;
			delete requestOptions.headers['Content-Type'];
			break;
		}

		case 'deleteRetryMail': {
			const retryId = Number(this.getNodeParameter('retryId', i, 0)) || 0;
			if (!retryId) throw new NodeOperationError(this.getNode(), 'Retry ID is required.');
			requestOptions.method = 'DELETE';
			requestOptions.url = `${base}/backend/api/v1/mails/retry/${encodeURIComponent(String(retryId))}`;
			break;
		}

		case 'getMail': {
			const mailId = Number(this.getNodeParameter('mailId', i, 0)) || 0;
			if (!mailId) throw new NodeOperationError(this.getNode(), 'Mail ID is required.');
			const translateCid = this.getNodeParameter('translateCid', i, false) as boolean;
			let url = `${base}/backend/api/v1/mails/${encodeURIComponent(String(mailId))}`;
			if (translateCid) url += `?translateCid=true`;
			requestOptions.method = 'GET';
			requestOptions.url = url;
			delete requestOptions.headers['Content-Type'];
			break;
		}

		case 'deleteMail': {
			const mailId = Number(this.getNodeParameter('mailId', i, 0)) || 0;
			if (!mailId) throw new NodeOperationError(this.getNode(), 'Mail ID is required.');
			const ticketId = Number(this.getNodeParameter('ticketId', i, 0)) || 0;
			let url = `${base}/backend/api/v1/mails/${encodeURIComponent(String(mailId))}`;
			if (ticketId > 0) url += `?ticketId=${encodeURIComponent(String(ticketId))}`;
			requestOptions.method = 'DELETE';
			requestOptions.url = url;
			break;
		}

		default:
			throw new NodeOperationError(this.getNode(), `The operation "${operation}" is not recognized.`);
	}

	try {
		const fullResponse = await tanssHttpRequest.call(this, i, {
			...(requestOptions as unknown as IDataObject),
			simple: false,
			resolveWithFullResponse: true,
		} as unknown as IHttpRequestOptions);
		return fullResponse && fullResponse.body ? fullResponse.body : fullResponse;
	} catch (err: unknown) {
		throw new NodeApiError(this.getNode(), err as JsonObject);
	}
}
