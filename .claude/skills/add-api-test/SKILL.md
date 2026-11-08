---
name: add-api-test
description: Implement and validate an API test using this project's fixtures, clients, and schemas.
argument-hint: "<HTTP method, endpoint, scenario, and expected results>"
disable-model-invocation: true
---

# Add an API test

## Task

$ARGUMENTS

## Preparation

1. Read CLAUDE.md.
2. Check the current branch and git status.
3. If on main, ask for a dedicated branch before editing.
4. Preserve unrelated changes.
5. Inspect existing API tests, clients, the custom API fixture, and schemas.
6. Check for existing coverage to avoid duplicate tests.

## Requirements

1. Identify the HTTP method, endpoint, request data, and expected response
   (status, body, and relevant headers).
2. If expected behavior is missing or ambiguous, clarify it before coding.
3. Consult the official API documentation when needed.
   Observed responses alone do not establish requirements.
4. Separate documented behavior from observed behavior.

## Implementation

1. Follow the existing project conventions.
2. Reuse or extend API clients and the custom API fixture.
3. Reuse or extend Zod schemas for response validation where applicable.
4. Keep business assertions in tests, not in clients.
5. Add one scenario per spec file and parameterize equivalent cases.
6. Keep tests independent. JSONPlaceholder simulates writes, so do not
   assume created, updated, or deleted data persists between requests.
7. Keep changes limited to the requested scenario.

## Validation

1. Run pnpm run typecheck.
2. Run the new or changed test with --project=api.
3. Run pnpm run test:api.
4. Investigate failures using the error output and response details.
5. Distinguish API behavior, test defects, and environment issues.
6. Do not weaken assertions or skip tests to make the suite pass.
7. Review the complete diff, including new files.

## Completion

Report:
- Files changed and the behavior covered.
- Commands executed and their actual results.
- Remaining failures, limitations, or unverified assumptions.

Do not commit, push, open a pull request, or merge unless explicitly requested.
