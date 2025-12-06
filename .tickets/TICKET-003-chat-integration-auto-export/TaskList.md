# Task List - [TICKET-003]

## Progress

| Status | Count |
|--------|-------|
| ✅ Completed | 0 |
| 🔄 In Progress | 0 |
| ⏳ Pending | 5 |
| ❌ Cancelled | 0 |

---

## Tasks

### Phase 1: Interactive Commands (Wizard)

- [ ] **Task 1.1**: Implement `createTicketWizard.ts`.
  - Use `showInputBox` and `showQuickPick`.
  - Support Title, Description, Complexity, Service, Owner.
  - Register as `cursor-agent-pm.createTicketWizard`.
- [ ] **Task 1.2**: Add `cursor-agent-pm.ticketStatus` command.
  - QuickPick list of active tickets to check status/open.

### Phase 2: Export Logic (The "Brain")

- [ ] **Task 2.1**: Implement `exportFromClipboard.ts`.
  - Enhance `createTicketFromClipboard` to handle specific flags like `/export request`.
  - Logic to parse "Request", "Plan", "Tasks" from unstructured chat text.
- [ ] **Task 2.2**: Implement "Auto-Export" trigger.
  - Detection logic (e.g., if clipboard contains "Request:" pattern).
  - Configuration setting `ticketManager.autoExport.enabled`.

### Phase 3: Context & Suggestions

- [ ] **Task 3.1**: Implement `loadTicketContext`.
  - Command to insert ticket content into active editor (for Chat).
- [ ] **Task 3.2**: Implement `SmartSuggestions`.
  - Logic to find tickets related to open files.

### Phase 4: Bug Fixes

- [ ] **Task 4.1**: Fix Search Bar focus issue in Webview.
  - `TicketPanelProvider.ts` / `main.js` state handling fix.

---



