import { test, expect } from '../../../src/fixtures/ui.fixture.js';
import type { WebTableRecord } from '../../../src/pages/web-tables.page.js';

const alpha: WebTableRecord = {
  firstName: 'Alpha',
  lastName: 'Tester',
  email: 'alpha.delete@example.test',
  age: '29',
  salary: '4100',
  department: 'Engineering',
};

const bravo: WebTableRecord = {
  firstName: 'Bravo',
  lastName: 'Tester',
  email: 'bravo.delete@example.test',
  age: '41',
  salary: '5200',
  department: 'Finance',
};

// Cell order follows the table columns: First Name, Last Name, Age, Email, Salary, Department, Action.
const EMAIL_CELL_INDEX = 3;

const rowValues = (record: WebTableRecord) => [
  record.firstName,
  record.lastName,
  record.age,
  record.email,
  record.salary,
  record.department,
  '',
];

test('deleting one added record preserves the other records', async ({ webTablesPage }) => {
  await webTablesPage.open();

  const seedRecords: string[][] = [];
  for (const row of await webTablesPage.populatedRows.all()) {
    seedRecords.push(await webTablesPage.cellsOf(row).allInnerTexts());
  }
  expect(seedRecords.length).toBeGreaterThan(0);

  for (const record of [alpha, bravo]) {
    await webTablesPage.openAddDialog();
    await webTablesPage.fillRegistrationForm(record);
    await webTablesPage.submit();
    await expect(webTablesPage.registrationDialog).toBeHidden();
  }

  const alphaRow = webTablesPage.rowByEmail(alpha.email);
  const bravoRow = webTablesPage.rowByEmail(bravo.email);
  await expect(alphaRow).toHaveCount(1);
  await expect(bravoRow).toHaveCount(1);
  await expect(webTablesPage.populatedRows).toHaveCount(seedRecords.length + 2);
  const recordCountBeforeDelete = seedRecords.length + 2;

  await webTablesPage.deleteButtonOf(alphaRow).click();

  await expect(alphaRow).toHaveCount(0);

  await expect(bravoRow).toHaveCount(1);
  await expect(webTablesPage.cellsOf(bravoRow)).toHaveText(rowValues(bravo));

  for (const seedValues of seedRecords) {
    const seedRow = webTablesPage.rowByEmail(seedValues[EMAIL_CELL_INDEX]);
    await expect(seedRow).toHaveCount(1);
    await expect(webTablesPage.cellsOf(seedRow)).toHaveText(seedValues);
  }

  await expect(webTablesPage.populatedRows).toHaveCount(recordCountBeforeDelete - 1);
});
