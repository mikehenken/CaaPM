import * as vscode from 'vscode';
import { TicketService } from './services/TicketService';
import { TicketPanelProvider } from './webview/TicketPanelProvider';
import { createTicketCommand } from './commands/createTicket';
import { createTicketWizardCommand } from './commands/createTicketWizard';
import { createTicketFromClipboardCommand } from './commands/createTicketFromClipboard';
import { copyTicketContextCommand } from './commands/copyTicketContext';
import { loadTicketContextCommand } from './commands/loadTicketContext';
import { TicketStatusBar } from './statusbar/TicketStatusBar';

export async function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "cursor-agent-pm" is now active!');

	const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
	if (!workspaceRoot) {
		console.warn('No workspace root found. TicketService will not function.');
		return;
	}

	const ticketService = new TicketService(workspaceRoot);
	await ticketService.init();

	const provider = new TicketPanelProvider(context.extensionUri, ticketService);

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(TicketPanelProvider.viewType, provider)
	);

    // Status Bar
    const statusBar = new TicketStatusBar(ticketService);
    context.subscriptions.push(statusBar);

    // Refresh status bar on window focus or command
    context.subscriptions.push(
        vscode.window.onDidChangeWindowState(() => statusBar.update())
    );

	context.subscriptions.push(
		vscode.commands.registerCommand('cursor-agent-pm.createTicket', async () => {
            await createTicketCommand(ticketService);
            provider.refresh();
            statusBar.update();
        })
	);

    context.subscriptions.push(
		vscode.commands.registerCommand('cursor-agent-pm.createTicketWizard', async () => {
            await createTicketWizardCommand(ticketService);
            provider.refresh();
            statusBar.update();
        })
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('cursor-agent-pm.createTicketFromClipboard', async () => {
            await createTicketFromClipboardCommand(ticketService);
            provider.refresh();
            statusBar.update();
        })
	);

    // Placeholder for new export command
    context.subscriptions.push(
		vscode.commands.registerCommand('cursor-agent-pm.exportFromClipboard', async () => {
            // Re-use createTicketFromClipboard for now, but will enhance later
            await createTicketFromClipboardCommand(ticketService);
            provider.refresh();
            statusBar.update();
        })
	);

    // Placeholder for status command
    context.subscriptions.push(
		vscode.commands.registerCommand('cursor-agent-pm.ticketStatus', async () => {
            const tickets = await ticketService.getTickets();
            const active = tickets.filter(t => t.metadata.status === 'in_progress');
            const items = active.map(t => ({
                label: `$(play) ${t.id}: ${t.title}`,
                description: t.metadata.status,
                ticketId: t.id
            }));
            
            if (items.length === 0) {
                vscode.window.showInformationMessage('No active tickets.');
                return;
            }

            const selected = await vscode.window.showQuickPick(items, { placeHolder: 'Active Tickets' });
            if (selected) {
                vscode.commands.executeCommand('cursor-agent-pm.openTicket', selected.ticketId);
            }
        })
	);
	
	context.subscriptions.push(
		vscode.commands.registerCommand('cursor-agent-pm.copyTicketContext', (ticketId?: string) => copyTicketContextCommand(ticketService, ticketId))
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('cursor-agent-pm.loadTicket', (ticketId?: string) => loadTicketContextCommand(ticketService, ticketId))
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('cursor-agent-pm.openTicket', async (ticketId: string) => {
			const tickets = await ticketService.getTickets();
            const ticket = tickets.find(t => t.id === ticketId);
			if (ticket) {
				await provider.refresh();
				const doc = await vscode.workspace.openTextDocument(vscode.Uri.file(ticket.path + '/Request.md'));
				await vscode.window.showTextDocument(doc);
			}
		})
	);

	const disposable = vscode.commands.registerCommand('cursor-agent-pm.helloWorld', async () => {
		const tickets = await ticketService.getTickets();
		vscode.window.showInformationMessage(`Found ${tickets.length} tickets in ${workspaceRoot}`);
		provider.refresh();
        statusBar.update();
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
