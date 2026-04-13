import { INodeType, INodeTypeDescription, IExecuteFunctions, NodeOperationError, NodeConnectionTypes } from 'n8n-workflow';
import { handlePc, pcOperations, pcFields } from './sub/PCs';
import { handleTicket, ticketOperations, ticketFields } from './sub/Tickets';
import { handleDomains, domainOperations, domainFields } from './sub/Domains';
import { handleIps, ipsOperations, ipsFields } from './sub/ips';
import { handleChecklists, checklistsOperations, checklistsFields } from './sub/Checklists';
import { handleTicketList, ticketListOperations, ticketListFields } from './sub/TicketLists';
import { handleTicketContent, ticketContentOperations, ticketContentFields } from './sub/TicketContent';
import { handleTicketStates, ticketStatesOperations, ticketStatesFields } from './sub/TicketSates';
import { handleTimestamps, timestampOperations, timestampFields } from './sub/timestamp';
import { handleAvailability, availabilityOperations, availabilityFields } from './sub/Availability';
import { handleEmployees, employeesOperations, employeesFields } from './sub/Employees';
import { handleMails, mailsOperations, mailsFields } from './sub/Mails';
import { handleCalls, callsOperations, callsFields } from './sub/calls';
import { handleCallsUser, callsUserOperations, callsUserFields } from './sub/callsuser';
import { handleRemoteSupports, remoteSupportsOperations, remoteSupportsFields } from './sub/RemoteSupports';
import { handleCpu, cpuOperations, cpuFields } from './sub/CPUs';
import { handleHddTypes, hddTypesOperations, hddTypesFields } from './sub/hddTypes';
import { handleManufacturers, manufacturersOperations, manufacturersFields } from './sub/manufacturers';
import { handlePeriphery, peripheryOperations, peripheryFields } from './sub/Periphery';
import { handleComponents, componentsOperations, componentsFields } from './sub/Components';
import { handleCompanyCategories, companyCategoriesOperations, companyCategoriesFields } from './sub/CompanyCategories';
import { handleOperatingSystems, operatingSystemsOperations, operatingSystemsFields } from './sub/OperatingSystems';
import { handleSearch, searchOperations, searchFields } from './sub/Search';
import { handleCallback, callbackOperations, callbackFields } from './sub/Callback';
import { handleSoftwareLicenses, softwareLicensesOperations, softwareLicensesFields } from './sub/SoftwareLicenses';
import { handleChats, chatsOperations, chatsFields } from './sub/chats';

