import type {
	Icon,
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class TanssGeneratedTokenApi implements ICredentialType {
	name = 'tanssGeneratedTokenApi';

	displayName = 'TANSS Generated Token API';

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
			displayName: 'Generated API Token',
			name: 'apiToken',
			type: 'string',
			default: '',
			typeOptions: {
				password: true,
			},
			required: true,
			description: 'A generated TANSS API token, needs to be manually updated because of its lifetime.',
		},
	];

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
