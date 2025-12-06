import * as vscode from 'vscode';
import { TicketService } from '../services/TicketService';
import { CreateTicketParams, Complexity, Service } from '../types';

export async function createTicketWizardCommand(ticketService: TicketService) {
    const params: Partial<CreateTicketParams> = {
        complexity: 'simple',
        services: []
    };

    // 1. Title
    const title = await vscode.window.showInputBox({
        prompt: '1/5 Ticket Title',
        placeHolder: 'e.g., Implement OAuth2 Login',
        ignoreFocusOut: true,
        validateInput: (value) => value ? null : 'Title is required'
    });
    if (!title) { return; }
    params.title = title;

    // 2. Description (Brief)
    const description = await vscode.window.showInputBox({
        prompt: '2/5 Description (Request)',
        placeHolder: 'Briefly describe the task...',
        ignoreFocusOut: true
    });
    if (!description) { return; }
    params.description = description;

    // 3. Complexity
    const complexity = await vscode.window.showQuickPick(['simple', 'task_list', 'plan'], {
        placeHolder: '3/5 Complexity Level',
        ignoreFocusOut: true
    });
    if (!complexity) { return; }
    params.complexity = complexity as Complexity;

    // 4. Services (Multi-select)
    const serviceOptions = ['backend', 'frontend', 'landing', 'infra', 'extension', 'all'];
    const selectedServices = await vscode.window.showQuickPick(serviceOptions, {
        placeHolder: '4/5 Select Services (can select multiple)',
        canPickMany: true,
        ignoreFocusOut: true
    });
    // If nothing selected, default to 'all' or empty? Let's default to empty array if user cancels, but here they can pick none.
    params.services = (selectedServices || []) as Service[];

    // 5. Owner
    const gitConfigName = vscode.workspace.getConfiguration('git').get<string>('user.name');
    const owner = await vscode.window.showInputBox({
        prompt: '5/5 Owner (GitHub username or Agent)',
        value: gitConfigName || '',
        placeHolder: 'e.g., mikehenken',
        ignoreFocusOut: true
    });
    params.owner = owner; // Optional

    // Confirm
    const summary = `${params.title} (${params.complexity}) - [${params.services?.join(', ')}]`;
    const confirm = await vscode.window.showQuickPick(['Create Ticket', 'Cancel'], {
        placeHolder: `Create: ${summary}?`
    });

    if (confirm === 'Create Ticket') {
        try {
            const ticket = await ticketService.createTicket(params as CreateTicketParams);
            
            const action = await vscode.window.showInformationMessage(
                `Ticket ${ticket.id} Created!`,
                'Open', 'Copy Context'
            );

            if (action === 'Open') {
                vscode.commands.executeCommand('cursor-agent-pm.openTicket', ticket.id);
            } else if (action === 'Copy Context') {
                vscode.commands.executeCommand('cursor-agent-pm.copyTicketContext', ticket.id);
            }

            // Refresh views
            vscode.commands.executeCommand('cursor-agent-pm.helloWorld'); 
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to create ticket: ${error}`);
        }
    }
}



