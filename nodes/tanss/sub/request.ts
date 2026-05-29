import {
	IAdditionalCredentialOptions,
	ICredentialDataDecryptedObject,
	IExecuteFunctions,
	IHttpRequestOptions,
	JsonObject,
	NodeApiError,
	NodeOperationError,
} from 'n8n-workflow';

export type TanssAuthMode = 'user' | 'generated';
type TanssCredentialName = 'tanssUserApi' | 'tanssGeneratedTokenApi';

export function getTanssAuthMode(this: IExecuteFunctions, itemIndex: number): TanssAuthMode {
	return this.getNodeParameter('authMode', itemIndex, 'user') as TanssAuthMode;
}

function getTanssCredentialName(this: IExecuteFunctions, itemIndex: number): TanssCredentialName {
	const attachedCredentials = this.getNode().credentials;

	if (attachedCredentials?.tanssUserApi) {
		return 'tanssUserApi';
	}

	if (attachedCredentials?.tanssGeneratedTokenApi) {
		return 'tanssGeneratedTokenApi';
	}

	return getTanssAuthMode.call(this, itemIndex) === 'generated' ? 'tanssGeneratedTokenApi' : 'tanssUserApi';
}

export async function getTanssBaseUrl(this: IExecuteFunctions, itemIndex: number): Promise<string> {
	const credentialName = getTanssCredentialName.call(this, itemIndex);
	const credentials = await this.getCredentials(credentialName);
	const baseURL = String(credentials.baseURL ?? '').replace(/\/+$/, '');

	if (!baseURL) {
		throw new NodeOperationError(this.getNode(), `No baseURL in credential "${credentialName}"`);
	}

	return baseURL;
}

export function isGeneratedTokenMode(this: IExecuteFunctions, itemIndex: number): boolean {
	return getTanssCredentialName.call(this, itemIndex) === 'tanssGeneratedTokenApi';
}

function shouldRetryExpiredUserToken(error: unknown): boolean {
	const candidate = error as {
		httpCode?: string | number;
		message?: string;
		description?: string;
		context?: {
			data?: {
				error?: { tokenExceptionType?: string; text?: string; message?: string };
				message?: string;
			};
		};
		response?: {
			status?: number;
			statusCode?: number;
			data?: {
				error?: { tokenExceptionType?: string; text?: string; message?: string };
				message?: string;
			};
			body?: {
				error?: { tokenExceptionType?: string; text?: string; message?: string };
				message?: string;
			};
		};
	};

	const statusCode =
		candidate.response?.status ??
		candidate.response?.statusCode ??
		(typeof candidate.httpCode === 'string' ? Number(candidate.httpCode) : candidate.httpCode);

	if (statusCode !== 403) {
		return false;
	}

	const errorData = candidate.response?.data ?? candidate.response?.body ?? candidate.context?.data;
	const tokenExceptionType = errorData?.error?.tokenExceptionType;
	const tokenText = errorData?.error?.text;
	const tokenMessage = errorData?.error?.message ?? errorData?.message;
	const fallbackText = `${candidate.message ?? ''} ${candidate.description ?? ''}`;

	return [tokenExceptionType, tokenText, tokenMessage, fallbackText].some(
		(value) =>
			String(value ?? '')
				.toUpperCase()
				.includes('TOKEN_HAS_EXPIRED') ||
			String(value ?? '')
				.toUpperCase()
				.includes('EXPIRED'),
	);
}

function getExpiredUserTokenRetryOptions(credentials: ICredentialDataDecryptedObject): IAdditionalCredentialOptions {
	return {
		credentialsDecrypted: {
			id: '',
			name: 'tanssUserApi',
			type: 'tanssUserApi',
			data: {
				...credentials,
				apiToken: '',
			},
		},
	};
}

export async function tanssHttpRequest(this: IExecuteFunctions, itemIndex: number, options: IHttpRequestOptions) {
	const credentialName = getTanssCredentialName.call(this, itemIndex);

	if (credentialName === 'tanssGeneratedTokenApi') {
		return await this.helpers.httpRequestWithAuthentication.call(this, credentialName, options);
	}

	try {
		return await this.helpers.httpRequestWithAuthentication.call(this, credentialName, options);
	} catch (error) {
		if (!shouldRetryExpiredUserToken(error)) {
			throw new NodeApiError(this.getNode(), error as JsonObject, { itemIndex });
		}

		const credentials = await this.getCredentials(credentialName, itemIndex);

		return await this.helpers.httpRequestWithAuthentication.call(this, credentialName, options, getExpiredUserTokenRetryOptions(credentials));
	}
}
