import * as vscode from 'vscode';
import { TicketService } from '../services/TicketService';
import { CreateTicketParams, Complexity, Service } from '../types';

export async function createTicketFromClipboardCommand(ticketService: TicketService) {
    // 1. Read clipboard
    const clipboardText = await vscode.env.clipboard.readText();
    if (!clipboardText || clipboardText.trim().length === 0) {
        vscode.window.showErrorMessage('Clipboard is empty');
        return;
    }

    // 2. Parse Input
    const params = parseClipboardContent(clipboardText);

    // 3. Confirm
    const confirm = await vscode.window.showQuickPick(['Create', 'Edit Title First', 'Cancel'], {
        placeHolder: `Create ticket "${params.title}"?`
    });

    if (confirm === 'Cancel' || !confirm) {return;}

    if (confirm === 'Edit Title First') {
        const newTitle = await vscode.window.showInputBox({ value: params.title, prompt: 'Edit Ticket Title' });
        if (!newTitle) {return;}
        params.title = newTitle;
    }

    // 4. Create
    try {
        const ticket = await ticketService.createTicket(params);
        vscode.window.showInformationMessage(`Ticket ${ticket.id} created!`);
        
        // Refresh view
        vscode.commands.executeCommand('cursor-agent-pm.helloWorld'); // Triggers refresh side-effect currently
    } catch (error) {
        vscode.window.showErrorMessage(`Failed to create ticket: ${error}`);
    }
}

function parseClipboardContent(text: string): CreateTicketParams {
    const lines = text.split('\n');
    const params: CreateTicketParams = {
        title: '',
        complexity: 'simple',
        services: [],
        description: text,
        owner: undefined,
        estimate: undefined
    };

    // Check for structured format
    // Title: ...
    // Request: ...
    
    const titleMatch = text.match(/^Title:\s*(.+)$/m);
    if (titleMatch) {
        params.title = titleMatch[1].trim();
    } else {
        // Fallback: Use first line
        const firstLine = lines[0].trim();
        params.title = firstLine.substring(0, 50) + (firstLine.length > 50 ? '...' : '');
    }

    const requestMatch = text.match(/Request:([\s\S]*?)(?=(?:Complexity:|Service:|Owner:|Estimate:|$))/i);
    if (requestMatch) {
        params.description = requestMatch[1].trim();
    }

    const complexityMatch = text.match(/Complexity:\s*(simple|task_list|plan)/i);
    if (complexityMatch) {
        params.complexity = complexityMatch[1].toLowerCase() as Complexity;
    }

    const serviceMatch = text.match(/Service:\s*(.+)$/im);
    if (serviceMatch) {
        const services = serviceMatch[1].split(',').map(s => s.trim().toLowerCase());
        // Simple mapping validation could be added here
        params.services = services.filter(s => 
            ['backend', 'frontend', 'landing', 'infra', 'all', 'extension'].includes(s)
        ) as Service[];
    }

    const ownerMatch = text.match(/Owner:\s*(.+)$/im);
    if (ownerMatch) {
        params.owner = ownerMatch[1].trim();
    }

    const estimateMatch = text.match(/Estimate:\s*(.+)$/im);
    if (estimateMatch) {
        params.estimate = estimateMatch[1].trim();
    }

    return params;
}
