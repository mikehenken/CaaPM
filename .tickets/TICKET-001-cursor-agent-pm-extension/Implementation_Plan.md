# Implementation Plan - [TICKET-001]

> This document serves as the PRD (Product Requirements Document) for this ticket.
> **Full PRD**: See [EXTENSION_PRD.txt](../../EXTENSION_PRD.txt) for complete feature roadmap.

## Overview

Build an In-IDE Agent Project Management Extension for Cursor/VS Code that enables structured ticket management, AI agent work tracking, and chat-to-ticket artifact conversion. The extension integrates directly into the development workflow through a sidebar panel, chat commands, and keyboard shortcuts.

## Goals

- Goal 1: Seamless ticket management without leaving the IDE
- Goal 2: Convert exploratory chat conversations into structured documentation
- Goal 3: Track AI agent work sessions with handoff capabilities
- Goal 4: Enable team collaboration through file-based, git-friendly ticket storage

## Non-Goals

- NOT building external cloud sync (v2 feature)
- NOT implementing multi-agent pipelines (v2 feature)
- NOT building team management/RBAC (v3 feature)
- Out of scope: Linear/Jira sync, analytics dashboard

---

## Requirements

### Functional Requirements

- [ ] **FR1**: User can create tickets via `/ticket` chat command (supports one-shot params + wizard fallback)
- [ ] **FR2**: User can view tickets in sidebar: Default "Focus Mode" (Active Ticket) + List view
- [ ] **FR3**: User can search tickets with fuzzy search and query syntax
- [ ] **FR4**: User can export chat conversations to ticket artifacts
- [ ] **FR5**: User can drag-and-drop tickets in kanban view to change status
- [ ] **FR6**: User can view ticket details with tabs (Request, Tasks, Discussion, Assets)
- [ ] **FR7**: Tickets are stored as markdown files in `.tickets/` directory
- [ ] **FR8**: Status bar shows active ticket and progress
- [ ] **FR9**: Auto-export notifications are non-blocking (Toast/Status bar)

### Non-Functional Requirements

- [ ] **NFR1**: Extension activates within 500ms
- [ ] **NFR2**: Search results return within 100ms for <1000 tickets
- [ ] **NFR3**: Works offline (file-based storage)
- [ ] **NFR4**: TypeScript strict mode with no `any` types
- [ ] **NFR5**: UI follows "Netflix" aesthetic (high contrast, content-forward, minimal clutter)

---

## Technical Approach

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    VS Code Extension                         │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Webview   │  │   Commands  │  │   Status    │         │
│  │   Panel     │  │   Handler   │  │   Bar       │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│         │                │                │                 │
│         └────────────────┼────────────────┘                 │
│                          │                                  │
│  ┌───────────────────────▼───────────────────────┐         │
│  │              Ticket Service                    │         │
│  │  - CRUD operations                            │         │
│  │  - Search indexing                            │         │
│  │  - File system watcher                        │         │
│  └───────────────────────┬───────────────────────┘         │
│                          │                                  │
│  ┌───────────────────────▼───────────────────────┐         │
│  │              File System                       │         │
│  │  .tickets/ and .cursor/ directories           │         │
│  └───────────────────────────────────────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

### Key Components

1. **Ticket Service**: Core business logic - CRUD, search, parsing markdown
2. **Webview Panel**: React-based UI for dashboard, kanban, detail views
3. **Command Handler**: Register and handle chat/command palette commands
4. **File Watcher**: Monitor `.tickets/` for external changes
5. **Status Bar**: Show active ticket info

### Data Flow

```
User Action → Command/Panel → Ticket Service → File System
                                    ↓
                              Event Emitter
                                    ↓
                    ┌───────────────┼───────────────┐
                    ↓               ↓               ↓
               Panel Update    Chat Injection   Status Bar
```

### Technology Stack

- **Language**: TypeScript (strict mode)
- **Build**: esbuild (fast builds)
- **Webview**: Vanilla JS or lightweight framework (keep bundle small)
- **Styling**: Tailwind CSS or VS Code's native CSS variables
- **Testing**: Vitest for unit tests, VS Code test runner for integration

---

## Phases

### Phase 1: Extension Scaffolding & Core Setup
- **Goal**: Working extension that activates and has Ticket Service
- **Tasks**: See TaskList.md (Tasks 1.1-1.4)
- **Acceptance**: Extension loads, can read/write tickets programmatically

### Phase 2: Sidebar Panel UI
- **Goal**: Visual ticket management interface
- **Tasks**: See TaskList.md (Tasks 2.1-2.5)
- **Acceptance**: User can view, navigate, and manage tickets visually

### Phase 3: Chat Integration & Commands
- **Goal**: Chat-based ticket workflows
- **Tasks**: See TaskList.md (Tasks 3.1-3.4)
- **Acceptance**: `/ticket` and `/export` commands work

### Phase 4: Search & Filter System
- **Goal**: Fast ticket discovery
- **Tasks**: See TaskList.md (Tasks 4.1-4.3)
- **Acceptance**: User can find tickets by content, filters, suggestions

### Phase 5: Polish & Integration
- **Goal**: Production-ready experience
- **Tasks**: See TaskList.md (Tasks 5.1-5.2)
- **Acceptance**: Keyboard shortcuts, status bar, smooth UX

### Phase 6: Packaging
- **Goal**: Deliverable VSIX
- **Tasks**: Package extension with `vsce`
- **Acceptance**: `.vsix` file installed and verified in Cursor (Completed)

---

## Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Cursor chat API not accessible | HIGH | MEDIUM | Use command palette as fallback |
| Webview performance issues | MEDIUM | LOW | Keep bundle small, lazy load |
| File watcher memory leaks | MEDIUM | LOW | Debounce, dispose properly |
| Complex kanban drag-drop | LOW | MEDIUM | Use proven library or simplify |

---

## Success Criteria

How we'll know this is done and working:

1. User can create a ticket via command and see it in sidebar
2. User can search and filter tickets effectively
3. Kanban board allows visual status management
4. Chat export creates properly formatted ticket artifacts
5. No TypeScript errors, passes lint checks
6. Extension size < 1MB bundled

---

## Open Questions

- [x] ~~How to integrate with Cursor's chat API?~~ → Defer MCP to v2. MVP uses command palette.
- [x] ~~Should auto-export on session end be MVP or v2?~~ → MVP with opt-in setting.
- [ ] VS Code Marketplace vs Cursor-specific distribution?
- [ ] Extension naming: "Ticket Manager" vs "Agent PM" vs other?

---

## References

- Design docs: EXTENSION_PRD.txt
- Related tickets: N/A (first ticket)
- External docs: 
  - [VS Code Extension API](https://code.visualstudio.com/api)
  - [Webview API](https://code.visualstudio.com/api/extension-guides/webview)
  - [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)


