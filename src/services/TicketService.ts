import * as fs from 'fs';
import * as path from 'path';
import { Ticket, TicketMetadata, CreateTicketParams } from '../types';

export class TicketService {
    private ticketsDir: string | undefined;

    constructor(workspaceRoot: string) {
        this.ticketsDir = path.join(workspaceRoot, '.tickets');
    }

    public async init(): Promise<void> {
        if (!fs.existsSync(this.ticketsDir!)) {
            await fs.promises.mkdir(this.ticketsDir!, { recursive: true });
        }
    }

    public async getTickets(): Promise<Ticket[]> {
        if (!this.ticketsDir || !fs.existsSync(this.ticketsDir)) {
            return [];
        }

        const entries = await fs.promises.readdir(this.ticketsDir, { withFileTypes: true });
        const tickets: Ticket[] = [];

        for (const entry of entries) {
            if (entry.isDirectory() && entry.name.startsWith('TICKET-')) {
                const ticketPath = path.join(this.ticketsDir, entry.name);
                const metadata = await this.parseTicketMetadata(ticketPath);
                if (metadata) {
                    tickets.push({
                        id: metadata.id,
                        title: metadata.title,
                        path: ticketPath,
                        metadata
                    });
                }
            }
        }

        return tickets.sort((a, b) => b.metadata.updated.localeCompare(a.metadata.updated));
    }

    public async updateTicketStatus(ticketId: string, status: string): Promise<void> {
        const tickets = await this.getTickets();
        const ticket = tickets.find(t => t.id === ticketId);
        if (!ticket) {return;}

        const requestPath = path.join(ticket.path, 'Request.md');
        if (!fs.existsSync(requestPath)) {return;}

        let content = await fs.promises.readFile(requestPath, 'utf8');
        // Update Metadata
        content = content.replace(/- \*\*Status\*\*: .*$/m, `- **Status**: ${status}`);
        
        await fs.promises.writeFile(requestPath, content);
    }

    public async archiveTicket(ticketId: string): Promise<void> {
        // Implement "soft archive" by moving to a .archive folder or just renaming status
        // For MVP, let's move to .tickets/_archive/{ticketId}
        if (!this.ticketsDir) {return;}

        const tickets = await this.getTickets();
        const ticket = tickets.find(t => t.id === ticketId);
        if (!ticket) {return;}

        const archiveDir = path.join(this.ticketsDir, '_archive');
        if (!fs.existsSync(archiveDir)) {
            await fs.promises.mkdir(archiveDir, { recursive: true });
        }

        const newPath = path.join(archiveDir, path.basename(ticket.path));
        
        // Rename (move) the folder
        await fs.promises.rename(ticket.path, newPath);
    }

    public async getTicketContent(ticketId: string, file: 'Request.md' | 'TaskList.md' | 'Discussion.md'): Promise<string | null> {
        const tickets = await this.getTickets();
        const ticket = tickets.find(t => t.id === ticketId);
        if (!ticket) {return null;}

        const filePath = path.join(ticket.path, file);
        if (!fs.existsSync(filePath)) {return null;}

        return fs.promises.readFile(filePath, 'utf8');
    }

    public async searchTickets(query: string): Promise<Ticket[]> {
        const tickets = await this.getTickets();
        const lowerQuery = query.toLowerCase();
        
        return tickets.filter(t => {
            const matchesId = t.id.toLowerCase().includes(lowerQuery);
            const matchesTitle = t.title.toLowerCase().includes(lowerQuery);
            const matchesStatus = t.metadata.status.toLowerCase().includes(lowerQuery);
            const matchesOwner = t.metadata.owner?.toLowerCase().includes(lowerQuery);
            const matchesService = t.metadata.services.some(s => s.toLowerCase().includes(lowerQuery));

            return matchesId || matchesTitle || matchesStatus || matchesOwner || matchesService;
        });
    }

