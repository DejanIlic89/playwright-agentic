import type { Page } from '@playwright/test';

export class TextBoxPage {
  constructor(private readonly page: Page) {}

  get fullNameInput() {
    return this.page.getByPlaceholder('Full Name', {
      exact: true,
    });
  }

  get emailInput() {
    return this.page.getByPlaceholder('name@example.com', {
      exact: true,
    });
  }

  get submitButton() {
    return this.page.getByRole('button', {
      name: 'Submit',
      exact: true,
    });
  }

  get output() {
    return this.page.locator('#output');
  }

  get submittedName() {
    return this.output.locator('#name');
  }

  get submittedEmail() {
    return this.output.locator('#email');
  }

  async open(): Promise<void> {
    await this.page.goto('/text-box');
  }

  async fillForm(fullName: string, email: string): Promise<void> {
    await this.fullNameInput.fill(fullName);
    await this.emailInput.fill(email);
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
  }
}