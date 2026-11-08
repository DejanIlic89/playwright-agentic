import { test, expect } from '../../../src/fixtures/ui.fixture.js';

test('selecting and deselecting Notes updates the tree and result', async ({
  checkBoxPage,
}) => {
  await checkBoxPage.open();

  await expect(checkBoxPage.homeNode).toHaveAttribute('aria-expanded', 'false');
  await expect(checkBoxPage.homeCheckbox).toHaveAttribute(
    'aria-checked',
    'false',
  );
  await expect(checkBoxPage.result).not.toBeAttached();

  await checkBoxPage.expandHome();
  await checkBoxPage.expandDesktop();

  await expect(checkBoxPage.notesCheckbox).toBeVisible();
  await expect(checkBoxPage.commandsCheckbox).toBeVisible();

  await checkBoxPage.selectNotes();

  await expect(checkBoxPage.notesCheckbox).toHaveAttribute(
    'aria-checked',
    'true',
  );
  await expect(checkBoxPage.homeCheckbox).toHaveAttribute(
    'aria-checked',
    'mixed',
  );
  await expect(checkBoxPage.desktopCheckbox).toHaveAttribute(
    'aria-checked',
    'mixed',
  );
  await expect(checkBoxPage.commandsCheckbox).toHaveAttribute(
    'aria-checked',
    'false',
  );
  await expect(checkBoxPage.selectedResultItems).toHaveText(['notes']);

  await checkBoxPage.deselectNotes();

  await expect(checkBoxPage.notesCheckbox).toHaveAttribute(
    'aria-checked',
    'false',
  );
  await expect(checkBoxPage.homeCheckbox).toHaveAttribute(
    'aria-checked',
    'false',
  );
  await expect(checkBoxPage.desktopCheckbox).toHaveAttribute(
    'aria-checked',
    'false',
  );
  await expect(checkBoxPage.result).not.toBeAttached();
});
