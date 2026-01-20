import {
	IExecuteFunctions,
	IHttpRequestMethods,
	INodeProperties,
	NodeOperationError,
} from 'n8n-workflow';
import { generateTOTP } from './2fa';

export const authOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['authentication'],
			},
		},
		options: [
			{
				name: 'Login',
				value: 'login',
				description: 'Login to the TANSS API',
				action: 'Login to the TANSS API',
			},
		],
		default: 'login',
	},
];

export const authFields: INodeProperties[] = [];

export async function handleAuth(this: IExecuteFunctions, i: number) {
	const operation = this.getNodeParameter('operation', i) as string;
	const credentials = await this.getCredentials('tanssApi');

	if (!credentials) {
		throw new NodeOperationError(this.getNode(), 'No credentials returned!');
	}

	const baseURL = (credentials.baseURL as string).replace(/\/+$/, '');
	const username = credentials.username as string;
	const password = credentials.password as string;

	const url = `${baseURL}/backend/api/v1/login`;

	if (operation === 'login') {
		const body: { username: string; password: string; token?: string } = { username, password };
		const totpSecret = (credentials as { totpSecret?: string | undefined }).totpSecret;

		if (totpSecret) {
			const triedWindows = [0, -1, 1];
			const maxAttempts = 3;
			let attempts = 0;
			let lastError: unknown;

			for (const w of triedWindows) {
				if (attempts >= maxAttempts) break;

				let code: string;
				try {
					code = generateTOTP(totpSecret, w);
					body.token = String(code);
					attempts += 1;
				} catch (err) {
					lastError = err;
					continue;
				}

				try {
					const requestOptions = {
						method: 'POST' as IHttpRequestMethods,
						url,
						body,
						json: true,
						headers: {
							'Content-Type': 'application/json',
						},
					};

					const responseData = await this.helpers.httpRequest(requestOptions);
					return responseData;
				} catch (err: unknown) {
					const e = err as
						| { message?: string; status?: number; response?: { status?: number; data?: unknown } }
						| undefined;
					lastError = err;

					const responseData = e?.response?.data ?? e?.message ?? e;
					const msg = JSON.stringify(responseData);

					if (msg.includes('LOGIN_ERROR_TOO_MANY_FAILED_LOGINS')) {
						throw new NodeOperationError(
							this.getNode(),
							`Login blocked: too many failed logins. Server response: ${msg}`,
						);
					}
					if (!msg.includes('LOGIN_ERROR_WRONG_LOGIN_TOKEN_CODE')) {
						throw new NodeOperationError(this.getNode(), `Login failed: ${msg}`);
					}
				}
			}

			throw new NodeOperationError(
				this.getNode(),
				`Failed to login with generated TOTP after ${attempts} attempts. Last error: ${JSON.stringify(lastError)}`,
			);
		}

		try {
			const requestOptions = {
				method: 'POST' as IHttpRequestMethods,
				url,
				body,
				json: true,
			};
			const responseData = await this.helpers.httpRequest(requestOptions);
			return responseData;
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : String(error);
			throw new NodeOperationError(this.getNode(), `Login failed: ${errorMessage}`);
		}
	}

	throw new NodeOperationError(this.getNode(), `The operation "${operation}" is not recognized.`);
}
