import type { Locator, Page } from '@playwright/test';

export class CheckBoxPage {
  constructor(private readonly page: Page) {}

  get homeCheckbox() {
    return this.checkbox('Home');
  }

  get desktopCheckbox() {
    return this.checkbox('Desktop');
  }

  get notesCheckbox() {
    return this.checkbox('Notes');
  }

  get commandsCheckbox() {
    return this.checkbox('Commands');
  }

  get homeNode() {
    return this.treeNode(this.homeCheckbox);
  }

  get desktopNode() {
    return this.treeNode(this.desktopCheckbox);
  }

  // The expand toggle has no role or accessible name, so it is scoped to its treeitem.
  get homeExpandToggle() {
    return this.homeNode.locator('.rc-tree-switcher');
  }

  get desktopExpandToggle() {
    return this.desktopNode.locator('.rc-tree-switcher');
  }

  get result() {
    return this.page.locator('#result');
  }

  get selectedResultItems() {
    return this.result.locator('.text-success');
  }

  async open(): Promise<void> {
    await this.page.goto('/checkbox');
  }

  async expandHome(): Promise<void> {
    await this.homeExpandToggle.click();
  }

  async expandDesktop(): Promise<void> {
    await this.desktopExpandToggle.click();
  }

  async collapseDesktop(): Promise<void> {
    await this.desktopExpandToggle.click();
  }

  async selectNotes(): Promise<void> {
    await this.notesCheckbox.click();
  }

  async deselectNotes(): Promise<void> {
    await this.notesCheckbox.click();
  }

  private checkbox(name: string): Locator {
    return this.page.getByRole('checkbox', {
      name: `Select ${name}`,
      exact: true,
    });
  }

  private treeNode(checkbox: Locator): Locator {
    return this.page.getByRole('treeitem').filter({ has: checkbox });
  }
}
