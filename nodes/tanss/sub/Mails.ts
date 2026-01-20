import {
	IExecuteFunctions,
	INodeProperties,
	NodeOperationError,
	IDataObject,
	IHttpRequestOptions,
} from 'n8n-workflow';

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
		],
		default: 'testSmtp',
	},
];

export const mailsFields: INodeProperties[] = [
	{
		displayName: 'API Token',
		name: 'apiToken',
		type: 'string' as const,
		required: true,
		typeOptions: { password: true },
		default: '',
		description: 'API token obtained from the TANSS web interface (must be generated in TANSS)',
		displayOptions: { show: { resource: ['mails'] } },
	},
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
	const credentials = await this.getCredentials('tanssApi');
	if (!credentials) throw new NodeOperationError(this.getNode(), 'No credentials returned!');

	const apiToken = this.getNodeParameter('apiToken', i, '') as string;
	const receiver = this.getNodeParameter('receiver', i, '') as string;
	if (!receiver || String(receiver).trim() === '')
		throw new NodeOperationError(this.getNode(), 'receiver is required');

	const base = credentials.baseURL as string;
	if (!base) throw new NodeOperationError(this.getNode(), 'No baseURL in credentials');

	const requestOptions: {
		method: 'GET' | 'POST' | 'PUT' | 'DELETE';
		headers: { [key: string]: string };
		json: boolean;
		body?: IDataObject;
		url: string;
	} = {
		method: 'POST',
		headers: { Accept: 'application/json' },
		json: true,
		url: '',
	};

	if (apiToken && apiToken.toString().trim() !== '') {
		const tokenValue = String(apiToken).startsWith('Bearer ')
			? String(apiToken)
			: `Bearer ${String(apiToken)}`;
		requestOptions.headers.Authorization = tokenValue;
		requestOptions.headers.apiToken = tokenValue;
	}

	switch (operation) {
		case 'testSmtp': {
			const fields = this.getNodeParameter('mailObject', i, {}) as IDataObject;
			const body: IDataObject = {};

			if (fields.smtpAddress && String(fields.smtpAddress).trim() !== '')
				body.smtpAddress = String(fields.smtpAddress).trim();
			if (fields.smtpHost && String(fields.smtpHost).trim() !== '')
				body.smtpHost = String(fields.smtpHost).trim();
			if (fields.smtpUser && String(fields.smtpUser).trim() !== '')
				body.smtpUser = String(fields.smtpUser).trim();
			if (fields.smtpPassword && String(fields.smtpPassword).trim() !== '')
				body.smtpPassword = String(fields.smtpPassword).trim();
			if (fields.smtpAuth !== undefined) body.smtpAuth = Boolean(fields.smtpAuth);
			if (fields.smtpEncryptionType && String(fields.smtpEncryptionType).trim() !== '')
				body.smtpEncryptionType = String(fields.smtpEncryptionType).trim();
			if (fields.smtpSenderName && String(fields.smtpSenderName).trim() !== '')
				body.smtpSenderName = String(fields.smtpSenderName).trim();

			const url = `${base}/backend/api/v1/mails/test/smtp?receiver=${encodeURIComponent(String(receiver))}`;
			requestOptions.method = 'POST';
			requestOptions.url = url;
			requestOptions.headers['Content-Type'] = 'application/json';
			requestOptions.body = body;
			break;
		}

		default:
			throw new NodeOperationError(
				this.getNode(),
				`The operation "${operation}" is not recognized.`,
			);
	}

	try {
		const fullResponse = await this.helpers.httpRequest({
			...(requestOptions as unknown as IDataObject),
			simple: false,
			resolveWithFullResponse: true,
		} as unknown as IHttpRequestOptions);
		if (fullResponse && fullResponse.statusCode === 201) {
			return {
				success: true,
				statusCode: 201,
				message: 'Test email sent',
				body: fullResponse.body,
			} as unknown as IDataObject;
		}
		if (fullResponse && fullResponse.statusCode === 500) {
			return {
				success: false,
				statusCode: 500,
				message: 'Server error while sending test email',
				body: fullResponse.body,
			} as unknown as IDataObject;
		}
		return fullResponse && fullResponse.body ? fullResponse.body : fullResponse;
	} catch (err: unknown) {
		const e = err as unknown as { statusCode?: number; response?: { statusCode?: number } };
		const status = e?.statusCode ?? e?.response?.statusCode;
		if (status === 500) {
			return {
				success: false,
				statusCode: 500,
				message: 'Server error while sending test email',
			} as unknown as IDataObject;
		}
		const msg = err instanceof Error ? err.message : String(err);
		throw new NodeOperationError(this.getNode(), `Failed to execute ${operation}: ${msg}`);
	}
}
