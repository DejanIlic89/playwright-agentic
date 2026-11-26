# Test coverage overview

This document tracks **scenario coverage**: which planned test scenarios have
tests in the repository. It does not measure **source-code coverage** (lines
or branches executed). No code coverage is collected for this project, and no
coverage percentages are reported here.

## Scope

This overview currently covers only the Post viewer feature. Other framework
areas (the `e2e` UI tests against demoqa.com and the `api` tests against
JSONPlaceholder) have not been inventoried yet and are not listed here.

Scenario details live in the test plans. This document links to them and does
not repeat them.

## Statuses

| Status      | Meaning                                                                                                                      |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Planned     | The scenario is documented but has no test in the repository.                                                                |
| Implemented | A test for the scenario exists in code and its assertions were inspected. This is not proof that the test passes in any run. |
| Blocked     | The scenario cannot be implemented until a stated blocker is resolved.                                                       |

Execution results are not tracked here. Use the Playwright report or CI runs
for those.

## Scenario IDs

Scenario IDs (`TC-001`, `TC-002`, ...) are unique across all test plans.
Assign the next unused number to a new scenario. Never renumber a scenario or
reuse a retired ID.

## Post viewer

Plan: [docs/test-plans/post-viewer.md](test-plans/post-viewer.md)

| ID                                         | Status      | Spec                                                                                                                        | Known gaps                                                                                          |
| ------------------------------------------ | ----------- | --------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| [TC-001](test-plans/post-viewer.md#tc-001) | Implemented | [displays-mocked-post-title.spec.ts](../tests/mocking/posts/displays-mocked-post-title.spec.ts)                             | Status region after loading is not asserted.                                                        |
| [TC-002](test-plans/post-viewer.md#tc-002) | Implemented | [displays-error-on-http-500.spec.ts](../tests/mocking/posts/displays-error-on-http-500.spec.ts)                             | Other non-OK statuses are not covered.                                                              |
| [TC-003](test-plans/post-viewer.md#tc-003) | Planned     | None                                                                                                                        | No network-failure test exists.                                                                     |
| [TC-004](test-plans/post-viewer.md#tc-004) | Implemented | [shows-loading-state-while-pending.spec.ts](../tests/mocking/posts/shows-loading-state-while-pending.spec.ts)               | Loading state for a request that ends in an error is not covered.                                   |
| [TC-005](test-plans/post-viewer.md#tc-005) | Implemented | [successfully-loads-post-after-http-error.spec.ts](../tests/mocking/posts/successfully-loads-post-after-http-error.spec.ts) | Only HTTP 500 is covered as the first failure; the error is not checked while the retry is pending. |

Feature-level gaps not yet planned as scenarios:

- No written requirements exist; expected results reflect current behavior.
- A successful HTTP status with an invalid JSON body is not covered.
