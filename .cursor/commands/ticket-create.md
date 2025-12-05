---
name: Create Ticket
description: Create a new development ticket with templates
---

Create a new ticket for the following task. Ask me these questions first:

1. **What is the task?** (brief description)
2. **Complexity?** (simple | task_list | plan)
3. **Service(s) involved?** (backend | frontend | landing | infra | all)
4. **Estimate?** (e.g., 30m, 2h, 1d, 3sp, S/M/L/XL)
5. **Owner?**
   - Person: github:{username} (optional)
   - Agent: model name + @persona rules (optional)
6. **Reviewers?**
   - People: github:{usernames} (comma-separated)
   - Agents: model name + @persona rules (can add multiple)
7. **Need an assets folder?** (for design mockups, references)
8. **Review requirements?** (default: human review on complete)

Then create:
- `.tickets/TICKET-XXX-{slug}/Request.md` - from template
- `.tickets/TICKET-XXX-{slug}/TaskList.md` - from template
- `.tickets/TICKET-XXX-{slug}/Discussion.md` - from template
- If complexity=plan: `.tickets/TICKET-XXX-{slug}/Implementation_Plan.md`
- If assets needed: `.tickets/TICKET-XXX-{slug}/assets/` folder

Use next available ticket number. Reference templates in `.cursor/templates/ticket/`.

## Example Request.md with all fields:

```markdown
## Ownership
- **Owner**:
  - Person: github:mikehenken
  - Agent:
    - model: claude-4-opus
      rules:
        - @full-stack-engineer.mdc
        - @owasp-security.mdc

## Reviewers
- **People**: github:jontvoss, github:zachafavalava
- **Agents**:
  - model: gemini-pro
    rules:
      - @qa-engineer-persona.mdc
  - model: claude-4-opus
    rules:
      - @cyber-security-engineer-persona.mdc

## Assets
- design mockup v1: assets/landing-mockup-v1.psd
- design mockup v1 revision: assets/landing-mockup-v1.1.psd
- figma prototype: https://figma.com/proto/abc123
```
