import * as vscode from 'vscode';
import { TicketService } from '../services/TicketService';

export async function loadTicketContextCommand(ticketService: TicketService, ticketId?: string) {
    if (!ticketId) {
        // If not provided, ask user to pick
        const tickets = await ticketService.getTickets();
        const activeTickets = tickets.filter(t => t.metadata.status === 'in_progress');
        const otherTickets = tickets.filter(t => t.metadata.status !== 'in_progress');
        
        const items = [
            ...activeTickets.map(t => ({ label: `$(play) ${t.id}`, description: t.title, detail: 'In Progress' })),
            ...otherTickets.map(t => ({ label: t.id, description: t.title, detail: t.metadata.status }))
        ];

        const picked = await vscode.window.showQuickPick(items, { placeHolder: 'Select ticket to load context from' });
        if (!picked) {return;}
        
        // Extract ID from label (remove icon if present)
        ticketId = picked.label.replace('$(play) ', '');
    }

    // Get content
    const request = await ticketService.getTicketContent(ticketId, 'Request.md');
    const tasks = await ticketService.getTicketContent(ticketId, 'TaskList.md');
    const plan = await ticketService.getTicketContent(ticketId, 'Implementation_Plan.md');

    if (!request) {
        vscode.window.showErrorMessage(`Could not read ticket ${ticketId}`);
        return;
    }

    const context = `
@${ticketId} Context
-------------------
${request}

${plan || ''}

${tasks || ''}
-------------------
`;

    const editor = vscode.window.activeTextEditor;
    if (editor) {
        editor.edit(editBuilder => {
            editBuilder.insert(editor.selection.active, context);
        });
        vscode.window.showInformationMessage(`Loaded ${ticketId} context into editor`);
    } else {
        await vscode.env.clipboard.writeText(context);
        vscode.window.showInformationMessage(`Copied ${ticketId} context to clipboard (No active editor)`);
    }
}

