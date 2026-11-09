---
name: review-tests
description: Review test changes for correctness, reliability, and adherence to project conventions without modifying files.
argument-hint: '[review scope, defaults to changes against origin/main]'
disable-model-invocation: true
---

# Review tests

This skill has two parts:

- Part 1 is for the parent agent only. It collects evidence and
  delegates the review.
- Part 2 is for the test-reviewer subagent only. It defines the review
  checklist and reporting rules.

If you are the test-reviewer subagent, skip Part 1. Do not delegate.
Apply Part 2 to the task the parent supplied.

## Scope

$ARGUMENTS

If no scope is given, review the current branch against origin/main.

## Part 1: Parent orchestration (parent agent only)

Do not perform the review yourself. Collect evidence, delegate, and
relay the result.

### Collect evidence

1. Read CLAUDE.md.
2. Record the current branch and git status.
3. Identify the review scope:
   - By default, collect the committed branch diff with
     git diff origin/main...HEAD.
   - Collect the staged diff with git diff --cached.
   - Collect the unstaged diff with git diff.
   - List relevant untracked file paths with
     git ls-files --others --exclude-standard.
   - If the comparison ref is unavailable, report it instead of
     silently choosing another base.
   - For a baseline review of existing files, record the file paths
     and state that no diff applies.

### Delegate

1. Delegate the review to the test-reviewer subagent. Provide:
   - The review scope and the affected file paths.
   - The acceptance criteria supplied by the user, verbatim. If the
     user supplied none, say so.
   - The available evidence: branch, git status, diffs, untracked
     file paths, and any user-supplied logs, reports, or check results.
2. Do not pass conclusions from earlier reviews as facts. Pass only
   the user's criteria and the collected evidence.
3. Do not add your own findings to the reviewer's task.

### Relay

1. Return the reviewer's findings and verification limitations.
2. Clearly distinguish the reviewer's report from anything you add.
3. If delegation fails or the reviewer returns no report, report the
   failure. Do not silently review the changes as the parent.

## Part 2: Review instructions (test-reviewer only)

### Preparation

1. Read CLAUDE.md.
2. Treat the scope, acceptance criteria, and evidence supplied by the
   parent as the review task.
3. Read the complete affected files, not only the diff hunks.
4. Read the relevant fixtures, page objects, API clients, schemas,
   and configuration the changes depend on.
5. Inspect any supplied diffs, logs, reports, or other artifacts.

### Checklist

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

### Constraints

1. Do not modify files, run commands, or execute tests.
2. Clearly distinguish check results supplied as evidence from
   conclusions drawn by reading code.
3. Do not commit, push, open a pull request, or merge.

### Report

1. List findings first, ordered by severity. For each, include the file
   path, line number, impact, and a suggested correction.
2. List optional improvements separately from findings.
3. Assess each acceptance criterion separately from the findings.
4. If no concrete issues are found, say so.
5. State remaining verification limitations.
