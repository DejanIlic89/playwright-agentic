import { test, expect } from '../../../src/fixtures/ui.fixture.js';
import type { WebTableRecord } from '../../../src/pages/web-tables.page.js';

const record: WebTableRecord = {
  firstName: 'Taylor',
  lastName: 'Morgan',
  email: 'taylor.morgan@example.test',
  age: '31',
  salary: '4500',
  department: 'Quality Assurance',
};

test('adding a valid record displays all submitted values', async ({ webTablesPage }) => {
  await webTablesPage.open();
  const initialRecordCount = await webTablesPage.populatedRows.count();

  await webTablesPage.openAddDialog();
  await expect(webTablesPage.registrationDialog).toBeVisible();

  await webTablesPage.fillRegistrationForm(record);
  await webTablesPage.submit();
  await expect(webTablesPage.registrationDialog).toBeHidden();

  const addedRow = webTablesPage.rowByEmail(record.email);
  await expect(addedRow).toHaveCount(1);

  // Column order is asserted so that each value is verified under its own header.
  await expect(webTablesPage.columnHeaders).toHaveText([
    'First Name',
    'Last Name',
    'Age',
    'Email',
    'Salary',
    'Department',
    'Action',
  ]);
  await expect(webTablesPage.cellsOf(addedRow)).toHaveText([
    record.firstName,
    record.lastName,
    record.age,
    record.email,
    record.salary,
    record.department,
    '',
  ]);

  await expect(webTablesPage.populatedRows).toHaveCount(initialRecordCount + 1);
});
