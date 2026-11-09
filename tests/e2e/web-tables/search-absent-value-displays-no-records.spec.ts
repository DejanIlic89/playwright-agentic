import { test, expect } from '../../../src/fixtures/ui.fixture.js';
import { createWebTableRecord } from '../../../src/data/web-table-record.factory.js';

const record = createWebTableRecord({
  firstName: 'Absent',
  lastName: 'Searcher',
  email: 'absent.searcher@example.test',
  age: '36',
  salary: '4700',
  department: 'Analytics',
});

const absentSearchTerm = 'no-match-search-7x9q';

test('searching for an absent value displays no records', async ({
  webTablesPage,
}) => {
  await webTablesPage.open();

  await webTablesPage.openAddDialog();
  await webTablesPage.fillRegistrationForm(record);
  await webTablesPage.submit();
  await expect(webTablesPage.registrationDialog).toBeHidden();

  const addedRow = webTablesPage.rowByEmail(record.email);
  await expect(addedRow).toHaveCount(1);

  // Guards against a vacuous pass: the term must not match any existing data.
  const cellTexts = await webTablesPage
    .cellsOf(webTablesPage.populatedRows)
    .allInnerTexts();
  expect(cellTexts.map((text) => text.trim())).toContain(record.email);
  for (const text of cellTexts) {
    expect(text.toLowerCase()).not.toContain(absentSearchTerm.toLowerCase());
  }

  await webTablesPage.searchInput.fill(absentSearchTerm);

  await expect(webTablesPage.searchInput).toHaveValue(absentSearchTerm);
  await expect(webTablesPage.table).toBeVisible();
  await expect(webTablesPage.populatedRows).toHaveCount(0);
  await expect(addedRow).toHaveCount(0);
});
