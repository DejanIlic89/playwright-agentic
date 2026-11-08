import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { z } from 'zod';

const envFilePath = fileURLToPath(new URL('../../.env', import.meta.url));

// The .env file is optional. Existing process variables take precedence.
// Options are explicit so DOTENV_* environment variables cannot change them.
const { error: envFileError } = dotenv.config({
  path: envFilePath,
  override: false,
  encoding: 'utf8',
  quiet: true,
});

if (envFileError && envFileError.code !== 'ENOENT') {
  throw new Error(`Failed to load ${envFilePath}: ${envFileError.message}`);
}

const httpUrl = (defaultUrl: string) =>
  z
    .string()
    .min(1, 'must not be empty')
    .pipe(
      z.url({
        protocol: /^https?$/,
        error: 'must be a valid HTTP or HTTPS URL',
      }),
    )
    .default(defaultUrl);

const envSchema = z.object({
  UI_BASE_URL: httpUrl('https://demoqa.com'),
  API_BASE_URL: httpUrl('https://jsonplaceholder.typicode.com'),
});

const result = envSchema.safeParse({
  UI_BASE_URL: process.env.UI_BASE_URL,
  API_BASE_URL: process.env.API_BASE_URL,
});

if (!result.success) {
  throw new Error(
    `Invalid environment configuration:\n${z.prettifyError(result.error)}`,
  );
}

export type EnvConfig = {
  readonly uiBaseUrl: string;
  readonly apiBaseUrl: string;
};

export const env: EnvConfig = Object.freeze({
  uiBaseUrl: result.data.UI_BASE_URL,
  apiBaseUrl: result.data.API_BASE_URL,
});
