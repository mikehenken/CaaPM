import * as vscode from 'vscode';
import { TicketService } from '../services/TicketService';

export async function copyTicketContextCommand(ticketService: TicketService, ticketId?: string) {
    if (!ticketId) {
        // If not provided, ask user to pick
        const tickets = await ticketService.getTickets();
        const picked = await vscode.window.showQuickPick(
            tickets.map(t => ({ label: t.id, description: t.title, detail: t.metadata.status })),
            { placeHolder: 'Select ticket to copy context from' }
        );
        if (!picked) {return;}
        ticketId = picked.label;
    }

    // Get content
    const request = await ticketService.getTicketContent(ticketId, 'Request.md');
    const tasks = await ticketService.getTicketContent(ticketId, 'TaskList.md');

    if (!request) {
        vscode.window.showErrorMessage(`Could not read ticket ${ticketId}`);
        return;
    }

    const context = `
Current Ticket Context: ${ticketId}

${request}

${tasks || ''}
`;

    await vscode.env.clipboard.writeText(context);
    vscode.window.showInformationMessage(`Context for ${ticketId} copied to clipboard!`);
}

