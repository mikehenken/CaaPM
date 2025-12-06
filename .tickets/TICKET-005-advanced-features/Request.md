# [TICKET-005] Advanced Features & Automation (v2)

## Metadata
- **Status**: pending
- **Complexity**: plan
- **Service(s)**: extension
- **Created**: 2024-12-05
- **Estimate**: 8h

## Request

Implement the "smart" features that make this an *Agent* PM tool, not just a PM tool. Focus on automation, analytics, and workflow intelligence.

**Key Objectives:**
1.  **Workflow Automation**: Status triggers, notifications.
2.  **Analytics**: Velocity and insights.
3.  **Collaboration**: Live presence, review workflows.
4.  **Templates**: Reusable ticket structures.

## Context

Once the core UI (TICKET-004) and Agent Integration (TICKET-003) are solid, we need to add the "Magic".

## Acceptance Criteria

- [ ] **Workflow Automations**:
    - [ ] Auto-move to "Review" when PR created (mocked or real).
    - [ ] Auto-move to "Done" when branch merged.
- [ ] **Notification System**:
    - [ ] Toast notifications for status changes.
    - [ ] Badge counts on sidebar.
- [ ] **Time Tracking**:
    - [ ] Simple Start/Stop timer on tickets.
    - [ ] Log time to `Discussion.md` or metadata.
- [ ] **Templates Library**:
    - [ ] `Feature`, `Bug`, `Refactor` templates.
    - [ ] "Create from Template" command.
- [ ] **Analytics**:
    - [ ] Velocity chart (Tickets completed / week).
    - [ ] Estimate accuracy (Actual vs Estimated).
- [ ] **Collaboration**:
    - [ ] "Review Workflow" UI (Approve/Reject buttons).
    - [ ] Agent Session Browser (full history).

## Technical Implementation

- **Event Bus**: Implement an event emitter in `TicketService` to trigger automations.
- **Storage**: May need a lightweight JSON DB (lowdb or similar) for analytics if file parsing becomes too slow.

