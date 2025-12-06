const vscode = acquireVsCodeApi();

let currentState = {
    view: 'dashboard', // 'dashboard' | 'detail' | 'kanban'
    activeTicketId: null,
    tickets: [],
    activeTab: 'Request.md',
    ticketContent: {},
    searchQuery: ''
};

window.addEventListener('message', event => {
    const message = event.data;
    switch (message.type) {
        case 'updateTickets':
            currentState.tickets = message.tickets;
            render();
            break;
        case 'ticketContent':
            if (!currentState.ticketContent[message.ticketId]) {
                currentState.ticketContent[message.ticketId] = {};
            }
            currentState.ticketContent[message.ticketId][message.file] = message.content;
            render();
            break;
    }
});

function setState(newState) {
    currentState = { ...currentState, ...newState };
    render();
}

function openTicket(ticketId) {
    setState({ view: 'detail', activeTicketId: ticketId, activeTab: 'Request.md' });
    // Fetch content
    vscode.postMessage({ type: 'getTicketContent', ticketId, file: 'Request.md' });
    vscode.postMessage({ type: 'getTicketContent', ticketId, file: 'TaskList.md' });
    vscode.postMessage({ type: 'getTicketContent', ticketId, file: 'Discussion.md' });
    vscode.postMessage({ type: 'getTicketContent', ticketId, file: 'Implementation_Plan.md' });
}

function switchTab(tab) {
    setState({ activeTab: tab });
}

function goBack() {
    setState({ view: 'dashboard', activeTicketId: null });
}

function toggleView(view) {
    setState({ view });
}

function updateStatus(ticketId, status) {
    vscode.postMessage({ type: 'updateStatus', ticketId, status });
}

function onSearch(e) {
    const query = e.target.value;
    currentState.searchQuery = query;
    vscode.postMessage({ type: 'search', query });
}

function showContextMenu(e, ticketId) {
    e.stopPropagation();
    vscode.postMessage({ type: 'showContextMenu', ticketId });
}

function render() {
    const app = document.getElementById('app');
    
    // Save focus state before render
    const searchInput = document.querySelector('.search-bar input');
    const wasSearchFocused = searchInput && document.activeElement === searchInput;
    const cursorPosition = searchInput ? searchInput.selectionStart : 0;
    
    if (currentState.view === 'detail') {
        renderDetail(app);
    } else if (currentState.view === 'kanban') {
        renderKanban(app);
    } else {
        renderDashboard(app);
    }

    // Restore focus and cursor position after render
    if (wasSearchFocused) {
        const newSearchInput = document.querySelector('.search-bar input');
        if (newSearchInput) {
            newSearchInput.focus();
            newSearchInput.setSelectionRange(cursorPosition, cursorPosition);
        }
    }
}

function renderHeaderControls() {
    return `
        <div class="view-controls-container">
            <div class="search-bar">
                <input type="text" placeholder="Search tickets..." oninput="onSearch(event)">
            </div>
            <div class="view-controls">
                <button class="${currentState.view === 'dashboard' ? 'active' : ''}" onclick="toggleView('dashboard')">Focus</button>
                <button class="${currentState.view === 'kanban' ? 'active' : ''}" onclick="toggleView('kanban')">Board</button>
            </div>
        </div>
    `;
}

function renderBadge(text, type = 'default') {
    if (!text) return '';
    return `<span class="badge ${type}">${text}</span>`;
}

function renderDashboard(container) {
    const tickets = currentState.tickets || [];
    let html = renderHeaderControls();

    if (tickets.length === 0) {
        html += '<div class="empty-state">No tickets found.<br><br>Use <code>Cmd+Shift+P</code> > Create Ticket</div>';
        container.innerHTML = html;
        return;
    }

    const activeTicket = tickets.find(t => t.metadata.status === 'in_progress') || tickets[0];
    const otherTickets = tickets.filter(t => t.id !== activeTicket.id);

    if (activeTicket) {
        html += `
            <h2>🎯 Active Focus</h2>
            <div class="ticket-card focus-mode" onclick="openTicket('${activeTicket.id}')">
                <div class="ticket-header">
                    <span class="ticket-id">${activeTicket.id}</span>
                    <div class="header-actions">
                        ${renderBadge(activeTicket.metadata.status)}
                        <button class="icon-btn" onclick="showContextMenu(event, '${activeTicket.id}')">⋮</button>
                    </div>
                </div>
                <div class="ticket-title">${activeTicket.title}</div>
                <div class="ticket-meta">
                    ${activeTicket.metadata.services.map(s => renderBadge(s, 'service')).join('')}
                    ${renderBadge(activeTicket.metadata.complexity)}
                </div>
            </div>
        `;
    }

    if (otherTickets.length > 0) {
        html += '<h2>📅 Up Next</h2>';
        html += otherTickets.map(t => `
            <div class="ticket-card" onclick="openTicket('${t.id}')">
                <div class="ticket-header">
                    <span class="ticket-id">${t.id}</span>
                    <div class="header-actions">
                        ${renderBadge(t.metadata.status)}
                        <button class="icon-btn" onclick="showContextMenu(event, '${t.id}')">⋮</button>
                    </div>
                </div>
                <div class="ticket-title">${t.title}</div>
                <div class="ticket-meta">
                    ${t.metadata.services.map(s => renderBadge(s, 'service')).join('')}
                </div>
            </div>
        `).join('');
    }

    container.innerHTML = html;
}

