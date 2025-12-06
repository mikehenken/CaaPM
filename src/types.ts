export type TicketStatus = 'draft' | 'pending_review' | 'ready' | 'in_progress' | 'pending_completion_review' | 'done';
export type Complexity = 'simple' | 'task_list' | 'plan';
export type Service = 'backend' | 'frontend' | 'landing' | 'infra' | 'all' | 'extension';

export interface TicketMetadata {
    id: string;
    title: string;
    status: TicketStatus;
    complexity: Complexity;
    services: Service[];
    created: string;
    updated: string;
    estimate?: string;
    owner?: string;
}

export interface Ticket {
    id: string;
    title: string;
    path: string; // Absolute path to the ticket directory
    metadata: TicketMetadata;
}

export interface CreateTicketParams {
    title: string;
    complexity: Complexity;
    services: Service[];
    estimate?: string;
    owner?: string;
    description: string;
    plan?: string;
    tasks?: string;
    discussion?: string;
}

