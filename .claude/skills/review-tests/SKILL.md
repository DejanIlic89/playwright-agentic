---
name: review-tests
description: Review test changes for correctness, reliability, and adherence to project conventions without modifying files.
argument-hint: '[review scope, defaults to changes against origin/main]'
disable-model-invocation: true
---

# Review tests

## Scope

$ARGUMENTS

If no scope is given, review the current branch against origin/main.

## Preparation

1. Read CLAUDE.md.
2. Check the current branch and git status.
3. Identify the review scope:
   - By default, review committed branch changes with
     git diff origin/main...HEAD.
   - Also inspect staged, unstaged, and relevant untracked files.
   - If the comparison ref is unavailable, report it instead of
     silently choosing another base.
4. Read the complete changed files, not only the diff hunks.
5. Read the relevant fixtures, page objects, API clients, schemas,
   and configuration the changes depend on.

## Review

Check:

- Whether assertions cover the requested behavior.
- Missing assertions and false-positive risks.
- Locator uniqueness and stability.
- Synchronization, fixed sleeps, force actions, and flaky patterns.
- Test independence, shared state, and parallel execution.
- API status, response validation, and business assertions.
- Appropriate reuse of existing project abstractions.
- Accidental unrelated changes.

Prioritize concrete defects. Do not invent findings or report personal
style preferences as bugs.

## Constraints

1. Do not modify files or run tests unless explicitly requested.
2. Clearly distinguish check results reported by others from checks
   you ran yourself.
3. Do not commit, push, open a pull request, or merge.

## Report

1. List findings first, ordered by severity. For each, include the file
   path, line number, impact, and a suggested correction.
2. If no concrete issues are found, say so and state any remaining
   verification gaps.