function renderKanban(container) {
    let html = renderHeaderControls();
    
    const columns = [
        { id: 'ready', label: 'Ready' },
        { id: 'in_progress', label: 'In Progress' },
        { id: 'pending_review', label: 'Review' },
        { id: 'done', label: 'Done' }
    ];

    html += '<div class="kanban-board">';
    
    columns.forEach(col => {
        const colTickets = currentState.tickets.filter(t => t.metadata.status === col.id);
        
        html += `
            <div class="kanban-column" ondragover="allowDrop(event)" ondrop="drop(event, '${col.id}')">
                <div class="kanban-header">
                    ${col.label} <span class="count">${colTickets.length}</span>
                </div>
                <div class="kanban-list">
                    ${colTickets.map(t => `
                        <div class="ticket-card" 
                             draggable="true" 
                             ondragstart="drag(event, '${t.id}')"
                             onclick="openTicket('${t.id}')">
                            <div class="ticket-header">
                                <span class="ticket-id">${t.id}</span>
                            </div>
                            <div class="ticket-title" style="font-size:0.9rem">${t.title}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    });

    html += '</div>';
    container.innerHTML = html;
}

// Drag and Drop handlers
window.allowDrop = function(ev) {
    ev.preventDefault();
}

window.drag = function(ev, ticketId) {
    ev.dataTransfer.setData("text", ticketId);
}

window.drop = function(ev, status) {
    ev.preventDefault();
    const ticketId = ev.dataTransfer.getData("text");
    if (ticketId) {
        updateStatus(ticketId, status);
    }
}

function renderDetail(container) {
    const ticket = currentState.tickets.find(t => t.id === currentState.activeTicketId);
    if (!ticket) return;

    const tabs = [
        { id: 'Request.md', label: 'Request' },
        { id: 'TaskList.md', label: 'Tasks' },
        { id: 'Implementation_Plan.md', label: 'Plan' },
        { id: 'Discussion.md', label: 'Discussion' }
    ];

    const content = currentState.ticketContent[ticket.id]?.[currentState.activeTab] || 'Loading...';

    // Enhanced Markdown rendering
    const renderedContent = content
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
        .replace(/\*\*(.*)\*\*/gim, '<b>$1</b>')
        .replace(/`([^`]+)`/gim, '<code>$1</code>')
        .replace(/- \[(x| )\] (.*)$/gim, (match, checked, text) => {
            const isChecked = checked === 'x' ? 'checked' : '';
            return `<div class="task-item">
                        <input type="checkbox" ${isChecked} disabled> 
                        <span style="${isChecked ? 'text-decoration: line-through; opacity: 0.7' : ''}">${text}</span>
                    </div>`;
        })
        .replace(/\n/gim, '<br>');

    container.innerHTML = `
        <div class="detail-header">
            <button class="back-btn" onclick="goBack()">←</button>
            <div>
                <div class="ticket-id">${ticket.id}</div>
                <div class="ticket-title">${ticket.title}</div>
            </div>
        </div>
        
        <div class="tabs">
            ${tabs.map(tab => `
                <div class="tab ${currentState.activeTab === tab.id ? 'active' : ''}" 
                     onclick="switchTab('${tab.id}')">
                    ${tab.label}
                </div>
            `).join('')}
        </div>

        <div class="tab-content">
            ${renderedContent}
        </div>
    `;
}

// Initial request
vscode.postMessage({ type: 'refresh' });
