# Release Process

This document outlines the complete release process for the Cursor Agent PM extension.

## Prerequisites

- Write access to the repository
- npm installed locally
- `gh` CLI configured (optional, for PR creation)
- VS Code extension publishing token (for marketplace releases)

## Version Types

### Patch Release (Bug Fixes)
Format: `v1.2.3 → v1.2.4`

**When to use:**
- Bug fixes
- Security patches
- Documentation updates
- Performance improvements (non-breaking)

### Minor Release (New Features)
Format: `v1.2.0 → v1.3.0`

**When to use:**
- New features (backward-compatible)
- New commands or views
- Enhanced functionality

### Major Release (Breaking Changes)
Format: `v1.0.0 → v2.0.0`

**When to use:**
- Breaking changes
- API removals or renames
- Configuration schema changes
- Major architectural rewrites

## Standard Release Process

### Step 1: Prepare Release Branch

```bash
# Ensure develop is up to date
git checkout develop
git pull origin develop

# Create release branch
git checkout -b release/v1.3.0
```

### Step 2: Update CHANGELOG.md

Edit `CHANGELOG.md` to document all changes:

```markdown
## [1.3.0] - 2024-12-05

### Added
- New kanban drag-and-drop feature
- Archive confirmation dialog

### Fixed
- Search crash on empty query
- Markdown rendering issues

### Changed
- Improved UI contrast ratios
```

### Step 3: Bump Version

```bash
# For minor release
npm run version:minor

# For patch release
npm run version:patch

# For major release
npm run version:major
```

This will:
- Update `package.json` version
- Create a git commit
- Create a git tag

### Step 4: Final Verification

```bash
# Run full test suite
npm run lint
npm run check-types
npm run compile

# Test extension locally
# Press F5 in VS Code to launch Extension Development Host
```

### Step 5: Push Release Branch

```bash
git push origin release/v1.3.0
```

### Step 6: Create PR to Main

```bash
# Using gh CLI
gh pr create \
  --base main \
  --head release/v1.3.0 \
  --title "chore: release v1.3.0" \
  --body "Release version 1.3.0

See CHANGELOG.md for details."
```

Or create PR manually on GitHub.

### Step 7: Merge to Main

1. Wait for CI checks to pass
2. Get PR approval (if required)
3. Merge PR using "Create a merge commit" (not squash)
4. **DO NOT** delete the release branch yet

### Step 8: Push Tag

```bash
# After PR is merged
git checkout main
git pull origin main

# Tag should already exist from npm version command
# Push the tag to trigger release workflow
git push origin v1.3.0
```

### Step 9: Monitor Release Workflow

1. Go to GitHub Actions tab
2. Watch "Release" workflow
3. Verify it completes successfully
4. Check that GitHub Release is created
5. Verify .vsix artifact is attached

### Step 10: Merge Back to Develop

```bash
git checkout develop
git merge --no-ff release/v1.3.0
git push origin develop

# Now delete release branch
git branch -d release/v1.3.0
git push origin --delete release/v1.3.0
```

### Step 11: Verify Release

1. Download `.vsix` from GitHub Release
2. Install in VS Code: `code --install-extension cursor-agent-pm-1.3.0.vsix`
3. Test core functionality
4. Verify version shows correctly in Extensions panel

## Quick Release Commands

For simple releases without a release branch (use with caution):

```bash
# From develop branch
git checkout develop
git pull origin develop

# Update CHANGELOG.md manually

# Bump version and push
npm run release:patch   # For patch release
npm run release:minor   # For minor release
npm run release:major   # For major release
```

This will:
1. Bump version in package.json
2. Create commit and tag
3. Push to origin (including tags)
4. Trigger release workflow

## Hotfix Release Process

For critical production bugs:

### Step 1: Create Hotfix Branch

```bash
git checkout main
git pull origin main
git checkout -b hotfix/v1.2.1
```

### Step 2: Fix Bug

```bash
# Make the fix
git add .
git commit -m "fix: critical security vulnerability in auth"
```

### Step 3: Update CHANGELOG.md

```markdown
## [1.2.1] - 2024-12-05

### Fixed
- Critical security vulnerability in authentication
```

### Step 4: Bump Patch Version

```bash
npm run version:patch
```

### Step 5: Push and Create PR to Main

```bash
git push origin hotfix/v1.2.1

gh pr create \
  --base main \
  --head hotfix/v1.2.1 \
  --title "fix: critical security patch v1.2.1" \
  --label "hotfix" \
  --body "Emergency security fix"
```

### Step 6: Merge and Push Tag

```bash
# After PR approved and merged
git checkout main
git pull origin main
git push origin v1.2.1
```

