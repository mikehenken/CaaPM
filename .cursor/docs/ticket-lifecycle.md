# Ticket Lifecycle

## Overview

This document describes the ticket workflow system for managing development tasks with AI agents.

## Lifecycle Diagram

```
                    ┌─────────────────────────────────────────────────────────────┐
                    │                     TICKET LIFECYCLE                         │
                    └─────────────────────────────────────────────────────────────┘
                                               │
                                               ▼
                    ┌─────────────────────────────────────────────────────────────┐
                    │  1. DRAFT                                                    │
                    │     - Create ticket folder with templates                    │
                    │     - Fill in Request.md (the "what")                        │
                    │     - Set complexity, service, review requirements           │
                    └─────────────────────────────────────────────────────────────┘
                                               │
                         ┌─────────────────────┴─────────────────────┐
                         │                                           │
                         ▼                                           ▼
          ┌──────────────────────────────┐         ┌──────────────────────────────┐
          │  onStart: true               │         │  onStart: false              │
          │  → PENDING_START_REVIEW      │         │  → READY                     │
          │  (Peer/human reviews plan)   │         │  (Skip to work)              │
          └──────────────────────────────┘         └──────────────────────────────┘
                         │                                           │
                         │ Approved                                  │
                         └─────────────────────┬─────────────────────┘
                                               │
                                               ▼
                    ┌─────────────────────────────────────────────────────────────┐
                    │  2. IN_PROGRESS                                              │
                    │     - Agent works on tasks                                   │
                    │     - Updates TaskList.md                                    │
                    │     - Documents decisions in Discussion.md (the "WHY")       │
                    │     - Syncs with todo_write                                  │
                    │                                                              │
                    │  ⚠️  HANDOFF TRIGGERS:                                       │
                    │     - Same error 3+ times                                    │
                    │     - >50 messages in conversation                           │
                    │     - Agent expresses uncertainty                            │
                    │     - Scope drifting beyond ticket                           │
                    │     - Work stalled >30 min on same issue                     │
                    │     → Suggest fresh agent with ticket handoff                │
                    └─────────────────────────────────────────────────────────────┘
                                               │
                                               │ Work complete
                                               ▼
                    ┌─────────────────────────────────────────────────────────────┐
                    │  3. PENDING_COMPLETION_REVIEW                                │
                    │     - Agent creates Summary.md                               │
                    │     - All tasks marked complete                              │
                    │                                                              │
                    │  Review Gate (always unless humanReviewWaived: true):        │
                    │     - Peer agent review (if onComplete: true)                │
                    │     - Human review (REQUIRED by default)                     │
                    └─────────────────────────────────────────────────────────────┘
                                               │
                         ┌─────────────────────┴─────────────────────┐
                         │                                           │
                         ▼                                           ▼
          ┌──────────────────────────────┐         ┌──────────────────────────────┐
          │  CHANGES_REQUESTED           │         │  DONE                        │
          │  → Back to IN_PROGRESS       │         │  ✅ Ticket complete          │
          │  → Address feedback          │         │  → Archive or close          │
          └──────────────────────────────┘         └──────────────────────────────┘
```

## Status States

| Status | Description |
|--------|-------------|
| `draft` | Initial creation, filling in details |
| `pending_start_review` | Waiting for plan approval before work begins |
| `ready` | Approved to start work |
| `in_progress` | Actively being worked on |
| `pending_completion_review` | Work done, awaiting review |
| `changes_requested` | Review feedback needs addressing |
| `done` | Approved and complete |

## Files in a Ticket

| File | Purpose | Required |
|------|---------|----------|
| `Request.md` | The "what" - task description, acceptance criteria | ✅ |
| `TaskList.md` | Trackable tasks, synced with todo_write | ✅ |
| `Discussion.md` | The "WHY" - decisions, rationale, handoff notes | ✅ |
| `Implementation_Plan.md` | PRD for complex tickets (complexity=plan) | For plans |
| `Analysis.md` | Detailed findings for audit/discovery tickets | Optional |
| `Summary.md` | Completion report for reviewers | On complete |

## Review Requirements

### Human Review (Default)
- **Always required** unless explicitly waived with `humanReviewWaived: true`
- Reviews Summary.md and changes before marking done

### Peer Review (Agent-to-Agent)
- **onStart**: Fresh agent reviews plan before work begins
- **onComplete**: Fresh agent reviews work before human review
- Helps catch blind spots from conversation tunnel vision

## Work Pacing Control

The `workReviewOn` field controls checkpoint granularity:

| Value | Behavior |
|-------|----------|
| `phase` | Stop for approval at each phase boundary |
| `task` | Stop for approval after each task |
| `model_decision` | Stop when agent needs to make significant decisions |

## Commands

```powershell
# Create new ticket
.\.cursor\scripts\ticket-create.ps1

# Load ticket context
.\.cursor\scripts\ticket-load.ps1 TICKET-001

# Start review workflow
.\.cursor\scripts\ticket-review.ps1 TICKET-001 -ReviewType complete
```

## Chat Commands

In chat with the AI agent:
- "Create ticket for [task]"
- "Load ticket TICKET-XXX"
- "Review ticket TICKET-XXX"
- "Continue ticket TICKET-XXX"

