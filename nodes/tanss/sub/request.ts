import type { ICredentialDataDecryptedObject, ICredentialsDecrypted } from 'n8n-workflow';
import { IExecuteFunctions, IHttpRequestOptions, NodeOperationError } from 'n8n-workflow';

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

function isTanssForbiddenError(error: unknown): boolean {
	const e = error as {
		response?: {
			status?: number;
			statusCode?: number;
		};
	};

	const statusCode = e?.response?.status ?? e?.response?.statusCode;
	return statusCode === 403;
}

export async function tanssHttpRequest(this: IExecuteFunctions, itemIndex: number, options: IHttpRequestOptions) {
	const authMode = getTanssAuthMode.call(this, itemIndex);
	const credentialName = authMode === 'generated' ? 'tanssGeneratedTokenApi' : 'tanssUserApi';

	try {
		return await this.helpers.httpRequestWithAuthentication.call(this, credentialName, options);
	} catch (error: unknown) {
		if (authMode !== 'user' || !isTanssForbiddenError(error)) {
			throw error;
		}

		const currentCredentials = (await this.getCredentials('tanssUserApi')) as ICredentialDataDecryptedObject;
		const credentialsDecrypted: ICredentialsDecrypted<ICredentialDataDecryptedObject> = {
			id: '',
			name: 'tanssUserApi-retry',
			type: 'tanssUserApi',
			data: {
				...currentCredentials,
				apiToken: '',
			},
		};

		return await this.helpers.httpRequestWithAuthentication.call(this, credentialName, options, {
			credentialsDecrypted,
		});
	}
}
