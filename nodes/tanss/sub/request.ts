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

export async function tanssHttpRequest(this: IExecuteFunctions, itemIndex: number, options: IHttpRequestOptions) {
	const authMode = getTanssAuthMode.call(this, itemIndex);
	const credentialName = authMode === 'generated' ? 'tanssGeneratedTokenApi' : 'tanssUserApi';
	return await this.helpers.httpRequestWithAuthentication.call(this, credentialName, options);
}
