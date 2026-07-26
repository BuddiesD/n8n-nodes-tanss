import { IExecuteFunctions, INodeProperties, NodeOperationError, IDataObject, NodeApiError, JsonObject } from 'n8n-workflow';
import { getTanssBaseUrl, tanssHttpRequest } from './request';

export const searchOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options' as const,
		noDataExpression: true,
		displayOptions: {
			show: { resource: ['search'] },
		},
		options: [
			{
				name: 'Global Search',
				value: 'globalSearch',
				description: 'Executes a global search using the provided configuration',
				action: 'Global search',
			},
		],
		default: 'globalSearch',
	},
];

export const searchFields: INodeProperties[] = [
	{
		displayName: 'Use Raw Filter JSON (Optional)',
		name: 'filterJson',
		type: 'string' as const,
		default: '',
		description: 'If provided (valid JSON), this object will be sent as the request body for the search call (overrides fields below)',
		displayOptions: { show: { resource: ['search'], operation: ['globalSearch'] } },
	},

	{
		displayName: 'Search Configuration',
		name: 'searchConfig',
		type: 'collection' as const,
		placeholder: 'Add Field',
		displayOptions: { show: { resource: ['search'], operation: ['globalSearch'] } },
		default: {},
		options: [
			{
				displayName: 'Areas',
				name: 'areas',
				type: 'multiOptions' as const,
				options: [
					{ name: 'COMPANY', value: 'COMPANY' },
					{ name: 'EMPLOYEE', value: 'EMPLOYEE' },
					{ name: 'TICKET', value: 'TICKET' },
				],
				default: [],
			},
			{ displayName: 'Query', name: 'query', type: 'string' as const, default: '' },

			{
				displayName: 'Company Max Results',
				name: 'companyMaxResults',
				type: 'number' as const,
				default: 0,
			},

			{
				displayName: 'Employee Max Results',
				name: 'employeeMaxResults',
				type: 'number' as const,
				default: 0,
			},
			{
				displayName: 'Employee Company ID',
				name: 'employeeCompanyId',
				type: 'number' as const,
				default: 0,
			},
			{
				displayName: 'Employee Inactive',
				name: 'employeeInactive',
				type: 'boolean' as const,
				default: true,
			},
			{
				displayName: 'Employee Categories',
				name: 'employeeCategories',
				type: 'boolean' as const,
				default: false,
			},
			{
				displayName: 'Employee Callbacks',
				name: 'employeeCallbacks',
				type: 'boolean' as const,
				default: false,
			},

			{
				displayName: 'Ticket Max Results',
				name: 'ticketMaxResults',
				type: 'number' as const,
				default: 0,
			},
			{
				displayName: 'Ticket Preview Content Max Chars',
				name: 'ticketPreviewContentMaxChars',
				type: 'number' as const,
				default: 0,
			},
			{
				displayName: 'Ticket Company ID',
				name: 'ticketCompanyId',
				type: 'number' as const,
				default: 0,
			},
		],
	},
];

export async function handleSearch(this: IExecuteFunctions, i: number) {
	const credentials = { baseURL: await getTanssBaseUrl.call(this, i) };
	const base = credentials.baseURL as string;

	const filterJson = this.getNodeParameter('filterJson', i, '') as string;

	let body: IDataObject = {};

	if (filterJson && filterJson.trim() !== '') {
		try {
			const parsed = JSON.parse(filterJson);
			if (typeof parsed !== 'object' || parsed === null) throw new NodeOperationError(this.getNode(), 'filterJson must be a JSON object.');
			body = parsed as IDataObject;
		} catch (err) {
			throw new NodeApiError(this.getNode(), err as JsonObject);
		}
	} else {
		const cfg = this.getNodeParameter('searchConfig', i, {}) as IDataObject;
		if (cfg.areas && Array.isArray(cfg.areas) && cfg.areas.length) body.areas = cfg.areas;
		if (cfg.query && typeof cfg.query === 'string' && cfg.query.trim() !== '') body.query = cfg.query;

		const configs: IDataObject = {};
		if (cfg.companyMaxResults && Number(cfg.companyMaxResults) > 0) configs.company = { maxResults: Number(cfg.companyMaxResults) };

		if (
			(cfg.employeeMaxResults && Number(cfg.employeeMaxResults) > 0) ||
			(cfg.employeeCompanyId && Number(cfg.employeeCompanyId) > 0) ||
			cfg.employeeInactive !== undefined ||
			cfg.employeeCategories === true ||
			cfg.employeeCallbacks === true
		) {
			const emp: IDataObject = {};
			if (cfg.employeeMaxResults && Number(cfg.employeeMaxResults) > 0) emp.maxResults = Number(cfg.employeeMaxResults);
			if (cfg.employeeCompanyId && Number(cfg.employeeCompanyId) > 0) emp.companyId = Number(cfg.employeeCompanyId);
			if (typeof cfg.employeeInactive === 'boolean') emp.inactive = cfg.employeeInactive;
			if (cfg.employeeCategories === true) emp.categories = true;
			if (cfg.employeeCallbacks === true) emp.callbacks = true;
			configs.employee = emp;
		}

		if (
			(cfg.ticketMaxResults && Number(cfg.ticketMaxResults) > 0) ||
			(cfg.ticketPreviewContentMaxChars && Number(cfg.ticketPreviewContentMaxChars) > 0) ||
			(cfg.ticketCompanyId && Number(cfg.ticketCompanyId) > 0)
		) {
			const t: IDataObject = {};
			if (cfg.ticketMaxResults && Number(cfg.ticketMaxResults) > 0) t.maxResults = Number(cfg.ticketMaxResults);
			if (cfg.ticketPreviewContentMaxChars && Number(cfg.ticketPreviewContentMaxChars) > 0)
				t.previewContentMaxChars = Number(cfg.ticketPreviewContentMaxChars);
			if (cfg.ticketCompanyId && Number(cfg.ticketCompanyId) > 0) t.companyId = Number(cfg.ticketCompanyId);
			configs.ticket = t;
		}

		if (Object.keys(configs).length) body.configs = configs;
	}

	const requestOptions: {
		method: 'PUT';
		headers: { [key: string]: string };
		json: boolean;
		body?: IDataObject;
		url: string;
	} = {
		method: 'PUT',
		headers: { Accept: 'application/json' },
		json: true,
		url: '',
	};

	const url = `${base}/backend/api/v1/search`;
	requestOptions.url = url;
	requestOptions.headers['Content-Type'] = 'application/json';
	requestOptions.body = body;

	try {
		const responseData = await tanssHttpRequest.call(this, i, requestOptions as unknown as import('n8n-workflow').IHttpRequestOptions);
		return responseData;
	} catch (error: unknown) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}
