import { test, expect } from '../../../src/fixtures/ui.fixture.js';
import type { WebTableRecord } from '../../../src/pages/web-tables.page.js';

const alpha: WebTableRecord = {
  firstName: 'Alpha',
  lastName: 'Tester',
  email: 'alpha.tester@example.test',
  age: '28',
  salary: '3000',
  department: 'Engineering',
};

const bravo: WebTableRecord = {
  firstName: 'Bravo',
  lastName: 'Tester',
  email: 'bravo.tester@example.test',
  age: '35',
  salary: '5000',
  department: 'Finance',
};

const updatedDepartment = 'Quality Engineering';

// Cell order follows the table columns: First Name, Last Name, Age, Email, Salary, Department, Action.
const rowValues = (record: WebTableRecord) => [
  record.firstName,
  record.lastName,
  record.age,
  record.email,
  record.salary,
  record.department,
  '',
];

test('editing Bravo updates its department and preserves Alpha', async ({ webTablesPage }) => {
  await webTablesPage.open();

  for (const record of [bravo, alpha]) {
    await webTablesPage.openAddDialog();
    await webTablesPage.fillRegistrationForm(record);
    await webTablesPage.submit();
    await expect(webTablesPage.registrationDialog).toBeHidden();
  }

  const alphaRow = webTablesPage.rowByEmail(alpha.email);
  const bravoRow = webTablesPage.rowByEmail(bravo.email);
  await expect(alphaRow).toHaveCount(1);
  await expect(bravoRow).toHaveCount(1);
  const recordCountBeforeEdit = await webTablesPage.populatedRows.count();

  await webTablesPage.openEditDialog(bravoRow);
  await expect(webTablesPage.registrationDialog).toBeVisible();

  await expect(webTablesPage.firstNameInput).toHaveValue(bravo.firstName);
  await expect(webTablesPage.lastNameInput).toHaveValue(bravo.lastName);
  await expect(webTablesPage.emailInput).toHaveValue(bravo.email);
  await expect(webTablesPage.ageInput).toHaveValue(bravo.age);
  await expect(webTablesPage.salaryInput).toHaveValue(bravo.salary);
  await expect(webTablesPage.departmentInput).toHaveValue(bravo.department);

  await webTablesPage.departmentInput.fill(updatedDepartment);
  await webTablesPage.submit();
  await expect(webTablesPage.registrationDialog).toBeHidden();

  await expect(bravoRow).toHaveCount(1);
  await expect(webTablesPage.columnHeaders).toHaveText([
    'First Name',
    'Last Name',
    'Age',
    'Email',
    'Salary',
    'Department',
    'Action',
  ]);
  await expect(webTablesPage.cellsOf(bravoRow)).toHaveText(
    rowValues({ ...bravo, department: updatedDepartment }),
  );
  await expect(webTablesPage.cellsOf(alphaRow)).toHaveText(rowValues(alpha));

  await expect(webTablesPage.populatedRows).toHaveCount(recordCountBeforeEdit);
});
