# playwright-agentic

## Environment configuration

Base URLs are configured in `src/config/env.ts` and validated at startup.

| Variable       | Used by       | Default                                |
| -------------- | ------------- | -------------------------------------- |
| `UI_BASE_URL`  | `e2e` project | `https://demoqa.com`                   |
| `API_BASE_URL` | `api` project | `https://jsonplaceholder.typicode.com` |

Defaults apply only when a variable is not defined. Empty values, invalid
URLs, and protocols other than HTTP or HTTPS fail the run before tests start.

### Optional .env file

To override the URLs locally, create a `.env` file in the repository root:

```powershell
Copy-Item .env.example .env
```

Then edit the values in `.env`. The file is ignored by Git. Variables already
set in the process environment take precedence over values in `.env`.

### GitHub Actions

GitHub Actions can supply these variables directly through the workflow or job
`env` settings. No `.env` file is required in CI.

## Mocking demo

The `mocking` project runs UI tests from `tests/mocking/` against a small local
demo app in `demo/`. Run it with:

```powershell
pnpm run test:mocking
```

Playwright starts the demo server at `http://127.0.0.1:4173` automatically and
stops it when the run finishes. Do not start it separately.

The test intercepts the page's request to
`https://jsonplaceholder.typicode.com/posts/1` and fulfills it with a controlled
response. It verifies how the UI behaves with that response, such as rendering
the post title. It does not verify the real API; the `api` project covers that.

The current shared configuration defines one top-level `webServer`, so
Playwright starts the local demo server for every project, including `e2e` and
`api`. Port 4173 must be available for any test run.
