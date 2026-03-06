import { IExecuteFunctions, INodeProperties, NodeOperationError } from 'n8n-workflow';

export const companyCategoriesOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options' as const,
		noDataExpression: true,
		displayOptions: { show: { resource: ['companyCategories'] } },
		options: [
			{ name: 'List Categories', value: 'listCategories', action: 'List categories' },
			{ name: 'Create Category', value: 'createCategory', action: 'Create category' },
			{ name: 'Get Category', value: 'getCategory', action: 'Get category' },
			{ name: 'Update Category', value: 'updateCategory', action: 'Update category' },
			{ name: 'Delete Category', value: 'deleteCategory', action: 'Delete category' },
			{ name: 'List Company Types', value: 'listCompanyTypes', action: 'List company types' },
			{ name: 'Create Company Type', value: 'createCompanyType', action: 'Create company type' },
			{ name: 'Get Company Type', value: 'getCompanyType', action: 'Get company type' },
			{ name: 'Update Company Type', value: 'updateCompanyType', action: 'Update company type' },
			{ name: 'Delete Company Type', value: 'deleteCompanyType', action: 'Delete company type' },
		],
		default: 'listCategories',
	},
];

export const companyCategoriesFields: INodeProperties[] = [
	{
		displayName: 'API Token',
		name: 'apiToken',
		type: 'string' as const,
		required: true,
		typeOptions: { password: true },
		default: '',
		description: 'API token obtained from the TANSS API login',
		displayOptions: { show: { resource: ['companyCategories'] } },
	},
	{
		displayName: 'Category ID',
		name: 'categoryId',
		type: 'number' as const,
		default: 0,
		displayOptions: { show: { resource: ['companyCategories'], operation: ['getCategory', 'updateCategory', 'deleteCategory'] } },
		description: 'ID of the company category',
	},
	{
		displayName: 'Create Category Fields',
		name: 'createCategoryFields',
		type: 'collection' as const,
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['companyCategories'], operation: ['createCategory'] } },
		options: [
			{ displayName: 'id', name: 'id', type: 'number' as const, default: 0 },
			{ displayName: 'name', name: 'name', type: 'string' as const, default: '' },
		],
	},
	{
		displayName: 'Update Category Fields',
		name: 'updateCategoryFields',
		type: 'collection' as const,
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['companyCategories'], operation: ['updateCategory'] } },
		options: [
			{ displayName: 'id', name: 'id', type: 'number' as const, default: 0 },
			{ displayName: 'name', name: 'name', type: 'string' as const, default: '' },
		],
	},
	{
		displayName: 'Company Type ID',
		name: 'companyTypeId',
		type: 'number' as const,
		default: 0,
		displayOptions: { show: { resource: ['companyCategories'], operation: ['getCompanyType', 'updateCompanyType', 'deleteCompanyType'] } },
		description: 'ID of the company type',
	},
	{
		displayName: 'Create Company Type Fields',
		name: 'createCompanyTypeFields',
		type: 'collection' as const,
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['companyCategories'], operation: ['createCompanyType'] } },
		options: [
			{ displayName: 'id', name: 'id', type: 'number' as const, default: 0 },
			{ displayName: 'name', name: 'name', type: 'string' as const, default: '' },
			{ displayName: 'categoryId', name: 'categoryId', type: 'number' as const, default: 0 },
			{ displayName: 'categoryName', name: 'categoryName', type: 'string' as const, default: '' },
			{ displayName: 'icon', name: 'icon', type: 'string' as const, default: '' },
			{ displayName: 'hidden', name: 'hidden', type: 'boolean' as const, default: false },
		],
	},
	{
		displayName: 'Update Company Type Fields',
		name: 'updateCompanyTypeFields',
		type: 'collection' as const,
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['companyCategories'], operation: ['updateCompanyType'] } },
		options: [
			{ displayName: 'id', name: 'id', type: 'number' as const, default: 0 },
			{ displayName: 'name', name: 'name', type: 'string' as const, default: '' },
			{ displayName: 'categoryId', name: 'categoryId', type: 'number' as const, default: 0 },
			{ displayName: 'categoryName', name: 'categoryName', type: 'string' as const, default: '' },
			{ displayName: 'icon', name: 'icon', type: 'string' as const, default: '' },
			{ displayName: 'hidden', name: 'hidden', type: 'boolean' as const, default: false },
		],
	},
];

