import { test as base, expect } from '@playwright/test';
import { TextBoxPage } from '../pages/text-box.page.js';

type UiFixtures = {
  textBoxPage: TextBoxPage;
};

export const test = base.extend<UiFixtures>({
  textBoxPage: async ({ page }, use) => {
    const textBoxPage = new TextBoxPage(page);

    await use(textBoxPage);
  },
});

export { expect };