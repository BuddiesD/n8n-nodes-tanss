import {
	Icon,
	ICredentialType,
	INodeProperties,
	ICredentialTestRequest,
} from 'n8n-workflow';

export class TanssApi implements ICredentialType {
	name = 'tanssApi';
	displayName = 'TANSS API';
	icon: Icon = { light: 'file:../icons/tanss.svg', dark: 'file:../icons/tanss.svg' };
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
			displayName: 'Authentication',
			name: 'authentication',
			type: 'options',
			default: 'loginTotp',
			options: [
				{
					name: 'Username + Password (+ TOTP)',
					value: 'loginTotp',
					description: 'Authenticate using username and password, with optional TOTP-based 2FA.',
				},
				{
					name: 'API Token',
					value: 'apiToken',
					description: 'Authenticate using a pre-generated API token.',
				},
			],
		},
		{
			displayName: 'Username',
			name: 'username',
			type: 'string',
			default: '',
			displayOptions: {
				show: { authentication: ['loginTotp'] },
			},
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
			displayOptions: {
				show: { authentication: ['loginTotp'] },
			},
			required: true,
			description: 'The password to authenticate with the TANSS API.',
		},
		{
			displayName: '2FA Secret (optional)',
			name: 'totpSecret',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			displayOptions: {
				show: {
					authentication: ['loginTotp'],
				},
			},
			required: false,
			description:
				'Base32 secret for TOTP-based 2FA. The 6-digit code will be generated automatically from this secret.',
		},
		{
			displayName: 'API Token',
			name: 'apiToken',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			displayOptions: {
				show: {
					authentication: ['apiToken'],
				},
			},
			required: true,
			description: 'The API Token to authenticate with the TANSS API.',
		},
	];

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseURL}}',
			url: '/',
			method: 'GET',
		},
	};
}
