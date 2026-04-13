import type {
	Icon,
	IAuthenticateGeneric,
	ICredentialDataDecryptedObject,
	ICredentialTestRequest,
	ICredentialType,
	IHttpRequestHelper,
	INodeProperties,
} from 'n8n-workflow';

import { generateTOTP } from '../nodes/tanss/sub/2fa';

type TanssLoginContent = {
	apiKey?: string;
	refresh?: string;
};

type TanssLoginResponse = {
	content?: TanssLoginContent;
};

function extractTokens(response: unknown): { apiToken: string; refreshToken: string } {
	const content = (response as TanssLoginResponse)?.content;
	const apiToken = content?.apiKey;
	const refreshToken = content?.refresh;
	if (!apiToken) {
		throw new Error('TANSS login did not return an apiKey token');
	}
	if (!refreshToken) {
		throw new Error('TANSS login did not return a refresh token');
	}
	return { apiToken, refreshToken };
}

async function loginWithCredentials(
	helper: IHttpRequestHelper,
	credentials: ICredentialDataDecryptedObject,
): Promise<{ apiToken: string; refreshToken: string }> {
	const baseURL = String(credentials.baseURL ?? '').replace(/\/+$/, '');
	const username = String(credentials.username ?? '');
	const password = String(credentials.password ?? '');
	const totpSecret = String(credentials.totpSecret ?? '');
	const url = `${baseURL}/backend/api/v1/login`;

	const body: { username: string; password: string; token?: string } = { username, password };
	if (totpSecret.trim() !== '') {
		body.token = generateTOTP(totpSecret);
	}

	const response = await helper.helpers.httpRequest({
		method: 'POST',
		url,
		json: true,
		body,
		headers: {
			'Content-Type': 'application/json',
		},
	});

	return extractTokens(response);
}

async function refreshWithRefreshToken(
	helper: IHttpRequestHelper,
	credentials: ICredentialDataDecryptedObject,
): Promise<{ apiToken: string; refreshToken: string }> {
	const baseURL = String(credentials.baseURL ?? '').replace(/\/+$/, '');
	const refreshToken = String(credentials.refreshToken ?? '');
	const url = `${baseURL}/backend/api/v1/ticketStates`;

	if (refreshToken.trim() === '') {
		throw new Error('No refresh token available');
	}

	const response = await helper.helpers.httpRequest({
		method: 'GET',
		url,
		json: true,
		headers: {
			apiToken: refreshToken,
			'Content-Type': 'application/json',
		},
	});

	return extractTokens(response);
}

export class TanssUserApi implements ICredentialType {
	name = 'tanssUserApi';

	displayName = 'TANSS User API';

	icon: Icon = { light: 'file:../icons/tanss.svg', dark: 'file:../icons/tanss.dark.svg' };

	documentationUrl = 'https://api-doc.tanss.de/';

	properties: INodeProperties[] = [
		{
			displayName: 'Base URL',
			name: 'baseURL',
			type: 'string',
			default: '',
			placeholder: 'https://your-tanss-api-url.com',
			required: true,
			description: 'The base URL of the TANSS API.',
		},
		{
			displayName: 'Username',
			name: 'username',
			type: 'string',
			default: '',
			required: true,
			description: 'The username to authenticate with the TANSS API.',
		},
		{
			displayName: 'Password',
			name: 'password',
			type: 'string',
			default: '',
			typeOptions: {
				password: true,
			},
			required: true,
			description: 'The password to authenticate with the TANSS API.',
		},
		{
			displayName: '2FA Secret (Optional)',
			name: 'totpSecret',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: false,
			description: 'Base32 secret for TOTP-based 2FA. The 6-digit code will be generated automatically.',
		},
		{
			displayName: 'API Token',
			name: 'apiToken',
			type: 'hidden',
			typeOptions: {
				password: true,
				expirable: true,
			},
			default: '',
		},
		{
			displayName: 'Refresh Token',
			name: 'refreshToken',
			type: 'hidden',
			typeOptions: {
				password: true,
			},
			default: '',
		},
	];

	async preAuthentication(this: IHttpRequestHelper, credentials: ICredentialDataDecryptedObject) {
		try {
			return await refreshWithRefreshToken(this, credentials);
		} catch {
			return await loginWithCredentials(this, credentials);
		}
	}

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				apiToken: '={{$credentials.apiToken}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseURL}}',
			url: '/',
			method: 'GET',
		},
	};
}
