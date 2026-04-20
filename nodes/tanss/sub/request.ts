import { IExecuteFunctions, IHttpRequestOptions, NodeOperationError, NodeApiError, JsonObject } from 'n8n-workflow';

export type TanssAuthMode = 'user' | 'generated';

export function getTanssAuthMode(this: IExecuteFunctions, itemIndex: number): TanssAuthMode {
	return this.getNodeParameter('authMode', itemIndex, 'user') as TanssAuthMode;
}

export async function getTanssBaseUrl(this: IExecuteFunctions, itemIndex: number): Promise<string> {
	const authMode = getTanssAuthMode.call(this, itemIndex);
	const credentialName = authMode === 'generated' ? 'tanssGeneratedTokenApi' : 'tanssUserApi';
	const credentials = await this.getCredentials(credentialName);
	const baseURL = String(credentials.baseURL ?? '').replace(/\/+$/, '');

	if (!baseURL) {
		throw new NodeOperationError(this.getNode(), `No baseURL in credential "${credentialName}"`);
	}

	return baseURL;
}

export function isGeneratedTokenMode(this: IExecuteFunctions, itemIndex: number): boolean {
	return getTanssAuthMode.call(this, itemIndex) === 'generated';
}

function isTanssExpiredTokenError(error: unknown): boolean {
	const e = error as {
		response?: {
			status?: number;
			statusCode?: number;
			data?: { error?: { tokenExceptionType?: string; text?: string } };
			body?: { error?: { tokenExceptionType?: string; text?: string } };
		};
	};

	const statusCode = e?.response?.status ?? e?.response?.statusCode;
	if (statusCode !== 403) return false;

	const errorData = e?.response?.data ?? e?.response?.body;
	const tokenExceptionType = errorData?.error?.tokenExceptionType;
	const text = errorData?.error?.text;

	return tokenExceptionType === 'EXPIRED' || text === 'TOKEN_HAS_EXPIRED';
}

export async function tanssHttpRequest(this: IExecuteFunctions, itemIndex: number, options: IHttpRequestOptions) {
	const authMode = getTanssAuthMode.call(this, itemIndex);
	const credentialName = authMode === 'generated' ? 'tanssGeneratedTokenApi' : 'tanssUserApi';

	try {
		return await this.helpers.httpRequestWithAuthentication.call(this, credentialName, options);
	} catch (error: unknown) {
		if (authMode !== 'user' || !isTanssExpiredTokenError(error)) {
			throw error;
		}

		const userCredentials = (await this.getCredentials('tanssUserApi')) as {
			apiToken?: string;
			refreshToken?: string;
		};

		userCredentials.apiToken = '';
		if (typeof userCredentials.refreshToken === 'string') {
			userCredentials.refreshToken = '';
		}

		try {
			return await this.helpers.httpRequestWithAuthentication.call(this, credentialName, options);
		} catch (retryError: unknown) {
			throw new NodeApiError(this.getNode(), retryError as JsonObject, { itemIndex });
		}
	}
}
