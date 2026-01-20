import { IExecuteFunctions, INodeProperties, NodeOperationError, IDataObject } from 'n8n-workflow';

export const ticketContentOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options' as const,
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['ticketContent'],
			},
		},
		options: [
			{
				name: 'Get Ticket Documents',
				value: 'getTicketDocuments',
				description: 'Gets all documents attached to a ticket (list)',
				action: 'Get ticket documents',
			},
			{
				name: 'Get Ticket Document',
				value: 'getTicketDocument',
				description: 'Generates a one-time download URL for a specific ticket document',
				action: 'Get a ticket document',
			},
			{
				name: 'Get Ticket Images',
				value: 'getTicketImages',
				description: 'Gets all images (screenshots) attached to a ticket (list)',
				action: 'Get ticket images',
			},
			{
				name: 'Get Ticket Image',
				value: 'getTicketImage',
				description: 'Generates a one-time download URL for a specific ticket image',
				action: 'Get a ticket image',
			},
			{
				name: 'Upload Document / Image',
				value: 'uploadTicketContent',
				description: 'Uploads a document or image into a ticket (multipart/form-data)',
				action: 'Upload document or image to ticket',
			},
		],
		default: 'getTicketDocuments',
	},
];

export const ticketContentFields: INodeProperties[] = [
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
				resource: ['ticketContent'],
			},
		},
	},
	{
		displayName: 'Ticket ID',
		name: 'ticketId',
		type: 'number' as const,
		displayOptions: {
			show: {
				resource: ['ticketContent'],
			},
		},
		default: 0,
		description: 'ID of the ticket',
	},
	{
		displayName: 'Document ID',
		name: 'documentId',
		type: 'number' as const,
		displayOptions: {
			show: {
				resource: ['ticketContent'],
				operation: ['getTicketDocument'],
			},
		},
		default: 0,
		description: 'ID of the document to generate a one-time download URL for',
	},
	{
		displayName: 'Image ID',
		name: 'imageId',
		type: 'number' as const,
		displayOptions: {
			show: {
				resource: ['ticketContent'],
				operation: ['getTicketImage'],
			},
		},
		default: 0,
		description: 'ID of the image to generate a one-time download URL for',
	},
	{
		displayName: 'Binary Property Name',
		name: 'binaryPropertyName',
		type: 'string' as const,
		default: 'data',
		description: 'Name of the binary property that contains the file to upload',
		displayOptions: {
			show: {
				resource: ['ticketContent'],
				operation: ['uploadTicketContent'],
			},
		},
	},
	{
		displayName: 'Descriptions',
		name: 'descriptions',
		type: 'string' as const,
		default: '',
		description: 'Description for the uploaded file(s) (if multiple, separate by newline)',
		displayOptions: {
			show: {
				resource: ['ticketContent'],
				operation: ['uploadTicketContent'],
			},
		},
	},
];

