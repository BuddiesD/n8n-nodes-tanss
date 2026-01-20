import {
	INodeType,
	INodeTypeDescription,
	IExecuteFunctions,
	NodeOperationError,
} from 'n8n-workflow';
import { handleAuth, authOperations, authFields } from './sub/Authentication';
import { handlePc, pcOperations, pcFields } from './sub/PCs';
import { handleTicket, ticketOperations, ticketFields } from './sub/Tickets';
import { handleTicketList, ticketListOperations, ticketListFields } from './sub/TicketLists';
import {
	handleTicketContent,
	ticketContentOperations,
	ticketContentFields,
} from './sub/TicketContent';
import { handleTicketStates, ticketStatesOperations, ticketStatesFields } from './sub/TicketSates';
import { handleTimestamps, timestampOperations, timestampFields } from './sub/timestamp';
import { handleAvailability, availabilityOperations, availabilityFields } from './sub/Availability';
import { handleEmployees, employeesOperations, employeesFields } from './sub/Employees';
import { handleMails, mailsOperations, mailsFields } from './sub/Mails';
import { handleCalls, callsOperations, callsFields } from './sub/calls';
import { handleCallsUser, callsUserOperations, callsUserFields } from './sub/callsuser';
import {
	handleRemoteSupports,
	remoteSupportsOperations,
	remoteSupportsFields,
} from './sub/RemoteSupports';
import { handleCpu, cpuOperations, cpuFields } from './sub/CPUs';
import { handleHddTypes, hddTypesOperations, hddTypesFields } from './sub/hddTypes';
import {
	handleManufacturers,
	manufacturersOperations,
	manufacturersFields,
} from './sub/manufacturers';
import {
	handleOperatingSystems,
	operatingSystemsOperations,
	operatingSystemsFields,
} from './sub/OperatingSystems';

export class Tanss implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'TANSS',
		name: 'tanss',
		icon: 'file:../../icons/tanss.svg',
		group: ['transform'],
		version: 1,
		description: 'Interact with the TANSS API',
		subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
		defaults: {
			name: 'TANSS',
		},
		inputs: ['main'],
		outputs: ['main'],

		credentials: [
			{
				name: 'tanssApi',
				required: true,
			},
		],

		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Authentication', value: 'authentication' },
					{ name: 'Availability', value: 'availability' },
					{ name: 'Call', value: 'calls' },
					{ name: 'Call User', value: 'callsuser' },
					{ name: 'CPU', value: 'cpus' },
					{ name: 'Employee', value: 'employees' },
					{ name: 'HDD Type', value: 'hddTypes' },
					{ name: 'Mail', value: 'mails' },
					{ name: 'Manufacturer', value: 'manufacturers' },
					{ name: 'Operating System', value: 'operatingSystems' },
					{ name: 'PC', value: 'pc' },
					{ name: 'Remote Support', value: 'remoteSupports' },
					{ name: 'Ticket', value: 'ticket' },
					{ name: 'Ticket Content', value: 'ticketContent' },
					{ name: 'Ticket List', value: 'ticketList' },
					{ name: 'Ticket State', value: 'ticketStates' },
					{ name: 'Timestamp', value: 'timestamps' },
				],
				default: 'authentication',
				description: 'Select which TANSS API resource to interact with',
			},

			...authOperations,
			...authFields,
			...pcOperations,
			...pcFields,
			...ticketOperations,
			...ticketFields,
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
			...manufacturersOperations,
			...manufacturersFields,
			...operatingSystemsOperations,
			...operatingSystemsFields,
			...remoteSupportsOperations,
			...remoteSupportsFields,
		],
	};

	async execute(this: IExecuteFunctions) {
		const items = this.getInputData();
		const returnData = [];
		const resource = this.getNodeParameter('resource', 0) as string;

		for (let i = 0; i < items.length; i++) {
			let responseData;
			if (resource === 'authentication') responseData = await handleAuth.call(this, i);
			else if (resource === 'pc') responseData = await handlePc.call(this, i);
			else if (resource === 'cpus') responseData = await handleCpu.call(this, i);
			else if (resource === 'ticket') responseData = await handleTicket.call(this, i);
			else if (resource === 'ticketContent') responseData = await handleTicketContent.call(this, i);
			else if (resource === 'ticketList') responseData = await handleTicketList.call(this, i);
			else if (resource === 'ticketStates') responseData = await handleTicketStates.call(this, i);
			else if (resource === 'timestamps') responseData = await handleTimestamps.call(this, i);
			else if (resource === 'calls') responseData = await handleCalls.call(this, i);
			else if (resource === 'callsuser') responseData = await handleCallsUser.call(this, i);
			else if (resource === 'employees') responseData = await handleEmployees.call(this, i);
			else if (resource === 'mails') responseData = await handleMails.call(this, i);
			else if (resource === 'remoteSupports')
				responseData = await handleRemoteSupports.call(this, i);
			else if (resource === 'availability') responseData = await handleAvailability.call(this, i);
			else if (resource === 'hddTypes') responseData = await handleHddTypes.call(this, i);
			else if (resource === 'manufacturers') responseData = await handleManufacturers.call(this, i);
			else if (resource === 'operatingSystems')
				responseData = await handleOperatingSystems.call(this, i);
			else
				throw new NodeOperationError(this.getNode(), `Unknown resource: ${resource}`, {
					itemIndex: i,
				});

			if (Array.isArray(responseData)) returnData.push(...responseData);
			else returnData.push(responseData);
		}

		return [this.helpers.returnJsonArray(returnData)];
	}
}
