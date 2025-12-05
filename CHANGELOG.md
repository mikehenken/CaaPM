# Changelog

All notable changes to the "Cursor Agent PM" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial release preparation
- GitHub repository and CI/CD setup

## [0.0.1] - 2024-12-05

### Added
- Ticket dashboard with Focus and Board views
- Ticket creation via command or clipboard
- Structured clipboard parsing for tickets
- Search functionality across tickets
- Status management (drag-and-drop in Kanban view)
- Archive functionality with confirmation
- Load ticket context to chat/editor
- Status bar integration showing active ticket
- "Netflix" aesthetic UI with dark mode support
- File-based ticket storage in `.tickets/` directory

### Features
- **Dashboard View**:
  - Focus mode highlighting active ticket
  - "Up Next" queue for pending tickets
  - Badge system for status, services, and complexity
- **Kanban Board**:
  - Drag-and-drop status changes
  - Four columns: Ready, In Progress, Review, Done
  - Visual ticket count per column
- **Ticket Management**:
  - Create tickets via command palette
  - Create tickets from clipboard with parsing
  - View ticket details with tabs (Request, Tasks, Plan, Discussion)
  - Archive tickets (move to `_archive`)
  - Context menu actions (Open, Load to Chat, Archive)
- **Search**:
  - Full-text search across ticket content
  - Filter by ID, title, status, owner, and services

### Technical
- TypeScript-based VS Code extension
- Webview-based UI with custom styling
- File system-based ticket storage
- Markdown-based ticket format
- ESLint and TypeScript strict mode
- No external dependencies for ticket storage

[Unreleased]: https://github.com/mikehenken/CaaPM/compare/v0.0.1...HEAD
[0.0.1]: https://github.com/mikehenken/CaaPM/releases/tag/v0.0.1