export async function handleTicketContent(this: IExecuteFunctions, i: number) {
	const operation = this.getNodeParameter('operation', i) as string;
	const supported = [
		'getTicketDocuments',
		'getTicketDocument',
		'getTicketImages',
		'getTicketImage',
		'uploadTicketContent',
	] as const;
	if (!supported.includes(operation as (typeof supported)[number])) {
		throw new NodeOperationError(
			this.getNode(),
			`Operation "${operation}" not supported by TicketContent.`,
		);
	}

	const credentials = await this.getCredentials('tanssApi');
	if (!credentials) throw new NodeOperationError(this.getNode(), 'No credentials returned!');

	const apiToken = this.getNodeParameter('apiToken', i, '') as string;
	const ticketId = this.getNodeParameter('ticketId', i, 0) as number;
	const typedCredentials = credentials as { baseURL?: string };
	const baseURL = typedCredentials.baseURL;
	if (!baseURL) throw new NodeOperationError(this.getNode(), 'No baseURL in credentials');
	if (!ticketId || ticketId <= 0)
		throw new NodeOperationError(this.getNode(), 'Valid Ticket ID is required.');

	let url = '';
	const requestOptions: IDataObject = {
		method: 'GET',
		url: '',
		headers: { apiToken, 'Content-Type': 'application/json' },
		json: true,
	};

	if (operation === 'getTicketDocuments') {
		url = `${baseURL}/backend/api/v1/tickets/${ticketId}/documents`;
	} else if (operation === 'getTicketDocument') {
		const documentId = this.getNodeParameter('documentId', i, 0) as number;
		if (!documentId || documentId <= 0)
			throw new NodeOperationError(this.getNode(), 'Valid Document ID is required.');
		url = `${baseURL}/backend/api/v1/tickets/${ticketId}/documents/${documentId}`;
	} else if (operation === 'getTicketImages') {
		url = `${baseURL}/backend/api/v1/tickets/${ticketId}/screenshots`;
	} else if (operation === 'getTicketImage') {
		const imageId = this.getNodeParameter('imageId', i, 0) as number;
		if (!imageId || imageId <= 0)
			throw new NodeOperationError(this.getNode(), 'Valid Image ID is required.');
		url = `${baseURL}/backend/api/v1/tickets/${ticketId}/screenshots/${imageId}`;
	} else {
		const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i, 'data') as string;
		const descriptionsParam = this.getNodeParameter('descriptions', i, '') as string;

		const items = this.getInputData();
		const item = items[i];
		if (!item.binary || !item.binary[binaryPropertyName]) {
			throw new NodeOperationError(
				this.getNode(),
				`No binary found on item index ${i} with property name "${binaryPropertyName}"`,
			);
		}

		const binaryEntry = item.binary[binaryPropertyName] as {
			fileName?: string;
			data: string;
			mimeType?: string;
		};

		if (!binaryEntry || typeof binaryEntry.data !== 'string') {
			throw new NodeOperationError(this.getNode(), 'Binary data malformed or missing.');
		}

		let BufferCtor: { from: (data: string, encoding?: string) => Uint8Array } | undefined;
		if (
			typeof Buffer !== 'undefined' &&
			typeof (Buffer as unknown as { from?: unknown }).from === 'function'
		) {
			BufferCtor = Buffer as unknown as { from: (data: string, encoding?: string) => Uint8Array };
		}
		if (BufferCtor === undefined) {
			throw new NodeOperationError(this.getNode(), 'Buffer is not available in this runtime.');
		}
		const fileBuffer = BufferCtor.from(binaryEntry.data, 'base64');

		const fileName = binaryEntry.fileName ?? 'file';
		const contentType = binaryEntry.mimeType ?? 'application/octet-stream';

		url = `${baseURL}/backend/api/v1/tickets/${ticketId}/upload`;
		const boundary = `----n8nBoundary${Date.now()}`;
		const crlf = '\r\n';
		const delimiter = `--${boundary}${crlf}`;
		const closeDelimiter = `${crlf}--${boundary}--${crlf}`;

		const filePartHeader =
			`Content-Disposition: form-data; name="files"; filename="${fileName}"${crlf}` +
			`Content-Type: ${contentType}${crlf}${crlf}`;

		const descPartHeader = `${crlf}--${boundary}${crlf}Content-Disposition: form-data; name="descriptions"${crlf}${crlf}`;

		const preamble = Buffer.from(delimiter + filePartHeader, 'utf8');
		const postamble = Buffer.from(descPartHeader + descriptionsParam + closeDelimiter, 'utf8');

		const bodyBuffer = Buffer.concat([preamble, fileBuffer, postamble]);

		const headers: IDataObject = {
			apiToken,
			'Content-Type': `multipart/form-data; boundary=${boundary}`,
			'Content-Length': String(bodyBuffer.length),
		};

		Object.assign(requestOptions, {
			method: 'POST',
			url,
			headers,
			body: bodyBuffer,
			json: false,
		});
	}

	if (operation !== 'uploadTicketContent') {
		requestOptions.url = url;
	}

	try {
		const response = await this.helpers.httpRequest(
			requestOptions as unknown as import('n8n-workflow').IHttpRequestOptions,
		);
		return response;
	} catch (error: unknown) {
		const err = error as unknown as { response?: unknown; statusCode?: number; message?: string };
		const resp = err.response as unknown as Record<string, unknown> | undefined;
		const respBody = resp?.body ?? resp?.data ?? resp;
		const status = resp?.status ?? err.statusCode ?? undefined;
		const message = err?.message ?? (error instanceof Error ? error.message : String(error));
		let extra = '';
		try {
			if (respBody !== undefined) {
				const serialized = typeof respBody === 'string' ? respBody : JSON.stringify(respBody);
				extra = ` ResponseBody: ${serialized}`;
			}
		} catch {
			// nothing here
		}
		const statusTxt = status ? ` Status: ${status}.` : '';
		throw new NodeOperationError(
			this.getNode(),
			`Failed to fetch ticket content: ${message}.${statusTxt}${extra}`,
		);
	}
}
