# Test plan: Post viewer

## Feature

The Post viewer is the local demo app in `demo/` (page:
[`demo/posts/index.html`](../../demo/posts/index.html)). Clicking **Load post**
fetches `https://jsonplaceholder.typicode.com/posts/1` and renders the post
title as a level-2 heading. While the request is pending, the status region
shows `Loading...` and the button is disabled. On a non-OK HTTP status or a
rejected request, the page shows an alert with the text `Unable to load post`.

Tests run in the `mocking` Playwright project. Every test intercepts the post
request with `page.route()`, so the real API is never reached. These tests
verify UI behavior for controlled responses; they do not verify the real API.

Implementation status for each scenario is tracked in the
[coverage overview](../coverage.md).

## Requirement provenance

No written requirements for the Post viewer exist in the repository. The
commits that added the demo and its tests (#26, #27, #28) have no description
beyond their titles. Unless a scenario says otherwise:

- **Requirement source** names where the scenario comes from, not an agreed
  specification.
- **Expected results** describe current application behavior, read from
  `demo/posts/index.html` and the existing test assertions. Current behavior
  is not proof of correct behavior.

## Scenarios

### TC-001

| Field              | Value                                                                                                                                                                                       |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Title              | Displays the post title from a mocked API response                                                                                                                                          |
| Requirement source | No documented requirement. Scenario established by the existing test (commit #26). Expected results reflect current behavior.                                                               |
| Preconditions      | The post request is intercepted before navigation. The page is loaded at `/`.                                                                                                               |
| Test data          | HTTP 200 with `{ id: 1, userId: 1, title: 'Mocked post title', body: 'Controlled response for the UI test.' }`.                                                                             |
| Actions            | 1. Open the page. 2. Click **Load post**.                                                                                                                                                   |
| Expected results   | Before the click: no level-2 heading, no intercepted request. After the click: a level-2 heading named exactly `Mocked post title` is visible, no alert, button enabled, exactly one `GET`. |
| Implementation     | [`displays-mocked-post-title.spec.ts`](../../tests/mocking/posts/displays-mocked-post-title.spec.ts)                                                                                        |

Not asserted: the status region after loading, and the post `body` (the demo
does not render it).

### TC-002

| Field              | Value                                                                                                                                |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| Title              | Displays an error when the API returns HTTP 500                                                                                      |
| Requirement source | No documented requirement. Scenario established by the existing test (commit #27). Expected results reflect current behavior.        |
| Preconditions      | The post request is intercepted before navigation. The page is loaded at `/`.                                                        |
| Test data          | HTTP 500 with a valid post body (`title: 'This title must not be displayed'`), so only the status makes the response unsuccessful.   |
| Actions            | 1. Open the page. 2. Click **Load post**.                                                                                            |
| Expected results   | An alert is visible with the text `Unable to load post`. No level-2 heading. Button enabled. Status region empty. Exactly one `GET`. |
| Implementation     | [`displays-error-on-http-500.spec.ts`](../../tests/mocking/posts/displays-error-on-http-500.spec.ts)                                 |

Not asserted: the state before the click. Other non-OK statuses (for example 404) are not covered.

### TC-003

| Field              | Value                                                                                                                                                                                             |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Title              | Displays an error when the post request fails at the network level                                                                                                                                |
| Requirement source | Scenario named by the user in the 2026-11-20 planning request. No documented requirement. Expected results are not user-supplied; they reflect current behavior (the `catch` branch in the demo). |
| Preconditions      | The post request is intercepted before navigation. The page is loaded at `/`.                                                                                                                     |
| Test data          | The request is aborted with `route.abort()` (for example, error code `failed`). No response is returned.                                                                                          |
| Actions            | 1. Open the page. 2. Click **Load post**.                                                                                                                                                         |
| Expected results   | An alert is visible with the text `Unable to load post`. No level-2 heading. Button enabled. Status region empty. Exactly one `GET` intercepted.                                                  |
| Implementation     | None. No network-failure spec exists in `tests/mocking/posts/`.                                                                                                                                   |

The request asked for this scenario to be documented as existing, but no test
for it was found. It is documented here as planned, not implemented.

### TC-004

| Field              | Value                                                                                                                                                                                                                                       |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Title              | Shows loading state while the API response is pending                                                                                                                                                                                       |
| Requirement source | No documented requirement. Scenario established by the existing test (commit #28). Expected results reflect current behavior.                                                                                                               |
| Preconditions      | The post request is intercepted before navigation. The route handler holds the request until the test releases it. The page is loaded at `/`.                                                                                               |
| Test data          | HTTP 200 with `{ id: 1, userId: 1, title: 'Post loaded after waiting', body: 'Controlled pending response.' }`, fulfilled only after release.                                                                                               |
| Actions            | 1. Open the page. 2. Click **Load post**. 3. Wait until the request is intercepted. 4. Check the pending state. 5. Release the response.                                                                                                    |
| Expected results   | While pending: status `Loading...`, button disabled, no level-2 heading, no alert. After release: a level-2 heading named exactly `Post loaded after waiting` is visible, status region empty, button enabled, no alert. Exactly one `GET`. |
| Implementation     | [`shows-loading-state-while-pending.spec.ts`](../../tests/mocking/posts/shows-loading-state-while-pending.spec.ts)                                                                                                                          |

Not asserted: the loading state for a request that ends in an error.

### TC-005 (proposed)

**Status: Proposed. Requires acceptance before implementation.** This is not
an agreed requirement.

| Field              | Value                                                                                                                                                                                                                                |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Title              | Clears the previous error after a successful retry                                                                                                                                                                                   |
| Requirement source | Proposed in the 2026-11-20 planning request. Not accepted. The demo currently clears the error at the start of each load, but that is observed behavior, not a requirement.                                                          |
| Preconditions      | The post request is intercepted before navigation. The first request fails; the second succeeds. The page is loaded at `/`.                                                                                                          |
| Test data          | First request: HTTP 500 with a valid post body. Second request: HTTP 200 with a post whose title differs from the first body.                                                                                                        |
| Actions            | 1. Open the page. 2. Click **Load post**. 3. Wait for the error alert. 4. Click **Load post** again.                                                                                                                                 |
| Expected results   | After the first click: the alert `Unable to load post` is visible. After the second click: no alert, a level-2 heading with the second response's title is visible, button enabled, status region empty. Exactly two `GET` requests. |
| Implementation     | None. Do not implement until accepted.                                                                                                                                                                                               |

Open decisions for acceptance:

- Whether the first failure should be HTTP 500, a network failure, or both
  (parameterized).
- Whether the error must disappear as soon as the retry starts, or only once
  the retry succeeds.
