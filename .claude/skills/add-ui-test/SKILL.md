---
name: add-ui-test
description: Explore a UI scenario with Playwright MCP, implement it using this project's patterns, and run validation.
argument-hint: '<page URL and scenario with expected results>'
disable-model-invocation: true
---

# Add a UI test

## Task

$ARGUMENTS

## Preparation

1. Read CLAUDE.md.
2. Check the current branch and git status.
3. If on main, ask for a dedicated branch before editing.
4. Preserve unrelated changes.
5. Inspect relevant tests, page objects, fixtures, and configuration.
6. Check for existing coverage to avoid duplicate tests.

## Browser exploration

1. Use Playwright MCP to inspect the target page.
2. Exercise the requested scenario.
3. Verify locators against the actual DOM and accessibility information.
4. Separate observed behavior from the user's expected behavior.
5. If expected behavior is missing or ambiguous, clarify it before coding.
6. If MCP is unavailable, report the issue instead of inventing locators.

## Implementation

1. Follow the existing project conventions.
2. Reuse or extend page objects and the custom UI fixture.
3. Use getters for locators and keep business assertions in tests.
4. Add one scenario per spec file.
5. Keep changes limited to the requested scenario.
6. Do not weaken assertions, skip failures, or change application state
   through JavaScript to make a test pass.

## Validation

1. Run pnpm run typecheck.
2. Run the new or changed test with --project=e2e.
3. Run pnpm run test:e2e.
4. Investigate failures using the error output and available traces.
5. Distinguish application defects, test defects, and environment issues.
6. Review the complete diff, including new files.

## Completion

Report:

- Files changed and the behavior covered.
- Commands executed and their actual results.
- Remaining failures, limitations, or unverified assumptions.

Do not commit, push, open a pull request, or merge unless explicitly requested.
