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

### TC-005

| Field              | Value                                                                                                                                                                                                                                                                                                                                                                                           |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Title              | Successfully loads a post after an HTTP error                                                                                                                                                                                                                                                                                                                                                   |
| Requirement source | Proposed in the 2026-11-20 planning request as "Clears the previous error after a successful retry". Accepted, with acceptance criteria, in the 2026-11-26 implementation request, which settled the open decisions: the first failure is HTTP 500 only, and the error must be hidden once the retry succeeds. Expected results come from those acceptance criteria and match current behavior. |
| Preconditions      | The post request is intercepted before navigation. The first request returns HTTP 500; the second returns HTTP 200. The page is loaded at `/` once and is not reloaded between attempts.                                                                                                                                                                                                        |
| Test data          | First request: HTTP 500 with a valid post body (`title: 'This title must not be displayed'`). Second request: HTTP 200 with `{ id: 1, userId: 1, title: 'Post loaded after retry', body: 'Controlled successful response for the second attempt.' }`.                                                                                                                                           |
| Actions            | 1. Open the page. 2. Click **Load post**. 3. Check the error state. 4. Click the same **Load post** button again.                                                                                                                                                                                                                                                                               |
| Expected results   | After the first click: an alert is visible with the text `Unable to load post`, no level-2 heading, button enabled, status region empty. After the second click: a level-2 heading named exactly `Post loaded after retry` is visible, the alert is hidden, button enabled, status region empty. Exactly two intercepted requests, both `GET`.                                                  |
| Implementation     | [`successfully-loads-post-after-http-error.spec.ts`](../../tests/mocking/posts/successfully-loads-post-after-http-error.spec.ts)                                                                                                                                                                                                                                                                |

Not asserted: whether the error disappears as soon as the retry starts (only
its absence after success is checked), and a network failure as the first
attempt.
