---
name: diagnose-test
description: Investigate a failing Playwright UI or API test and report an evidence-based diagnosis without changing project files.
argument-hint: '<test path, project, and optional error or artifact path>'
disable-model-invocation: true
---

# Diagnose a failing test

## Investigation input

$ARGUMENTS

## Preparation

1. Read CLAUDE.md.
2. Check the current branch and git status.
3. Identify the failing test, its project (e2e or api), the reported
   error, and any artifact paths provided.
4. If the test or project cannot be determined from the input, ask
   instead of guessing.
5. Read the failing spec and the relevant fixtures, page objects,
   API clients, schemas, and playwright.config.ts.

## Existing evidence

1. Inspect existing failure artifacts before rerunning anything:
   - Error output and logs provided in the input.
   - test-results/ (error-context.md, screenshots, traces).
   - playwright-report/ if present.
2. Open traces with `pnpm exec playwright show-trace <trace.zip>` or
   read their contents when possible.
3. Preserve existing failure artifacts. A new run clears test-results/
   and overwrites playwright-report/, so before rerunning:
   - Use a separate output directory, for example
     `--output=test-results-diagnosis`.
   - Use `--reporter=list` to avoid overwriting the HTML report.
4. If an artifact is unavailable or unreadable, record that. Do not
   claim to have inspected it.

## Reproduction

1. Rerun only if existing evidence is insufficient.
2. Run only the affected test with retries disabled, for example:
   `pnpm exec playwright test <spec path> --project=<project> --retries=0 --reporter=list --output=test-results-diagnosis`
3. For UI failures, add `--trace=on` to that run.
4. Do not repeatedly rerun without a specific hypothesis. State the
   hypothesis before each additional run and what result would
   confirm or reject it.
5. Note whether the failure reproduced, and whether it is consistent
   or intermittent across the runs actually performed.

## Browser inspection

1. Use Playwright MCP when needed to inspect current UI behavior,
   locators, DOM, and accessibility information.
2. Clearly distinguish current browser observations from evidence
   captured during the failing run. The application may have changed,
   or the failure may depend on timing, data, or state.
3. If MCP is unavailable, report it instead of inventing observations.

## Analysis

1. Compare expected and actual behavior.
2. Do not assume the test expectation is wrong just because the
   application behaves differently. Check the scenario intent and,
   for API tests, the official documentation.
3. Classify the likely cause:
   - Test implementation
   - Application behavior
   - Test data or shared state
   - Environment or external dependency
   - Insufficient evidence
4. Support the diagnosis with specific evidence and file references
   (path and line number).
5. State uncertainty and alternative explanations where relevant.
6. Propose the smallest appropriate correction or the next diagnostic
   step.

## Constraints

1. Do not modify project code, configuration, or dependencies.
2. Do not weaken assertions, skip tests, add fixed sleeps, force
   interactions, or increase timeouts merely to get a passing result,
   including in proposed corrections.
3. Do not claim to have inspected an artifact that was unavailable.
4. Do not commit, push, open a pull request, or merge.

Execution may create normal test artifacts.

## Report

- Failing test and reproduction command.
- Evidence inspected, and evidence that was unavailable.
- Expected versus actual behavior.
- Likely cause, classification, and confidence (high, medium, or low).
- Proposed correction or next diagnostic step.
- Commands actually run and their results.
