# [TICKET-001] In-IDE Agent Project Management Extension

## Metadata
- **Status**: ready
- **Complexity**: plan
- **Service(s)**: extension
- **Created**: 2024-12-05
- **Updated**: 2024-12-05
- **Estimate**: 2h

## Ownership
- **Owner**:
  - Person: github:mikehenken
  - Agent:
    - model: gemini-3-pro
      rules:
        - @typescript-guidelines.mdc
        - @senior-javascript.mdc

## Reviewers
- **People**: 
- **Agents**:
  - model: claude-opus-4.5
    rules:
      - @ux-advocate-persona.mdc
      - @qa-engineer-persona.mdc

## Review Requirements
- **onStart**: false
- **onComplete**: true  
- **humanReviewWaived**: false

## Work Pacing
- **workReviewOn**: phase

## Assets
- PRD Document: [EXTENSION_PRD.txt](../../EXTENSION_PRD.txt)
- Design mockups: assets/

---

## Request

Build the **In-IDE Agent Project Management Extension** for Cursor as defined in EXTENSION_PRD.txt. This is a VS Code/Cursor extension that provides comprehensive ticket/task management for AI-assisted development workflows.

**Core MVP Features to implement:**
1. **Chat Integration** - Questionnaire wizard (`/ticket`), context injection, inline commands, export chat as ticket artifacts
2. **Panel UI (Sidebar)** - Ticket dashboard, detail view, kanban board, quick actions
3. **Search & Filter** - Global search, filter bar, smart suggestions

## Context

Managing AI agent work sessions requires structured ticket management that integrates directly into the IDE. Current solutions are external tools that break workflow. This extension bridges the gap by providing:
- File-based ticket storage (`.tickets/` directory)
- Chat-to-ticket artifact conversion
- Agent/human ownership tracking
- Review workflow management

The PRD is comprehensive and serves as the implementation blueprint.

## Acceptance Criteria

- [ ] Extension activates in Cursor/VS Code
- [ ] `/ticket` command triggers questionnaire wizard in chat
- [ ] Sidebar panel displays ticket dashboard with status grouping
- [ ] Tickets are created as markdown files in `.tickets/` directory
- [ ] Search works across all ticket content
- [ ] `/export` commands extract chat into ticket artifacts
- [ ] Kanban board view with drag-and-drop status changes
- [ ] Keyboard shortcuts work (`Ctrl+Shift+T`, `Ctrl+Shift+N`, etc.)
- [ ] Status bar shows active ticket info
- [ ] Assets folder support for design mockups

## Related & References

- Tickets: N/A (first ticket)
- Docs: EXTENSION_PRD.txt
- Code: `.cursor/templates/ticket/` (existing templates)