### Step 7: Merge to Develop

```bash
git checkout develop
git merge --no-ff hotfix/v1.2.1
git push origin develop

# Delete hotfix branch
git branch -d hotfix/v1.2.1
git push origin --delete hotfix/v1.2.1
```

## Pre-release Process

For alpha, beta, or RC versions:

### Create Pre-release

```bash
git checkout develop

# For first beta of next minor version
npm run version:preminor  # 1.2.0 → 1.3.0-beta.0

# For subsequent betas
npm run version:prerelease  # 1.3.0-beta.0 → 1.3.0-beta.1

# Push
git push origin develop --follow-tags
```

### Release Workflow

The release workflow automatically detects pre-releases and marks them as such on GitHub.

## Troubleshooting

### Tag Already Exists

```bash
# Delete local tag
git tag -d v1.2.3

# Delete remote tag
git push origin :refs/tags/v1.2.3

# Recreate tag
git tag -a v1.2.3 -m "Release v1.2.3"
git push origin v1.2.3
```

### Failed Release Workflow

1. Check GitHub Actions logs
2. Fix the issue
3. Delete the failed release on GitHub
4. Delete the tag (see above)
5. Re-create and push the tag

### Version Mismatch

```bash
# Reset to correct version
npm version 1.2.3 --no-git-tag-version

# Commit
git add package.json package-lock.json
git commit -m "chore: fix version to 1.2.3"
```

## Checklist Templates

### Minor/Major Release Checklist

- [ ] Create release branch from develop
- [ ] Update CHANGELOG.md with all changes
- [ ] Run `npm run version:minor` (or major)
- [ ] Test extension locally (F5)
- [ ] Run full CI checks locally
- [ ] Push release branch
- [ ] Create PR to main
- [ ] Wait for CI to pass
- [ ] Get PR approval
- [ ] Merge PR to main
- [ ] Push version tag to trigger release
- [ ] Monitor GitHub Actions release workflow
- [ ] Verify GitHub Release created
- [ ] Download and test .vsix
- [ ] Merge release branch back to develop
- [ ] Delete release branch
- [ ] Announce release (if applicable)

### Hotfix Checklist

- [ ] Create hotfix branch from main
- [ ] Fix critical bug
- [ ] Update CHANGELOG.md
- [ ] Run `npm run version:patch`
- [ ] Test fix locally
- [ ] Push hotfix branch
- [ ] Create PR to main with "hotfix" label
- [ ] Get emergency approval
- [ ] Merge PR
- [ ] Push version tag
- [ ] Monitor release workflow
- [ ] Verify fix in released .vsix
- [ ] Merge to develop
- [ ] Delete hotfix branch
- [ ] Post-mortem (if needed)

## CI/CD Workflows

### Build and Test Workflow
**Triggers:** Push/PR to main or develop
**Actions:**
- Install dependencies
- Run linter
- Type check
- Build extension
- Package .vsix
- Upload artifact

### Release Workflow
**Triggers:** Push tag matching `v*`
**Actions:**
- Run all tests
- Package .vsix
- Extract changelog for release notes
- Create GitHub Release
- Upload .vsix artifact
- Publish to VS Code Marketplace (if not pre-release)

## Version Scripts Reference

| Script | Description | Example |
|--------|-------------|---------|
| `npm run version:patch` | Bump patch version | 1.2.3 → 1.2.4 |
| `npm run version:minor` | Bump minor version | 1.2.3 → 1.3.0 |
| `npm run version:major` | Bump major version | 1.2.3 → 2.0.0 |
| `npm run version:prepatch` | Create patch pre-release | 1.2.3 → 1.2.4-beta.0 |
| `npm run version:preminor` | Create minor pre-release | 1.2.3 → 1.3.0-beta.0 |
| `npm run version:premajor` | Create major pre-release | 1.2.3 → 2.0.0-rc.0 |
| `npm run version:prerelease` | Bump pre-release version | 1.3.0-beta.0 → 1.3.0-beta.1 |
| `npm run release:patch` | Version, commit, and push patch | Full cycle |
| `npm run release:minor` | Version, commit, and push minor | Full cycle |
| `npm run release:major` | Version, commit, and push major | Full cycle |

## Best Practices

1. **Always** update CHANGELOG.md before releasing
2. **Always** test the extension locally before pushing tags
3. **Never** push directly to main
4. **Never** skip CI checks
5. **Always** merge release branches back to develop
6. **Always** delete release/hotfix branches after merging
7. **Document** breaking changes thoroughly
8. **Communicate** releases to users/team

## References

- [Semantic Versioning](https://semver.org/)
- [Keep a Changelog](https://keepachangelog.com/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/)

