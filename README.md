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
