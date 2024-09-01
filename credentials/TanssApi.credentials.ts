import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class TanssApi implements ICredentialType {
	name = 'tanssApi';
	displayName = 'TANSS API';
	properties: INodeProperties[] = [
		{
			displayName: 'Base URL',
			name: 'baseURL',
			type: 'string',
			default: '',
			placeholder: 'https://your-tanss-api-url.com',
			required: true,
		},
		{
			displayName: 'Username',
			name: 'username',
			type: 'string',
			default: '',
			required: true,
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
		},
	];
}
