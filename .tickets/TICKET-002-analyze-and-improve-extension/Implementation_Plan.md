# Implementation Plan - [TICKET-002]

> This document serves as the PRD (Product Requirements Document) for this ticket.

## Overview

We are analyzing the current extension state against the `EXTENSION_PRD.txt` to identify gaps, prioritize immediate "must-do" features, and improve the overall design/UX.

## Goals

- **Goal 1**: Gap analysis complete (Done).
- **Goal 2**: Design Polish - Implement "Chief Behavioral Designer" aesthetic.
- **Goal 3**: Feature - Enhanced "Export from Clipboard" to support structured data (Request/Tasks).

## Non-Goals

- Full "Auto-Export" (requires Chat API access).
- Backend service integration.

---

## Requirements

### Functional Requirements

- [ ] **FR1**: User can paste a structured ticket definition (Title, Request, Complexity) from clipboard and have it parsed correctly.
- [ ] **FR2**: Ticket Panel Dashboard displays tickets with a modern, high-contrast card design.
- [ ] **FR3**: Kanban view supports drag-and-drop with visual feedback.
- [ ] **FR4**: Detail view renders Markdown with better typography.

### Non-Functional Requirements

- [ ] **NFR1**: UI matches "Netflix" aesthetic (Dark/Cinema mode).
- [ ] **NFR2**: Responsive to VS Code theme changes (using `var(--vscode-...)`).

---

## Technical Approach

### Architecture

- **Webview**: Refactor HTML generation to use template literals with cleaner class structures.
- **CSS**: Complete rewrite of `style.css` using modern CSS (Flexbox/Grid, Variables).
- **Service**: Enhance `createTicket` to support parsing "structured text" input.

### Key Components

1.  **`src/webview/style.css`**: The styling core.
2.  **`src/webview/TicketPanelProvider.ts`**: The view logic.
3.  **`src/commands/createTicketFromClipboard.ts`**: The parsing logic.

---

## Phases

### Phase 1: Analysis (Completed)
- **Goal**: Identify gaps.
- **Tasks**: Review PRD, Review Code, List Gaps.
- **Acceptance**: Approved list of tasks.

### Phase 2: Design Polish (Current)
- **Goal**: Improve UX.
- **Tasks**:
  - [ ] Rewrite `style.css`.
  - [ ] Update `TicketPanelProvider` HTML structure.
  - [ ] Add badges, icons (utf8), and spacing.
- **Acceptance**: Visual review (matches "Netflix" aesthetic).

### Phase 3: Critical Features
- **Goal**: Close MVP gaps.
- **Tasks**:
  - [ ] Update `createTicketFromClipboard` to parse structured input.
  - [ ] (Optional) Add `createTicketFromSelection`.
- **Acceptance**: User can copy a "ticket definition" and create a ticket in one go.

---

## Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| CSS Conflicts | LOW | LOW | Scoped styles in Webview. |
| Regex Brittle | MEDIUM | MEDIUM | Add unit tests for parser (or manual verification). |

---

## Success Criteria

1.  Dashboard looks modern and professional.
2.  "Create from Clipboard" intelligently parses input.
