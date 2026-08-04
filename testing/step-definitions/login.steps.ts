import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { TestWorld } from '../support/world';

Given(
  'the user is on the login page',
  async function (this: TestWorld) {
    await this.page.goto('http://localhost:4200/login');
  }
);

When(
  'the user enters the credentials {string} and {string}',
  async function (
    this: TestWorld, email: string, password: string) {
    await this.page.getByLabel('Email address').fill(email);
    await this.page.getByLabel('Password').fill(password);
  }
);

When(
  'the user submits the credentials',
  async function (this: TestWorld) {
    await this.page
      .locator('form')
      .getByRole('button', { name: 'Log in', exact: true, })
      .click();
  }
);

Then(
  'the {string} button should be visible',
  async function (this: TestWorld, buttonName: string) {
    const button = this.page.getByRole('button', {
      name: buttonName, exact: true,
    });

    await expect(button).toBeVisible();
  }
);