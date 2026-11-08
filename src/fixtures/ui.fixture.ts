import { test as base, expect } from '@playwright/test';
import { CheckBoxPage } from '../pages/check-box.page.js';
import { TextBoxPage } from '../pages/text-box.page.js';

type UiFixtures = {
  checkBoxPage: CheckBoxPage;
  textBoxPage: TextBoxPage;
};

export const test = base.extend<UiFixtures>({
  checkBoxPage: async ({ page }, use) => {
    const checkBoxPage = new CheckBoxPage(page);

    await use(checkBoxPage);
  },
  
  textBoxPage: async ({ page }, use) => {
    const textBoxPage = new TextBoxPage(page);

    await use(textBoxPage);
  },
});

export { expect };