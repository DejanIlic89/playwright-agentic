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

- pnpm run format
- pnpm run format:check
- pnpm run typecheck
- pnpm run test:e2e
- pnpm run test:e2e:headed
- pnpm run test:api
- pnpm run report

## Working process

- Inspect relevant files before making changes.
- Follow existing patterns and keep changes focused.
- Run format:check, typecheck, and the affected tests after changes.
- Report what changed, what was verified, and any remaining failures.
- Never claim a check passed unless it was actually run.

## Git workflow

- Inspect git status before making changes.
- Make changes on a dedicated branch, never directly on main.
- Use feat/, fix/, or chore/ branch prefixes.
- Preserve unrelated uncommitted changes.
- Run format:check, type checking, and affected tests for code changes.
- Review the diff before committing.
- Push changes and open pull requests only when explicitly requested.
- Target main when opening pull requests.
- Never merge a pull request unless explicitly requested.

## Linting

- ESLint is deferred. typescript-eslint supports only TypeScript <6.1,
  and this project uses TypeScript 7, which has no JavaScript compiler API.
- Revisit when typescript-eslint supports TypeScript 7
  (typescript-eslint issue #10940).
