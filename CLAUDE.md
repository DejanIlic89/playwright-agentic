# Project overview

Playwright and TypeScript framework for UI and API testing.
Use pnpm for package management.

## Applications

- UI: https://demoqa.com
- API: https://jsonplaceholder.typicode.com
- JSONPlaceholder simulates writes; created data does not persist.

## Structure

- tests/e2e/: UI tests.
- tests/api/: API tests.
- src/pages/: page objects.
- src/api/: API clients.
- src/fixtures/: custom Playwright fixtures.
- src/schemas/: Zod response schemas.

## Conventions

- Write code, test titles, and comments in English.
- Use one scenario per spec file.
- Parameterize cases that exercise the same scenario.
- Use the existing custom fixtures for UI and API tests.
- Reuse existing page objects, API clients, and schemas.
- Define page object locators with getters.
- Keep business assertions in tests.
- Use only Chromium for UI tests.
- Keep the Playwright project names: e2e and api.

## Test reliability

- Prefer role and label locators when accessible names are available.
- Use placeholders when fields do not have associated labels.
- Use stable CSS selectors when semantic locators are unavailable.
- Use locator actions and Playwright's auto-retrying assertions.
- Do not use fixed sleeps or networkidle as general readiness checks.
- Keep tests independent and safe to run in parallel.
- Never weaken assertions or skip tests just to make a run pass.

## Commands

- pnpm run typecheck
- pnpm run test:e2e
- pnpm run test:e2e:headed
- pnpm run test:api
- pnpm run report

## Working process

- Inspect relevant files before making changes.
- Follow existing patterns and keep changes focused.
- Run typecheck and the affected tests after changes.
- Report what changed, what was verified, and any remaining failures.
- Never claim a check passed unless it was actually run.