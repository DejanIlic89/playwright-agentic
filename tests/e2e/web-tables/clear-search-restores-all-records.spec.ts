import { test, expect } from '../../../src/fixtures/ui.fixture.js';
import { createWebTableRecord } from '../../../src/data/web-table-record.factory.js';
import type { WebTableRecord } from '../../../src/types/web-table-record.js';

const target = createWebTableRecord({
  firstName: 'Clear',
  lastName: 'Target',
  email: 'clear.target@example.test',
  age: '33',
  salary: '4800',
  department: 'Support',
});

const neighbor = createWebTableRecord({
  firstName: 'Clear',
  lastName: 'Neighbor',
  email: 'clear.neighbor@example.test',
  age: '47',
  salary: '5300',
  department: 'Procurement',
});

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

test('clearing the search restores all records with unchanged values', async ({
  webTablesPage,
}) => {
  // Reads every populated row's cell values, sorted so that the comparison
  // ignores row order while keeping duplicate rows as separate entries.
  const readSortedRows = async () => {
    const rows = await webTablesPage.populatedRows.all();
    const values = await Promise.all(
      rows.map(async (row) =>
        (await webTablesPage.cellsOf(row).allInnerTexts()).map((text) =>
          text.trim(),
        ),
      ),
    );
    return values
      .map((cells) => ({ cells, key: JSON.stringify(cells) }))
      .sort((a, b) => (a.key < b.key ? -1 : a.key > b.key ? 1 : 0))
      .map(({ cells }) => cells);
  };

  await webTablesPage.open();

  for (const record of [target, neighbor]) {
    await webTablesPage.openAddDialog();
    await webTablesPage.fillRegistrationForm(record);
    await webTablesPage.submit();
    await expect(webTablesPage.registrationDialog).toBeHidden();
  }

  const targetRow = webTablesPage.rowByEmail(target.email);
  const neighborRow = webTablesPage.rowByEmail(neighbor.email);
  await expect(targetRow).toHaveCount(1);
  await expect(neighborRow).toHaveCount(1);
  await expect(webTablesPage.columnHeaders).toHaveText([
    'First Name',
    'Last Name',
    'Age',
    'Email',
    'Salary',
    'Department',
    'Action',
  ]);

  const originalRecordCount = await webTablesPage.populatedRows.count();
  const originalRows = await readSortedRows();
  expect(originalRows).toHaveLength(originalRecordCount);
  expect(originalRows).toContainEqual(rowValues(target));
  expect(originalRows).toContainEqual(rowValues(neighbor));

  await webTablesPage.searchInput.fill(target.email);

  await expect(webTablesPage.populatedRows).toHaveCount(1);
  await expect(targetRow).toHaveCount(1);
  await expect(webTablesPage.cellsOf(targetRow)).toHaveText(rowValues(target));
  await expect(neighborRow).toHaveCount(0);

  await webTablesPage.searchInput.fill('');

  await expect(webTablesPage.populatedRows).toHaveCount(originalRecordCount);
  await expect.poll(readSortedRows).toEqual(originalRows);
});
