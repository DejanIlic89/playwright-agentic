import { test, expect } from '../../../src/fixtures/ui.fixture.js';

test('selecting Desktop selects Notes and Commands', async ({ checkBoxPage }) => {
  await checkBoxPage.open();
  await checkBoxPage.expandHome();
  await checkBoxPage.expandDesktop();
  await checkBoxPage.selectDesktop();

  await expect(checkBoxPage.desktopCheckbox).toHaveAttribute('aria-checked', 'true');
  await expect(checkBoxPage.notesCheckbox).toHaveAttribute('aria-checked', 'true');
  await expect(checkBoxPage.commandsCheckbox).toHaveAttribute('aria-checked', 'true');
  await expect(checkBoxPage.homeCheckbox).toHaveAttribute('aria-checked', 'mixed');
  await expect(checkBoxPage.documentsCheckbox).toHaveAttribute('aria-checked', 'false');
  await expect(checkBoxPage.downloadsCheckbox).toHaveAttribute('aria-checked', 'false');

  // The display order of the result items is not part of the requirement.
  await expect
    .poll(async () => (await checkBoxPage.selectedResultItems.allTextContents()).sort())
    .toEqual(['commands', 'desktop', 'notes']);
});