    public async createTicket(params: CreateTicketParams): Promise<Ticket> {
        if (!this.ticketsDir) {
            throw new Error('Tickets directory not initialized');
        }

        const ticketId = await this.generateNextTicketId();
        const slug = params.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        const folderName = `${ticketId}-${slug}`;
        const ticketPath = path.join(this.ticketsDir, folderName);

        await fs.promises.mkdir(ticketPath, { recursive: true });
        await fs.promises.mkdir(path.join(ticketPath, 'assets'));

        const date = new Date().toISOString().split('T')[0];
        
        // Create Request.md
        const requestContent = `# [${ticketId}] ${params.title}

## Metadata
- **Status**: ready
- **Complexity**: ${params.complexity}
- **Service(s)**: ${params.services.join(', ')}
- **Created**: ${date}
- **Updated**: ${date}
- **Estimate**: ${params.estimate || ''}

## Ownership
- **Owner**:
  - Person: ${params.owner || ''}

## Request

${params.description}

## Context

## Acceptance Criteria

- [ ] 
`;
        await fs.promises.writeFile(path.join(ticketPath, 'Request.md'), requestContent);

        // Create TaskList.md
        const taskListContent = params.tasks || `# Task List - [${ticketId}]

## Progress

| Status | Count |
|--------|-------|
| ✅ Completed | 0 |
| 🔄 In Progress | 0 |
| ⏳ Pending | 0 |
| ❌ Cancelled | 0 |

---

## Tasks

### Phase 1: Implementation

- [ ] **Task 1.1**: Initial Setup
  - Status: pending
`;
        await fs.promises.writeFile(path.join(ticketPath, 'TaskList.md'), taskListContent);

        // Create Implementation_Plan.md
        const planContent = params.plan || `# Implementation Plan - [${ticketId}]

## Overview

## Technical Approach

`;
        await fs.promises.writeFile(path.join(ticketPath, 'Implementation_Plan.md'), planContent);

        // Create Discussion.md
        const discussionContent = params.discussion || `# Discussion - [${ticketId}]

## Decisions

`;
        await fs.promises.writeFile(path.join(ticketPath, 'Discussion.md'), discussionContent);

        return {
            id: ticketId,
            title: params.title,
            path: ticketPath,
            metadata: {
                id: ticketId,
                title: params.title,
                status: 'ready',
                complexity: params.complexity,
                services: params.services,
                created: date,
                updated: date,
                estimate: params.estimate,
                owner: params.owner
            }
        };
    }

    private async generateNextTicketId(): Promise<string> {
        const tickets = await this.getTickets();
        if (tickets.length === 0) {
            return 'TICKET-001';
        }

        const maxId = tickets.reduce((max, ticket) => {
            const match = ticket.id.match(/TICKET-(\d+)/);
            if (match) {
                const num = parseInt(match[1], 10);
                return num > max ? num : max;
            }
            return max;
        }, 0);

        return `TICKET-${String(maxId + 1).padStart(3, '0')}`;
    }

    private async parseTicketMetadata(ticketPath: string): Promise<TicketMetadata | null> {
        try {
            const requestPath = path.join(ticketPath, 'Request.md');
            if (!fs.existsSync(requestPath)) {
                return null;
            }

            const content = await fs.promises.readFile(requestPath, 'utf8');
            
            // Extract ID and Title from first line: # [TICKET-XXX] Title
            const titleMatch = content.match(/^# \[(TICKET-\d+)\] (.*)$/m);
            if (!titleMatch) {return null;}
            
            const id = titleMatch[1];
            const title = titleMatch[2].trim();

            // Extract metadata fields
            const statusMatch = content.match(/- \*\*Status\*\*: (.*)$/m);
            const complexityMatch = content.match(/- \*\*Complexity\*\*: (.*)$/m);
            const servicesMatch = content.match(/- \*\*Service\(s\)\*\*: (.*)$/m);
            const createdMatch = content.match(/- \*\*Created\*\*: (.*)$/m);
            const updatedMatch = content.match(/- \*\*Updated\*\*: (.*)$/m);
            const estimateMatch = content.match(/- \*\*Estimate\*\*: (.*)$/m);
            const ownerMatch = content.match(/Person: (.*)$/m); // Simplified regex for MVP

            return {
                id,
                title,
                status: (statusMatch ? statusMatch[1].trim() : 'draft') as any,
                complexity: (complexityMatch ? complexityMatch[1].trim() : 'simple') as any,
                services: (servicesMatch ? servicesMatch[1].split(',').map(s => s.trim()) : []) as any,
                created: createdMatch ? createdMatch[1].trim() : '',
                updated: updatedMatch ? updatedMatch[1].trim() : '',
                estimate: estimateMatch ? estimateMatch[1].trim() : undefined,
                owner: ownerMatch ? ownerMatch[1].trim() : undefined
            };
        } catch (error) {
            console.error(`Error parsing ticket metadata for ${ticketPath}:`, error);
            return null;
        }
    }
}

