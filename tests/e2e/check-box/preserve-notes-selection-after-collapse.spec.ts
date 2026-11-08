import { test, expect } from '../../../src/fixtures/ui.fixture.js';

test('collapsing and expanding Desktop preserves the Notes selection', async ({ checkBoxPage }) => {
  await checkBoxPage.open();
  await checkBoxPage.expandHome();
  await checkBoxPage.expandDesktop();
  await checkBoxPage.selectNotes();

  await expect(checkBoxPage.notesCheckbox).toHaveAttribute('aria-checked', 'true');
  await expect(checkBoxPage.selectedResultItems).toHaveText(['notes']);

  await checkBoxPage.collapseDesktop();

  await expect(checkBoxPage.desktopNode).toHaveAttribute('aria-expanded', 'false');
  await expect(checkBoxPage.notesCheckbox).not.toBeVisible();
  await expect(checkBoxPage.desktopCheckbox).toHaveAttribute('aria-checked', 'mixed');
  await expect(checkBoxPage.homeCheckbox).toHaveAttribute('aria-checked', 'mixed');
  await expect(checkBoxPage.selectedResultItems).toHaveText(['notes']);

  await checkBoxPage.expandDesktop();

  await expect(checkBoxPage.desktopNode).toHaveAttribute('aria-expanded', 'true');
  await expect(checkBoxPage.notesCheckbox).toHaveAttribute('aria-checked', 'true');
  await expect(checkBoxPage.commandsCheckbox).toHaveAttribute('aria-checked', 'false');
  await expect(checkBoxPage.desktopCheckbox).toHaveAttribute('aria-checked', 'mixed');
  await expect(checkBoxPage.homeCheckbox).toHaveAttribute('aria-checked', 'mixed');
  await expect(checkBoxPage.selectedResultItems).toHaveText(['notes']);
});
