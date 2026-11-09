import { test, expect } from '../../../src/fixtures/ui.fixture.js';
import { createWebTableRecord } from '../../../src/data/web-table-record.factory.js';

const target = createWebTableRecord({
  firstName: 'Target',
  lastName: 'Searcher',
  email: 'target.searcher@example.test',
  age: '29',
  salary: '4200',
  department: 'Research',
});

// The decoy shares the target email's prefix but does not contain
// the complete target email, helping detect filtering that uses
// only that prefix.
const decoy = createWebTableRecord({
  firstName: 'Decoy',
  lastName: 'Searcher',
  email: 'target.searcher.decoy@example.test',
  age: '41',
  salary: '6100',
  department: 'Logistics',
});

test('searching by a complete unique email displays only the matching record', async ({
  webTablesPage,
}) => {
  await webTablesPage.open();

  for (const record of [target, decoy]) {
    await webTablesPage.openAddDialog();
    await webTablesPage.fillRegistrationForm(record);
    await webTablesPage.submit();
    await expect(webTablesPage.registrationDialog).toBeHidden();
  }

  const targetRow = webTablesPage.rowByEmail(target.email);
  const decoyRow = webTablesPage.rowByEmail(decoy.email);
  await expect(targetRow).toHaveCount(1);
  await expect(decoyRow).toHaveCount(1);

  await webTablesPage.searchInput.fill(target.email);

  await expect(webTablesPage.populatedRows).toHaveCount(1);
  await expect(targetRow).toHaveCount(1);
  await expect(webTablesPage.columnHeaders).toHaveText([
    'First Name',
    'Last Name',
    'Age',
    'Email',
    'Salary',
    'Department',
    'Action',
  ]);
  await expect(webTablesPage.cellsOf(targetRow)).toHaveText([
    'Target',
    'Searcher',
    '29',
    'target.searcher@example.test',
    '4200',
    'Research',
    '',
  ]);
  await expect(decoyRow).toHaveCount(0);
});
