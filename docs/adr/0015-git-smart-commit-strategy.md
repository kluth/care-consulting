# ADR-0015: Smart Atomic Committing Strategy

## Status

Accepted

## Date

2026-01-16

## Context

Developers often accumulate significant uncommitted changes across multiple features or fixes. Committing these as a single "WIP" or "Update" commit violates best practices, makes history hard to read, and complicates cherry-picking or reverting specific changes. We need an automated way to break these down into atomic, verified, conventional commits.

## Research Findings

### Option 1: Naive File Grouping

Group files by directory.

- **Pros:** Fast, simple.
- **Cons:** Often breaks logical dependencies (e.g., a component and its service might be in different directories but need to be in the same commit).

### Option 2: Interactive Staging (git add -p)

Manual selection of chunks.

- **Pros:** Precise.
- **Cons:** Extremely time-consuming for large changesets.

### Option 3: "Smart Stash" Workflow (Selected)

1. Analyze all changes (LLM-based grouping).
2. Stage a group.
3. Stash everything else (keep index).
4. Run validation (Build/Test/Lint).
5. If valid -> Commit. If invalid -> Unstash and try merging with another group or warn user.
6. Repeat until clean.

## Decision

We will implement **Option 3** as a new Gemini Skill (`git-smart-commit`).

## Rationale

- **Integrity:** By stashing unstaged changes (`git stash --keep-index`), we verify that the commit _actually works_ in isolation, preventing "broken builds" in the history.
- **Quality:** It enforces Conventional Commits (`feat(scope): ...`) via LLM generation.
- **Automation:** Reduces a 30-minute manual cleanup task to a 2-minute supervision task.

## Tooling

- **Husky:** We will rely on existing project Husky hooks (pre-commit) to enforce linting/testing during the commit command. The skill will not bypass these verification hooks.
- **Git Native:** We rely on standard `git` commands for maximum compatibility.

## Consequences

- **Positive:** Cleaner git history, verifiable intermediate states.
- **Negative:** Slower execution time due to repeated testing/stashing cycles.
