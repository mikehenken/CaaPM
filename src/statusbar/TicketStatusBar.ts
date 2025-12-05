import * as vscode from 'vscode';
import { TicketService } from '../services/TicketService';

export class TicketStatusBar {
    private statusBarItem: vscode.StatusBarItem;

    constructor(private ticketService: TicketService) {
        this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
        this.statusBarItem.command = 'workbench.view.extension.cursor-agent-pm-sidebar';
        this.update();
    }

    public async update() {
        const tickets = await this.ticketService.getTickets();
        const activeTicket = tickets.find(t => t.metadata.status === 'in_progress');

        if (activeTicket) {
            this.statusBarItem.text = `$(checklist) ${activeTicket.id}: ${activeTicket.title}`;
            this.statusBarItem.tooltip = 'Active Ticket (Click to open panel)';
            this.statusBarItem.show();
        } else {
            this.statusBarItem.hide();
        }
    }

    public dispose() {
        this.statusBarItem.dispose();
    }
}

