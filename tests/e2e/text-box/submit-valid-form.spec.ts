import { test, expect } from '../../../src/fixtures/ui.fixture.js';

test('displays submitted name and email', async ({ textBoxPage }) => {
    await textBoxPage.open();
    await textBoxPage.fillForm('Dejan Ilic', 'dejan@example.com');
    await textBoxPage.submit();

    await expect(textBoxPage.output).toBeVisible();
    await expect(textBoxPage.submittedName).toHaveText('Name:Dejan Ilic');
    await expect(textBoxPage.submittedEmail).toHaveText('Email:dejan@example.com');
});
