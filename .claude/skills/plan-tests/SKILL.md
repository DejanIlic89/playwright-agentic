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

## Constraints

1. Do not modify application or test code.
2. Do not execute tests.
3. Do not commit, push, or open a pull request.
4. Planning does not authorize implementation.