export class Tanss implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'TANSS',
		name: 'tanss',
		icon: 'file:../../icons/tanss.svg',
		group: ['transform'],
		version: 1,
		description: 'Interact with the TANSS API',
		subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
		usableAsTool: true,
		defaults: {
			name: 'TANSS',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],

		credentials: [
			{
				name: 'tanssUserApi',
				required: true,
				displayOptions: {
					show: {
						authMode: ['user'],
					},
				},
			},
			{
				name: 'tanssGeneratedTokenApi',
				required: true,
				displayOptions: {
					show: {
						authMode: ['generated'],
					},
				},
			},
		],

		properties: [
			{
				displayName: 'Auth Mode',
				name: 'authMode',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Generated Token', value: 'generated' },
					{ name: 'User Login (Auto Refresh)', value: 'user' },
				],
				default: 'user',
				description: 'Choose which TANSS credential type should be used for authenticated requests',
			},
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Availability', value: 'availability' },
					{ name: 'Call', value: 'calls' },
					{ name: 'Call User', value: 'callsuser' },
					{ name: 'Callback', value: 'callbacks' },
					{ name: 'Chat', value: 'chats' },
					{ name: 'Checklist', value: 'checklists' },
					{ name: 'Company Category', value: 'companyCategories' },
					{ name: 'Component', value: 'components' },
					{ name: 'CPU', value: 'cpus' },
					{ name: 'Domain', value: 'domain' },
					{ name: 'Employee', value: 'employees' },
					{ name: 'HDD Type', value: 'hddTypes' },
					{ name: 'IP', value: 'ips' },
					{ name: 'Mail', value: 'mails' },
					{ name: 'Manufacturer', value: 'manufacturers' },
					{ name: 'Operating System', value: 'operatingSystems' },
					{ name: 'PC', value: 'pc' },
					{ name: 'Periphery', value: 'peripheries' },
					{ name: 'Remote Support', value: 'remoteSupports' },
					{ name: 'Search', value: 'search' },
					{ name: 'Software License', value: 'softwareLicenses' },
					{ name: 'Ticket', value: 'ticket' },
					{ name: 'Ticket Content', value: 'ticketContent' },
					{ name: 'Ticket List', value: 'ticketList' },
					{ name: 'Ticket State', value: 'ticketStates' },
					{ name: 'Timestamp', value: 'timestamps' },
				],
				default: 'availability',
				description: 'Select which TANSS API resource to interact with',
			},

			...pcOperations,
			...pcFields,
			...ticketOperations,
			...ticketFields,
			...domainOperations,
			...domainFields,
			...checklistsOperations,
			...checklistsFields,
			...ticketContentOperations,
			...ticketContentFields,
			...ticketListOperations,
			...ticketListFields,
			...ticketStatesOperations,
			...ticketStatesFields,
			...timestampOperations,
			...timestampFields,
			...availabilityOperations,
			...availabilityFields,
			...employeesOperations,
			...employeesFields,
			...mailsOperations,
			...mailsFields,
			...callsOperations,
			...callsFields,
			...callsUserOperations,
			...callsUserFields,
			...cpuOperations,
			...cpuFields,
			...hddTypesOperations,
			...hddTypesFields,
			...ipsOperations,
			...ipsFields,
			...componentsOperations,
			...componentsFields,
			...companyCategoriesOperations,
			...companyCategoriesFields,
			...peripheryOperations,
			...peripheryFields,
			...manufacturersOperations,
			...manufacturersFields,
			...operatingSystemsOperations,
			...operatingSystemsFields,
			...callbackOperations,
			...callbackFields,
			...chatsOperations,
			...chatsFields,
			...searchOperations,
			...searchFields,
			...softwareLicensesOperations,
			...softwareLicensesFields,
			...remoteSupportsOperations,
			...remoteSupportsFields,
		],
	};

	async execute(this: IExecuteFunctions) {
		const items = this.getInputData();
		const returnData = [];
		const resource = this.getNodeParameter('resource', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData;
				if (resource === 'pc') responseData = await handlePc.call(this, i);
				else if (resource === 'cpus') responseData = await handleCpu.call(this, i);
				else if (resource === 'ticket') responseData = await handleTicket.call(this, i);
				else if (resource === 'domain') responseData = await handleDomains.call(this, i);
				else if (resource === 'checklists') responseData = await handleChecklists.call(this, i);
				else if (resource === 'peripheries') responseData = await handlePeriphery.call(this, i);
				else if (resource === 'components') responseData = await handleComponents.call(this, i);
				else if (resource === 'companyCategories') responseData = await handleCompanyCategories.call(this, i);
				else if (resource === 'ips') responseData = await handleIps.call(this, i);
				else if (resource === 'ticketContent') responseData = await handleTicketContent.call(this, i);
				else if (resource === 'ticketList') responseData = await handleTicketList.call(this, i);
				else if (resource === 'ticketStates') responseData = await handleTicketStates.call(this, i);
				else if (resource === 'timestamps') responseData = await handleTimestamps.call(this, i);
				else if (resource === 'callbacks') responseData = await handleCallback.call(this, i);
				else if (resource === 'chats') responseData = await handleChats.call(this, i);
				else if (resource === 'search') responseData = await handleSearch.call(this, i);
				else if (resource === 'softwareLicenses') responseData = await handleSoftwareLicenses.call(this, i);
				else if (resource === 'calls') responseData = await handleCalls.call(this, i);
				else if (resource === 'callsuser') responseData = await handleCallsUser.call(this, i);
				else if (resource === 'employees') responseData = await handleEmployees.call(this, i);
				else if (resource === 'mails') responseData = await handleMails.call(this, i);
				else if (resource === 'remoteSupports') responseData = await handleRemoteSupports.call(this, i);
				else if (resource === 'availability') responseData = await handleAvailability.call(this, i);
				else if (resource === 'hddTypes') responseData = await handleHddTypes.call(this, i);
				else if (resource === 'manufacturers') responseData = await handleManufacturers.call(this, i);
				else if (resource === 'operatingSystems') responseData = await handleOperatingSystems.call(this, i);
				else
					throw new NodeOperationError(this.getNode(), `Unknown resource: ${resource}`, {
						itemIndex: i,
					});

				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(Array.isArray(responseData) ? responseData : [responseData]),
					{
						itemData: {
							item: i,
						},
					},
				);

				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					const message = error instanceof Error ? error.message : String(error);
					returnData.push({ json: { error: message }, pairedItem: { item: i } });
					continue;
				}

				throw error;
			}
		}

		return [returnData];
	}
}
