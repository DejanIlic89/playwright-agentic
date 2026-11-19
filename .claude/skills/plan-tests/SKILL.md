---
name: plan-tests
description: Plans focused UI or API test scenarios before implementation.
argument-hint: '[feature and requested behavior]'
disable-model-invocation: true
---

# Plan tests

## Scope

$ARGUMENTS

## Preparation

1. Read CLAUDE.md.
2. Read the relevant existing tests and supporting code: fixtures,
   page objects, API clients, schemas, and configuration.
3. Identify existing coverage before proposing new scenarios.

## Analysis

1. Separate user-supplied requirements, observed application behavior,
   and assumptions.
2. Do not treat observed behavior as proof of correct behavior.
3. Use Playwright MCP for UI exploration only when requested.
4. If requirements are unclear, identify the specific missing decision.

## Scenarios

For each proposed scenario, provide:

- An English test title.
- Preconditions and test data.
- Main actions.
- Expected results and the source of those expectations.
- Existing fixtures, page objects, clients, or schemas to reuse.
- Minimal supporting changes needed.
- Priority and a brief justification.

Keep plans focused:

- Prefer a small number of valuable scenarios.
- Avoid duplicating existing coverage.
- Respect the one-scenario-per-spec convention.
- Do not propose abstractions without a concrete need.
- Identify known application defects separately.

## Scenario IDs

- Scenario IDs are global across all plans: `TC-001`, `TC-002`, and so on.
- Before assigning IDs, inspect `docs/test-plans/` and `docs/coverage.md`
  for IDs already in use.
- Reuse the existing ID for a scenario that is already documented.
- Assign the next unused number to a new scenario.
- Never renumber existing scenarios or reuse retired IDs.

## Output

- By default, return the plan in the conversation only.
- Save the plan only when explicitly asked. Then write only:
  - the relevant `docs/test-plans/<feature>.md` document, and
  - the related entries in `docs/coverage.md`.
- In `docs/coverage.md`, use the statuses Planned, Implemented, and Blocked.
- Do not mark a scenario Implemented without inspecting its test assertions.
  Implemented means coverage exists in code, not that a run passed.
- Do not record execution results or coverage percentages.
- Mark proposed scenarios that lack an agreed requirement as proposed and
  requiring acceptance.

## Constraints

1. Do not write or modify any file, except the documentation allowed by
   the Output section when explicitly asked to save a plan.
2. Do not modify application or test code.
3. Do not execute tests.
4. Do not commit, push, or open a pull request, or make other remote writes.
5. Planning does not authorize implementation.
