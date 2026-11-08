import { test, expect } from '../../../src/fixtures/ui.fixture.js';

const invalidEmailCases = [
  {
    name: 'missing at sign',
    email: 'invalid-email',
  },
  {
    name: 'missing local part',
    email: '@example.com',
  },
  {
    name: 'missing domain',
    email: 'dejan@',
  },
];

for (const { name, email } of invalidEmailCases) {
  test(`rejects an email with ${name}`, async ({ textBoxPage }) => {
    await textBoxPage.open();
    await textBoxPage.fillForm('Dejan Ilic', email);
    await textBoxPage.submit();

    await expect(textBoxPage.emailInput).toHaveClass(/field-error/);
    await expect(textBoxPage.output).not.toBeVisible();
  });
}
