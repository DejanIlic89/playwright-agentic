import type { Locator, Page } from '@playwright/test';

export type WebTableRecord = {
  firstName: string;
  lastName: string;
  email: string;
  age: string;
  salary: string;
  department: string;
};

export class WebTablesPage {
  constructor(private readonly page: Page) {}

  get addButton() {
    return this.page.getByRole('button', {
      name: 'Add',
      exact: true,
    });
  }

  get table() {
    return this.page.getByRole('table');
  }

  get columnHeaders() {
    return this.table.getByRole('columnheader');
  }

  get rows() {
    return this.table.locator('tbody').getByRole('row');
  }

  // Excludes blank placeholder rows that contain no visible text.
  get populatedRows() {
    return this.rows.filter({ hasText: /\S/ });
  }

  // The dialog has no accessible name, so it is identified by its title text.
  get registrationDialog() {
    return this.page.getByRole('dialog').filter({ hasText: 'Registration Form' });
  }

  // The form labels are not associated with their inputs, so placeholders are used.
  get firstNameInput() {
    return this.registrationDialog.getByPlaceholder('First Name', { exact: true });
  }

  get lastNameInput() {
    return this.registrationDialog.getByPlaceholder('Last Name', { exact: true });
  }

  get emailInput() {
    return this.registrationDialog.getByPlaceholder('name@example.com', { exact: true });
  }

  get ageInput() {
    return this.registrationDialog.getByPlaceholder('Age', { exact: true });
  }

  get salaryInput() {
    return this.registrationDialog.getByPlaceholder('Salary', { exact: true });
  }

  get departmentInput() {
    return this.registrationDialog.getByPlaceholder('Department', { exact: true });
  }

  get submitButton() {
    return this.registrationDialog.getByRole('button', {
      name: 'Submit',
      exact: true,
    });
  }

  async open(): Promise<void> {
    await this.page.goto('/webtables');
    await this.populatedRows.first().waitFor();
  }

  async openAddDialog(): Promise<void> {
    await this.addButton.click();
  }

  async fillRegistrationForm(record: WebTableRecord): Promise<void> {
    await this.firstNameInput.fill(record.firstName);
    await this.lastNameInput.fill(record.lastName);
    await this.emailInput.fill(record.email);
    await this.ageInput.fill(record.age);
    await this.salaryInput.fill(record.salary);
    await this.departmentInput.fill(record.department);
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
  }

  rowByEmail(email: string): Locator {
    return this.rows.filter({
      has: this.page.getByRole('cell', { name: email, exact: true }),
    });
  }

  cellsOf(row: Locator): Locator {
    return row.getByRole('cell');
  }

  // The Edit control is a span with a title attribute and no button role.
  editButtonOf(row: Locator): Locator {
    return row.getByTitle('Edit', { exact: true });
  }

  async openEditDialog(row: Locator): Promise<void> {
    await this.editButtonOf(row).click();
  }
}
