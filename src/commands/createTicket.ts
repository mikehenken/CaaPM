import * as vscode from 'vscode';
import { TicketService } from '../services/TicketService';
import { CreateTicketParams, Complexity, Service } from '../types';

export async function createTicketCommand(ticketService: TicketService) {
    // 1. One-shot input
    const input = await vscode.window.showInputBox({
        placeHolder: 'Ticket title (e.g. "Fix login bug @backend")',
        prompt: 'Enter ticket title. You can add @owner or #complexity or +service'
    });

    if (!input) {return;}

    // 2. Parse input
    const params = parseInput(input);

    // 3. Wizard fallback for missing fields
    if (!params.complexity) {
        const complexity = await vscode.window.showQuickPick(
            ['simple', 'task_list', 'plan'],
            { placeHolder: 'Select complexity' }
        );
        if (complexity) {params.complexity = complexity as Complexity;}
    }

    if (params.services.length === 0) {
        const service = await vscode.window.showQuickPick(
            ['backend', 'frontend', 'landing', 'infra', 'all', 'extension'],
            { placeHolder: 'Select primary service' }
        );
        if (service) {params.services.push(service as Service);}
    }

    // 4. Create
    try {
        const ticket = await ticketService.createTicket(params);
        
        const action = await vscode.window.showInformationMessage(
            `Ticket ${ticket.id} created!`,
            'Open'
        );

        if (action === 'Open') {
            // Trigger open ticket command or logic
            vscode.commands.executeCommand('cursor-agent-pm.openTicket', ticket.id);
        }
    } catch (error) {
        vscode.window.showErrorMessage(`Failed to create ticket: ${error}`);
    }
}

function parseInput(input: string): CreateTicketParams {
    const params: CreateTicketParams = {
        title: input,
        complexity: 'simple', // Default
        services: [],
        description: input, // Default description is title
        owner: undefined
    };

    // Extract tags
    const ownerMatch = input.match(/@(\w+)/);
    if (ownerMatch) {
        params.owner = `github:${ownerMatch[1]}`;
        params.title = params.title.replace(ownerMatch[0], '').trim();
    }

    const complexityMatch = input.match(/#(simple|task_list|plan)/);
    if (complexityMatch) {
        params.complexity = complexityMatch[1] as Complexity;
        params.title = params.title.replace(complexityMatch[0], '').trim();
    }

    // Heuristic for service (e.g. +backend)
    const serviceMatch = input.match(/\+(backend|frontend|landing|infra|all|extension)/);
    if (serviceMatch) {
        params.services.push(serviceMatch[1] as Service);
        params.title = params.title.replace(serviceMatch[0], '').trim();
    }

    return params;
}

