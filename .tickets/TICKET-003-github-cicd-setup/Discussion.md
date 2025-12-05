# Discussion Log - [TICKET-003]

> Document decisions, rationale, and handoff notes here. The "WHY" matters.

---

## Decisions

### Decision 1: Public Repository
- **Date**: 2024-12-05
- **Decision**: Made repository public
- **WHY**: Extension will eventually be published to marketplace; open source fosters community contributions
- **Alternatives considered**: Private repo (rejected - adds friction for contributors)
- **Impact**: Code visible to all; must ensure no secrets committed

### Decision 2: Two-Workflow Approach
- **Date**: 2024-12-05
- **Decision**: Separate workflows for build-test vs release
- **WHY**: Different triggers and purposes; keeps workflows focused and maintainable
- **Alternatives considered**: Single monolithic workflow (rejected - harder to debug)
- **Impact**: Clearer separation of concerns; easier to maintain

### Decision 3: Manual Marketplace Publishing
- **Date**: 2024-12-05
- **Decision**: Do not auto-publish to VS Code Marketplace in CI
- **WHY**: Requires VSCE_TOKEN secret; want manual control for MVP
- **Alternatives considered**: Full automation (deferred - can add later)
- **Impact**: Releases to GitHub only; marketplace publishing is manual step

### Decision 4: Keep a Changelog Format
- **Date**: 2024-12-05
- **Decision**: Use Keep a Changelog format for CHANGELOG.md
- **WHY**: Industry standard; human-readable; easy to extract release notes
- **Alternatives considered**: Auto-generated from commits (rejected - less readable)
- **Impact**: Manual CHANGELOG updates required; but better quality

---

## Key Findings

### Finding 1: WSL gh CLI Required
The `gh` CLI in Windows PowerShell had issues, but WSL Ubuntu profile worked perfectly.

### Finding 2: LF vs CRLF Warnings
Git warned about line endings (LF→CRLF). This is expected on Windows and safe to ignore.

### Finding 3: Workflow Naming Matters
Using descriptive workflow names ("Build and Test" vs "Release") makes GitHub Actions tab much clearer.

---

## Handoff Notes

### For Next Agent
- Current state: Repository live, CI functional, documentation complete
- What's working: 
  - GitHub Actions workflows passing
  - Version scripts ready
  - Branch structure (main, develop) established
- What's blocked: None
- Next steps:
  1. Manually configure branch protection rules on GitHub
  2. Add VSCE_TOKEN secret for marketplace auto-publish (optional)
  3. Create first release using `npm run release:minor`
- Watch out for: 
  - First release should be done from a release branch per protocol
  - Test release workflow with a pre-release tag first

### Context Needed
- Key files: `.github/workflows/*.yml`, `docs/RELEASE_PROCESS.md`
- Key concepts: SemVer 2.0.0, Git Flow, Conventional Commits
- GitHub Actions: https://github.com/mikehenken/CaaPM/actions

---

## Questions Raised

- [x] Question 1: Should we auto-publish to marketplace? - Status: resolved
  - Answer: Not yet; manual for MVP

- [x] Question 2: Protect main branch? - Status: resolved
  - Answer: Yes, but manual GitHub settings required

---

## Session Log

### Session 1 - 2024-12-05
- **Agent**: cursor-agent
- **Duration**: Full implementation
- **Progress**: Created rules, repository, CI/CD, documentation
- **Blockers**: None

