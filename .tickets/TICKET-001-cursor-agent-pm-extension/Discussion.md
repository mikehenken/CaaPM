# Discussion Log - [TICKET-001]

> Document decisions, rationale, and handoff notes here. The "WHY" matters.

---

## Decisions

### Decision 1: File-Based Storage
- **Date**: 2024-12-05
- **Decision**: Use file-based storage (`.tickets/` directory with markdown files) instead of database
- **WHY**: Enables version control, works offline, transparent to users, aligns with existing template system
- **Alternatives considered**: SQLite, IndexedDB, cloud storage
- **Impact**: Simple implementation, git-friendly, but may need indexing for large ticket counts

### Decision 2: Webview for Panel UI
- **Date**: 2024-12-05
- **Decision**: Use VS Code Webview API for rich panel UI
- **WHY**: Enables modern UI with React-like components, kanban drag-drop, rich interactions
- **Alternatives considered**: TreeView API (limited), native VS Code views
- **Impact**: More complex setup but much better UX

### Decision 3: TypeScript Strict Mode
- **Date**: 2024-12-05
- **Decision**: Enable strict TypeScript configuration
- **WHY**: Per @typescript-guidelines.mdc - catches bugs early, better IDE support
- **Alternatives considered**: Loose typing
- **Impact**: Slightly more verbose but safer code

### Decision 4: VS Code Extension, Cursor-First
- **Date**: 2024-12-05
- **Decision**: Build as VS Code extension but target Cursor users specifically
- **WHY**: VS Code APIs are stable/documented. Cursor IS VS Code under the hood. This gives us solid foundation while focusing UX on AI chat workflows that Cursor users need.
- **Alternatives considered**: Cursor-only (risky, undocumented), VS Code general (unfocused)
- **Impact**: Best of both - stable APIs + focused audience. Cursor-specific integrations added when APIs available.

### Decision 5: Auto-Export in MVP (Opt-In)
- **Date**: 2024-12-05
- **Decision**: Include auto-export on session end in MVP, behind a setting (default off)
- **WHY**: Low incremental effort since export functionality already being built. Opt-in respects user preference.
- **Alternatives considered**: Defer to v2
- **Impact**: Adds ~1-2 tasks to Phase 3, settings infrastructure needed

---

## Key Findings

### Finding 1: Existing Template System
The project already has ticket templates in `.cursor/templates/ticket/` which should be leveraged for consistency.

### Finding 2: PRD Completeness
EXTENSION_PRD.txt is comprehensive and serves as the implementation blueprint. Priority matrix included.

---

## Handoff Notes

### For Next Agent
- Current state: **Completed (MVP Live)**. Extension is installed and working.
- What's working: Creation, Views, Search, Context Copy.
- What's blocked: Deep chat integration (awaiting Cursor APIs).
- Next steps: Dogfood the extension, gather feedback for v2 features (MCP, Auto-export).
- Watch out for: VS Code API updates that might affect the Webview message passing.

### Context Needed
- Key files: EXTENSION_PRD.txt, .cursor/templates/ticket/*
- Key concepts: VS Code Extension API, Webview messaging, File System Watcher
- Dependencies: vscode types, esbuild or webpack

---

## Questions Raised

- [x] Question 1 - Status: resolved
  - Should this be VS Code compatible or Cursor-only?
  - Answer: **VS Code compatible** (works in both). Zero extra cost since Cursor IS VS Code. Stable APIs, larger market, professional path. Cursor-specific features (MCP, chat hooks) can be added later as enhancements.

- [x] Question 2 - Status: resolved
  - How to inject context into Cursor's chat? (MCP?)
  - Answer: **Defer to v2**. For MVP, use command palette with QuickPick wizard. Works identically in both platforms. MCP integration is a future enhancement.

- [x] Question 3 - Status: resolved
  - Should auto-export on session end be MVP or v2?
  - Answer: **MVP with setting**. Opt-in via `ticketManager.autoExport.enabled: false` (default off). Low effort since export functionality is already being built.

---

## Session Log

### Session 1 - 2024-12-05
- **Agent**: claude-opus-4.5
- **Duration**: ~5 min
- **Progress**: Ticket creation, initial planning
- **Blockers**: None