export async function handleCompanyCategories(this: IExecuteFunctions, i: number) {
	const operation = this.getNodeParameter('operation', i) as string;
	const credentials = await this.getCredentials('tanssApi');

	if (!credentials) throw new NodeOperationError(this.getNode(), 'No credentials returned!');

	const apiToken = this.getNodeParameter('apiToken', i, '') as string;
	const categoryId = this.getNodeParameter('categoryId', i, 0) as number;

	let url = '';
	const requestOptions: {
		method: 'GET' | 'POST' | 'PUT' | 'DELETE';
		headers: { apiToken: string; 'Content-Type': string };
		json: boolean;
		body?: Record<string, unknown>;
		url: string;
	} = {
		method: 'GET',
		headers: { apiToken, 'Content-Type': 'application/json' },
		json: true,
		url,
	};

	switch (operation) {
		case 'listCategories': {
			url = `${credentials.baseURL}/backend/api/v1/companyCategories`;
			requestOptions.method = 'GET';
			break;
		}
		case 'createCategory': {
			const createFields = this.getNodeParameter('createCategoryFields', i, {}) as any;
			if (Object.keys(createFields).length === 0) throw new NodeOperationError(this.getNode(), 'No fields provided for creating category.');
			url = `${credentials.baseURL}/backend/api/v1/companyCategories`;
			requestOptions.method = 'POST';
			requestOptions.body = createFields;
			break;
		}
		case 'getCategory': {
			url = `${credentials.baseURL}/backend/api/v1/companyCategories/${categoryId}`;
			requestOptions.method = 'GET';
			break;
		}
		case 'updateCategory': {
			const updateFields = this.getNodeParameter('updateCategoryFields', i, {}) as any;
			if (!categoryId) throw new NodeOperationError(this.getNode(), 'category id is required for update.');
			if (Object.keys(updateFields).length === 0) throw new NodeOperationError(this.getNode(), 'No fields provided for updating category.');
			url = `${credentials.baseURL}/backend/api/v1/companyCategories/${categoryId}`;
			requestOptions.method = 'PUT';
			requestOptions.body = updateFields;
			break;
		}
		case 'deleteCategory': {
			if (!categoryId) throw new NodeOperationError(this.getNode(), 'category id is required for delete.');
			url = `${credentials.baseURL}/backend/api/v1/companyCategories/${categoryId}`;
			requestOptions.method = 'DELETE';
			break;
		}
		case 'listCompanyTypes': {
			url = `${credentials.baseURL}/backend/api/v1/companyCategories/types`;
			requestOptions.method = 'GET';
			break;
		}
		case 'createCompanyType': {
			const createType = this.getNodeParameter('createCompanyTypeFields', i, {}) as any;
			if (Object.keys(createType).length === 0) throw new NodeOperationError(this.getNode(), 'No fields provided for creating company type.');
			if (!createType.name || createType.name === '') {
				throw new NodeOperationError(this.getNode(), 'Company type `name` is required for creation.');
			}
			if ((!createType.categoryId || createType.categoryId === 0) && (!createType.categoryName || createType.categoryName === '')) {
				throw new NodeOperationError(this.getNode(), 'Either `categoryId` or `categoryName` must be provided for company type creation.');
			}
			url = `${credentials.baseURL}/backend/api/v1/companyCategories/types`;
			requestOptions.method = 'POST';
			requestOptions.body = createType;
			break;
		}
		case 'getCompanyType': {
			const typeId = this.getNodeParameter('companyTypeId', i, 0) as number;
			url = `${credentials.baseURL}/backend/api/v1/companyCategories/types/${typeId}`;
			requestOptions.method = 'GET';
			break;
		}
		case 'updateCompanyType': {
			const typeId = this.getNodeParameter('companyTypeId', i, 0) as number;
			if (!typeId) throw new NodeOperationError(this.getNode(), 'company type id is required for update.');
			const updateType = this.getNodeParameter('updateCompanyTypeFields', i, {}) as any;
			if (Object.keys(updateType).length === 0) throw new NodeOperationError(this.getNode(), 'No fields provided for updating company type.');
			url = `${credentials.baseURL}/backend/api/v1/companyCategories/types/${typeId}`;
			requestOptions.method = 'PUT';
			requestOptions.body = updateType;
			break;
		}
		case 'deleteCompanyType': {
			const typeId = this.getNodeParameter('companyTypeId', i, 0) as number;
			if (!typeId) throw new NodeOperationError(this.getNode(), 'company type id is required for delete.');
			url = `${credentials.baseURL}/backend/api/v1/companyCategories/types/${typeId}`;
			requestOptions.method = 'DELETE';
			break;
		}
		default:
			throw new NodeOperationError(this.getNode(), `The operation "${operation}" is not recognized.`);
	}

	requestOptions.url = url;

	try {
		const responseData = await this.helpers.httpRequest(requestOptions as unknown as import('n8n-workflow').IHttpRequestOptions);
		if (operation === 'deleteCategory' || operation === 'deleteCompanyType') {
			if (responseData === '' || responseData == null) {
				return { statusCode: 204, message: 'deleted succesfully' };
			}
		}
		if (operation === 'createCategory' || operation === 'updateCategory' || operation === 'createCompanyType' || operation === 'updateCompanyType') {
			if (responseData === '' || responseData == null) {
				return { statusCode: 201, message: 'created/updated succesfully' };
			}
		}
		return responseData;
	} catch (error: unknown) {
		if (operation === 'deleteCategory' || operation === 'deleteCompanyType') {
			const anyErr = error as {
				statusCode?: number;
				response?: { status?: number; statusCode?: number; body?: unknown; data?: unknown };
			};
			const statusCode = anyErr?.response?.statusCode ?? anyErr?.response?.status ?? anyErr?.statusCode ?? 0;
			const rawBody = anyErr?.response?.body ?? anyErr?.response?.data;

			let parsedBody: unknown = rawBody;
			if (typeof rawBody === 'string') {
				try {
					parsedBody = JSON.parse(rawBody);
				} catch {
					parsedBody = rawBody;
				}
			}

			const tanssError = (parsedBody as { error?: { localizedText?: string; text?: string; type?: string } } | null)?.error;
			const fallbackMessage =
				error instanceof Error
					? error.message
					: statusCode > 0
						? `Delete request failed (status ${statusCode})`
						: 'Delete request failed.';

			return {
				success: false,
				statusCode,
				message: tanssError?.localizedText ?? tanssError?.text ?? fallbackMessage,
				error: tanssError ?? parsedBody,
			};
		}

		const anyErr = error as any;
		let message = error instanceof Error ? error.message : String(error);
		if (anyErr && anyErr.response) {
			try {
				const status = anyErr.response.status;
				const respData = anyErr.response.data;
				message += `; Status: ${status}`;
				if (respData) {
					if (respData.error) {
						message += `; Error: ${JSON.stringify(respData.error)}`;
					} else {
						message += `; Response: ${JSON.stringify(respData)}`;
					}
				}
			} catch (e) {}
		}
		throw new NodeOperationError(this.getNode(), `Failed to execute ${operation}: ${message}`);
	}
}
