# [TICKET-003] Core Chat Integration & Auto-Export

## Metadata
- **Status**: ready
- **Complexity**: task_list
- **Service(s)**: extension
- **Created**: 2024-12-05
- **Estimate**: 4h

## Request

Implement the core "Agent Awareness" features to enable fluid chat-to-ticket workflows. This is the "brain" of the extension that connects the chat interface with the ticket system.

**Key Objectives:**
1.  **Inline Commands**: Implement `/ticket` (wizard), `/export`, and `/status` to control tickets from chat.
2.  **Auto-Export**: Build the "Export Chat as Ticket" system that parses conversation history into structured artifacts.
3.  **Context Injection**: Allow the agent to intelligently pull ticket context into the chat session.
4.  **Session Browser**: A basic view to see past agent sessions linked to a ticket.

## Context

Currently, the extension is a passive tool. The user has to manually create tickets and copy-paste context. We want the agent to be an active participant that can "save its work" as a ticket.

## Acceptance Criteria

- [ ] **Command `/ticket`**: Triggers a wizard (QuickPick flow) to create a ticket without leaving the keyboard.
- [ ] **Command `/export`**:
    - [ ] `/export request`: Parses chat to update/create Request.md.
    - [ ] `/export plan`: Parses chat to update/create Implementation_Plan.md.
    - [ ] "Auto-Export on Session End": Configurable trigger to prompt user to save chat.
- [ ] **Context Injection**:
    - [ ] `@TICKET-123` in chat (or similar) should fetch ticket content.
    - [ ] `/ticket load TICKET-123` command.
- [ ] **Search**: Fix the search bar focus issue (Cursor goes away when typing).
- [ ] **Smart Suggestions**: Suggest tickets based on open files (Point 3.3).

## Technical Implementation

- **Chat API**: Since VS Code Extensions don't have direct access to "read" the Cursor Chat history easily, we will implement this via:
    - **Clipboard Parsing** (enhanced): User clicks "Copy Chat", runs `/export`, and we parse the clipboard.
    - **Prompt Injection**: We provide a system prompt/rule that teaches the agent to format its output so we can "read" it via a command that takes the *current selection* or *last response*.
- **Wizard**: Use `vscode.window.showInputBox` and `showQuickPick` for the step-by-step flow.

