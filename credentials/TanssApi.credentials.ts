import { Icon, ICredentialType, INodeProperties, ICredentialTestRequest } from 'n8n-workflow';

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
			displayName: '2FA Secret (optional)',
			name: 'totpSecret',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: false,
			description:
				'Base32 secret for TOTP-based 2FA. The 6-digit code will be generated automatically from this secret.',
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
