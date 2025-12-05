# Task List - [TICKET-001]

## Progress

| Status | Count |
|--------|-------|
| ✅ Completed | 20 |
| 🔄 In Progress | 0 |
| ⏳ Pending | 0 |
| ❌ Cancelled | 0 |

---

## Tasks

### Phase 1: Extension Scaffolding & Core Setup

- [ ] **Task 1.1**: Initialize VS Code extension with TypeScript
  - Status: pending
  - Notes: Use Yeoman generator or manual setup with proper tsconfig

- [ ] **Task 1.2**: Set up project structure (src/, webview/, assets/)
  - Status: pending
  - Notes: Follow VS Code extension best practices

- [ ] **Task 1.3**: Configure build tooling (esbuild/webpack, watch mode)
  - Status: pending
  - Notes: Enable hot reload for development

- [ ] **Task 1.4**: Create Ticket Service (CRUD, file system operations)
  - Status: pending
  - Notes: Handle `.tickets/` directory, markdown parsing

### Phase 2: Sidebar Panel UI

- [ ] **Task 2.1**: Create webview panel infrastructure
  - Status: pending
  - Notes: Message passing between extension and webview

- [ ] **Task 2.2**: Build ticket dashboard view (Focus Mode + Backlog)
  - Status: pending
  - Notes: Default to "Active Ticket" large card, "Up Next" list below. Toggle for full Kanban.

- [ ] **Task 2.3**: Implement ticket detail view with tabs
  - Status: pending
  - Notes: Request | Tasks | Discussion | Assets | Timeline. Prioritize readability.

- [ ] **Task 2.4**: Build kanban board view with drag-and-drop
  - Status: pending
  - Notes: Columns: Draft → Ready → In Progress → Review → Done

- [ ] **Task 2.5**: Add right-click context menu actions
  - Status: pending
  - Notes: Open, load to chat, start work, request review, archive

### Phase 3: Chat Integration & Commands

- [ ] **Task 3.1**: Register extension commands in package.json
  - Status: pending
  - Notes: /ticket, /ticket status, /handoff, /review, /estimate, /export

- [ ] **Task 3.2**: Implement smart ticket creation (Parser + Wizard)
  - Status: pending
  - Notes: Support one-shot `/ticket "Title" @owner` -> Fallback to wizard if missing info.

- [ ] **Task 3.3**: Build export chat functionality
  - Status: pending
  - Notes: /export request, tasks, plan, discussion, all

- [ ] **Task 3.4**: Implement context injection for chat
  - Status: pending
  - Notes: Auto-attach ticket context when ID mentioned

- [ ] **Task 3.5**: Build auto-export on session end (opt-in setting)
  - Status: pending
  - Notes: Setting `ticketManager.autoExport.enabled` (default: false), behavior: prompt/auto_draft

### Phase 4: Search & Filter System

- [ ] **Task 4.1**: Build search indexing for tickets
  - Status: pending
  - Notes: Fuzzy search, query syntax support

- [ ] **Task 4.2**: Implement filter bar UI
  - Status: pending
  - Notes: Status, Service, Owner, Complexity dropdowns

- [ ] **Task 4.3**: Add smart suggestions
  - Status: pending
  - Notes: Related to open file, current branch, stale tickets

### Phase 5: Polish & Integration

- [x] **Task 5.1**: Add keyboard shortcuts
  - Status: completed
  - Notes: Ctrl+Shift+T (panel), Ctrl+Shift+N (new), Ctrl+Shift+L (load)

- [x] **Task 5.2**: Implement status bar item
  - Status: completed
  - Notes: Show active ticket, timer, task progress

### Phase 6: Packaging & Delivery

- [x] **Task 6.1**: Package extension as VSIX
  - Status: completed
  - Notes: cursor-agent-pm-0.0.1.vsix created successfully (compat fixed)

- [x] **Task 6.2**: Installation Verification
  - Status: completed
  - Notes: Successfully installed in Cursor via `code --install-extension`

---

## Completed Tasks

- **Task 1.1**: Initialize VS Code extension with TypeScript (completed)
- **Task 1.2**: Set up project structure (src/, webview/, assets/) (completed)
- **Task 1.3**: Configure build tooling (esbuild/webpack, watch mode) (completed)
- **Task 1.4**: Create Ticket Service (CRUD, file system operations) (completed)
- **Task 2.1**: Create webview panel infrastructure (completed)
- **Task 2.2**: Build ticket dashboard view (Focus Mode + Backlog) (completed)
- **Task 2.3**: Implement ticket detail view with tabs (completed)
- **Task 2.4**: Build kanban board view with drag-and-drop (completed)
- **Task 2.5**: Add right-click context menu actions (completed)
- **Task 3.1**: Register extension commands in package.json (completed)
- **Task 3.2**: Implement smart ticket creation (Parser + Wizard) (completed)
- **Task 3.3**: Build export chat functionality (completed)
- **Task 3.4**: Implement context injection for chat (completed)
- **Task 3.5**: Build auto-export on session end (opt-in setting) (completed)
- **Task 4.1**: Build search indexing for tickets (completed)
- **Task 4.2**: Implement filter bar UI (completed)
- **Task 4.3**: Add smart suggestions (cancelled)
- **Task 5.1**: Add keyboard shortcuts (completed)
- **Task 5.2**: Implement status bar item (completed)
- **Task 6.1**: Package extension as VSIX (completed)
- **Task 6.2**: Installation Verification (completed)

---

## Notes

- Synced with `todo_write` tool
- Update status as work progresses
- PRD reference: EXTENSION_PRD.txt
- Focus on MVP (P0 features) first



