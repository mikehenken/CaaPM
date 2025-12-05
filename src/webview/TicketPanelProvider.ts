import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { TicketService } from '../services/TicketService';

export class TicketPanelProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'cursor-agent-pm.dashboard';
    private _view?: vscode.WebviewView;

    constructor(
        private readonly _extensionUri: vscode.Uri,
        private readonly _ticketService: TicketService
    ) {}

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _context: vscode.WebviewViewResolveContext,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _token: vscode.CancellationToken,
    ) {
        this._view = webviewView;

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [
                this._extensionUri
            ]
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

        webviewView.webview.onDidReceiveMessage(async (data) => {
            switch (data.type) {
                case 'refresh': {
                    await this.refresh();
                    break;
                }
                case 'openTicket': {
                    // Update view to detail mode (handled in frontend, but we might need to fetch data)
                    break; 
                }
                case 'getTicketContent': {
                    const content = await this._ticketService.getTicketContent(data.ticketId, data.file);
                    this._view?.webview.postMessage({ 
                        type: 'ticketContent', 
                        ticketId: data.ticketId, 
                        file: data.file, 
                        content 
                    });
                    break;
                }
                case 'updateStatus': {
                    await this._ticketService.updateTicketStatus(data.ticketId, data.status);
                    await this.refresh();
                    break;
                }
                case 'search': {
                    const tickets = await this._ticketService.searchTickets(data.query);
                    this._view?.webview.postMessage({ type: 'updateTickets', tickets });
                    break;
                }
                case 'showContextMenu': {
                    const ticketId = data.ticketId;
                    const items = ['Open in Editor', 'Load to Chat', 'Archive'];
                    const action = await vscode.window.showQuickPick(items, {
                        placeHolder: `Actions for ${ticketId}`
                    });

                    if (action === 'Open in Editor') {
                        const tickets = await this._ticketService.getTickets();
                        const ticket = tickets.find(t => t.id === ticketId);
                        if (ticket) {
                            const doc = await vscode.workspace.openTextDocument(path.join(ticket.path, 'Request.md'));
                            await vscode.window.showTextDocument(doc);
                        }
                    } else if (action === 'Load to Chat') {
                        const content = await this._ticketService.getTicketContent(ticketId, 'Request.md');
                        if (content) {
                            // Insert into active editor
                            const editor = vscode.window.activeTextEditor;
                            if (editor) {
                                editor.edit(editBuilder => {
                                    editBuilder.insert(editor.selection.active, `\n\nContext from ${ticketId}:\n\n${content}\n`);
                                });
                                vscode.window.showInformationMessage(`Loaded ${ticketId} context into editor`);
                            } else {
                                // Fallback: Copy to clipboard if no editor open
                                await vscode.env.clipboard.writeText(`Context from ${ticketId}:\n\n${content}`);
                                vscode.window.showInformationMessage(`Copied ${ticketId} context to clipboard (No active editor)`);
                            }
                        }
                    } else if (action === 'Archive') {
                        const confirm = await vscode.window.showWarningMessage(
                            `Are you sure you want to archive ${ticketId}?`,
                            'Yes', 'No'
                        );
                        
                        if (confirm === 'Yes') {
                            await this._ticketService.archiveTicket(ticketId);
                            await this.refresh();
                            vscode.window.showInformationMessage(`Archived ${ticketId}`);
                        }
                    }
                    break;
                }
            }
        });

        // Initial load
        this.refresh();
    }

    public async refresh() {
        if (!this._view) {
            return;
        }
        const tickets = await this._ticketService.getTickets();
        this._view.webview.postMessage({ type: 'updateTickets', tickets });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private _getHtmlForWebview(_webview: vscode.Webview) {
        // _webview can be used for CSP if needed in future
        const stylePath = vscode.Uri.joinPath(this._extensionUri, 'src', 'webview', 'style.css');
        const scriptPath = vscode.Uri.joinPath(this._extensionUri, 'src', 'webview', 'main.js');

        const styleContent = fs.readFileSync(stylePath.fsPath, 'utf8');
        const scriptContent = fs.readFileSync(scriptPath.fsPath, 'utf8');

        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Ticket Dashboard</title>
            <style>
                ${styleContent}
            </style>
        </head>
        <body>
            <div id="app"></div>
            <script>
                ${scriptContent}
            </script>
        </body>
        </html>`;
    }
}

