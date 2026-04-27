import { config } from '@n8n/node-cli/eslint';

const baseConfig = Array.isArray(config) ? config : [config];

export default [
	...baseConfig,
	{
		ignores: ['scripts/**'],
	},
];
