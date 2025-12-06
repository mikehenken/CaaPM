# [TICKET-004] Panel UI Overhaul (Shortcut Aesthetic)

## Metadata
- **Status**: ready
- **Complexity**: plan
- **Service(s)**: extension, webview
- **Created**: 2024-12-05
- **Estimate**: 6h

## Request

Overhaul the Webview Panel to match the "Shortcut.com" aesthetic and functionality. Move away from static Markdown rendering to interactive, savable forms.

**Key Objectives:**
1.  **"Shortcut" Design**: Clean, high-contrast, professional UI.
2.  **Responsive Kanban**: Collapsible swimlanes, adaptive layout (<700px), rich card details.
3.  **Interactive Views**: Click-to-edit fields, live forms, not just Markdown previews.
4.  **Asset Management**: Integrated asset browser and rendering.

## Context

The current UI is a "v0" vanilla JS implementation. It lacks density, interactivity, and polish. Users want a tool that feels like a dedicated PM app (Shortcut), not just a text viewer.

## Acceptance Criteria

- [ ] **Ticket Dashboard**:
    - [ ] "Focus" view with high-priority items.
    - [ ] "Board" view (Kanban) with:
        - [ ] Collapsible columns/swimlanes (remember state).
        - [ ] Rich cards: Tags, Estimate, Dates, Progress %.
        - [ ] Mobile/Narrow view: Collapses to list/optimized view <700px.
- [ ] **Detail View**:
    - [ ] **Click-to-Edit**: Fields (Title, Status, Complexity) are editable inputs.
    - [ ] **Tabs**: Request, Tasks, Plan, Discussion, **Assets**.
    - [ ] **Savable**: "Save" button or auto-save on blur for text fields.
- [ ] **Asset Management**:
    - [ ] View list of assets in `assets/` folder.
    - [ ] Render images in `Request.md` preview.
    - [ ] Drag-and-drop upload (if possible) or "Import" command.
- [ ] **Visual Polish**:
    - [ ] Status Bar integration (Point 9.4).
    - [ ] Editor Gutter decorations (Point 9.3).

## Technical Implementation

- **CSS Framework**: Expand `style.css` with a proper variable system (CSS Variables) matching the Shortcut palette.
- **State Management**: Improve `main.js` state handling to support "edit mode" vs "view mode".
- **Asset Service**: Add `AssetService.ts` to handle file operations in `assets/`.

