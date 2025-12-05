# Cursor Agent PM

[![Version](https://img.shields.io/badge/version-0.0.1-blue.svg)](https://github.com/placeholder/cursor-agent-pm)
[![VS Code](https://img.shields.io/badge/VS%20Code-1.85.0+-blue.svg)](https://code.visualstudio.com/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE.md)

**In-IDE Agent Project Management Extension** for Cursor and VS Code. Manage AI-assisted development workflows with structured ticket management directly in your editor.

![Cursor Agent PM Dashboard](assets/screenshot-dashboard.png)

---

## 🎯 Overview

Cursor Agent PM bridges the gap between AI chat sessions and structured project management. Instead of juggling external tools, manage tickets, tasks, and agent workflows directly in your IDE with:

- **File-based storage** (`.tickets/` directory) - Git-friendly, no database needed
- **Chat-to-ticket conversion** - Transform conversations into structured documentation
- **Agent/human ownership tracking** - Know who's working on what
- **Smart search & filtering** - Find tickets instantly with fuzzy search
- **Kanban board view** - Visualize workflow with drag-and-drop status updates

---

## ✨ Features

### 🎫 Ticket Management
- **Create tickets** with metadata (owner, complexity, status, estimates)
- **File-based storage** in `.tickets/TICKET-XXX/` directories
- **Auto-incrementing IDs** - Never worry about ticket numbering
- **Rich metadata support** - Tags, reviewers, dependencies, assets
- **Markdown-based** - Edit tickets in any text editor

### 🎨 Sidebar Panel
- **Ticket dashboard** - View all tickets grouped by status
- **Detail view** - See full ticket information including tasks
- **Kanban board** - Drag-and-drop to change status
- **Quick actions** - Mark complete, edit, copy context
- **Search & filter** - Real-time fuzzy search across all tickets

### 📋 Chat Integration
- **Create from clipboard** - Paste chat context into new tickets
- **Copy ticket context** - Inject ticket information into chat
- **Export workflows** - Convert conversations into ticket artifacts (Request.md, TaskList.md, etc.)

### ⌨️ Keyboard Shortcuts
| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+T` (Mac: `Cmd+Shift+T`) | Open ticket sidebar |
| `Ctrl+Shift+N` (Mac: `Cmd+Shift+N`) | Create new ticket |
| `Ctrl+Shift+V` | Create ticket from clipboard |

### 🎯 Status Bar
- Shows **active ticket** at a glance
- Quick access to ticket actions
- Click to open ticket detail

---

## 📦 Installation

### Option 1: Install from VSIX (Recommended)

1. Download the latest `.vsix` file from [Releases](https://github.com/placeholder/cursor-agent-pm/releases)
2. Open VS Code/Cursor
3. Run command: `Extensions: Install from VSIX...`
4. Select the downloaded `.vsix` file

**Or via command line:**
```bash
code --install-extension cursor-agent-pm-0.0.1.vsix
```

### Option 2: Build from Source

```bash
# Clone the repository
git clone https://github.com/placeholder/cursor-agent-pm.git
cd cursor-agent-pm

# Install dependencies
npm install

# Build the extension
npm run compile

# Package as VSIX (optional)
npx @vscode/vsce package

# Install
code --install-extension cursor-agent-pm-0.0.1.vsix
```

---

## 🚀 Quick Start

### 1. Create Your First Ticket

**Method A: Command Palette**
- Press `Ctrl+Shift+P` (Mac: `Cmd+Shift+P`)
- Type `Ticket: Create Ticket`
- Fill in the form

**Method B: Keyboard Shortcut**
- Press `Ctrl+Shift+N` (Mac: `Cmd+Shift+N`)

**Method C: From Clipboard**
- Copy chat conversation or notes
- Press `Ctrl+Shift+V` or run `Ticket: Create Ticket from Clipboard`

### 2. View Tickets

- Press `Ctrl+Shift+T` (Mac: `Cmd+Shift+T`) to open sidebar
- Click on any ticket to view details
- Use search bar to filter tickets

### 3. Update Status

**Kanban Board:**
- Switch to Kanban view in sidebar
- Drag tickets between columns (todo → in_progress → done)

**Quick Actions:**
- Click ticket → "Mark Complete"
- Or edit `Request.md` and change status directly

### 4. Copy Context to Chat

- Select a ticket in sidebar
- Click "Copy Context" button
- Paste into Cursor chat to give agent full context

---

## 📁 Project Structure

```
your-project/
├── .tickets/                          # Ticket storage (auto-created)
│   ├── TICKET-001-feature-name/
│   │   ├── Request.md                 # Problem statement, acceptance criteria
│   │   ├── Implementation_Plan.md     # Technical approach, architecture
│   │   ├── TaskList.md                # Phased tasks, checklist
│   │   ├── Discussion.md              # Decisions, rationale (optional)
│   │   └── assets/                    # Designs, mockups, diagrams
│   ├── TICKET-002-another-feature/
│   └── ...
└── your-code/
```

### Ticket Anatomy

Each ticket is a directory with structured markdown files:

**Request.md** - Core ticket definition
```markdown
# [TICKET-001] Feature Name

## Metadata
- Status: todo | in_progress | review | done | blocked
- Complexity: simple | task_list | plan
- Service(s): backend, frontend, infra
- Estimate: 2h

## Request
What needs to be done...

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
```

**TaskList.md** - Execution checklist (for `task_list` or `plan` complexity)
```markdown
## Phase 1: Setup
- [ ] Task 1
- [ ] Task 2

## Phase 2: Implementation
- [ ] Task 3
```

**Implementation_Plan.md** - Technical details (for `plan` complexity)
```markdown
## Architecture Overview
Technical approach...

## Key Decisions
- Decision 1: Rationale
```

---

## 🛠️ Development

### Prerequisites
- Node.js 18.x or higher
- VS Code 1.85.0 or higher
- TypeScript 5.4.5

### Setup

```bash
# Install dependencies
npm install

# Run type checking
npm run check-types

# Run linter
npm run lint

# Build extension
npm run compile

# Watch mode (auto-rebuild on changes)
npm run watch
```

### Testing

Press **F5** in VS Code to launch Extension Development Host with your extension loaded.

### Build Commands

| Command | Description |
|---------|-------------|
| `npm run compile` | Development build |
| `npm run package` | Production build |
| `npm run watch` | Watch mode for development |
| `npm run check-types` | TypeScript type checking |
| `npm run lint` | ESLint checks |
| `npm test` | Run tests |

### Project Architecture

```
src/
├── extension.ts                 # Extension entry point
├── commands/                    # Command implementations
│   ├── createTicket.ts
│   ├── createTicketFromClipboard.ts
│   └── copyTicketContext.ts
├── services/                    # Business logic
│   └── TicketService.ts        # Ticket CRUD operations
├── webview/                     # Sidebar UI
│   ├── TicketPanelProvider.ts  # Webview controller
│   ├── main.js                 # Webview logic
│   └── style.css               # Webview styles
├── statusbar/                   # Status bar integration
│   └── TicketStatusBar.ts
└── types.ts                     # TypeScript interfaces
```

---

## 🎨 Configuration

Extension settings available in VS Code settings:

```json
{
  "ticketManager.autoExport.enabled": false
}
```

| Setting | Description | Default |
|---------|-------------|---------|
| `ticketManager.autoExport.enabled` | Auto-export chat sessions to tickets (requires manual trigger in MVP) | `false` |

---

## 📖 Usage Examples

### Example 1: Feature Development Workflow

```bash
# 1. Create ticket for new feature
Ctrl+Shift+N → Fill form → "Add OAuth login"

# 2. Agent works on it
Copy Context → Paste in chat → Agent implements

# 3. Track progress
Update TaskList.md with checkmarks

# 4. Complete ticket
Click "Mark Complete" in sidebar
```

### Example 2: Bug Triage

```bash
# 1. User reports bug in chat
# 2. Copy chat conversation
# 3. Create ticket from clipboard (Ctrl+Shift+V)
# 4. Ticket auto-populated with context
# 5. Assign to agent/human
```

### Example 3: Sprint Planning

```bash
# 1. Open Kanban board in sidebar
# 2. Create multiple tickets (Ctrl+Shift+N)
# 3. Drag tickets to "in_progress" to start sprint
# 4. Agents pick up tickets via "Copy Context"
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Follow TypeScript best practices** (see `.cursor/rules/`)
4. **Write descriptive commit messages** (Conventional Commits format)
5. **Test thoroughly** (Press F5 to test extension)
6. **Submit a pull request**

### Coding Standards
- TypeScript strict mode
- ESLint + Prettier formatting
- Descriptive variable names
- Comments for complex logic

---

## 🐛 Troubleshooting

### Extension not activating
- Check VS Code version (must be 1.85.0+)
- Run `Developer: Show Running Extensions` to verify

### Tickets not showing in sidebar
- Ensure `.tickets/` directory exists in workspace root
- Check ticket markdown files have proper frontmatter

### Search not working
- Verify ticket files are valid markdown
- Check browser console in webview (Developer Tools)

### Build failures
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check disk space (C: drive needs at least 2GB free)

---

## 📝 Roadmap

### v0.0.1 (MVP) ✅
- [x] Ticket creation and storage
- [x] Sidebar dashboard
- [x] Search and filter
- [x] Clipboard integration
- [x] Status bar integration
- [x] Keyboard shortcuts

### v0.1.0 (Planned)
- [ ] Kanban drag-and-drop (visual mode)
- [ ] Chat `/ticket` command wizard
- [ ] Auto-export chat to ticket artifacts
- [ ] Smart suggestions based on active file

### v1.0.0 (Future)
- [ ] Context injection via MCP
- [ ] Multi-workspace support
- [ ] Ticket dependencies graph
- [ ] Time tracking
- [ ] GitHub integration
- [ ] Team collaboration features

---

## 📄 License

MIT License - see [LICENSE.md](LICENSE.md) for details

---

## 🙏 Acknowledgments

Built for **Cursor** IDE and AI-assisted development workflows.

- Inspired by Linear, Jira, and GitHub Projects
- Designed with behavioral psychology principles (Don't Make Me Think)
- Optimized for file-based, git-friendly workflows

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/placeholder/cursor-agent-pm/issues)
- **Discussions**: [GitHub Discussions](https://github.com/placeholder/cursor-agent-pm/discussions)
- **Documentation**: [docs/](docs/)

---

**Made with ❤️ for developers using AI agents**

