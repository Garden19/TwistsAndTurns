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
  async function (this: TestWorld, email: string, password: string) {
    await this.page.getByLabel('Email address').fill(email);
    await this.page.getByLabel('Password').fill(password);
  }
);

When(
  'the user submits the credentials',
  async function (this: TestWorld) {
    await this.page.locator('form').getByRole('button', {
        name: 'Log in',
        exact: true,
      })
      .click();
  }
);

When(
  'the user leaves the {string} field empty',
  async function (this: TestWorld, fieldLabel: string) {
    const field = this.page.getByLabel(fieldLabel);

    await field.focus();
    await field.blur();
  }
);

When(
  'the user enters {string} into the {string} field',
  async function (this: TestWorld, value: string, fieldLabel: string) {
    const field = this.page.getByLabel(fieldLabel);

    await field.fill(value);
  }
);

Then(
  'the message {string} should be visible',
  async function (this: TestWorld, message: string) {
    const messageElement = this.page.getByText(message, {
      exact: true,
    });

    await expect(messageElement).toBeVisible();
  }
);

Then(
  'the {string} button should be visible',
  async function (this: TestWorld, buttonName: string) {
    const button = this.page.locator('.button-navigation').getByRole('button', {
        name: buttonName,
        exact: true,
      });

    await expect(button).toBeVisible();
  }
);

Then(
  'the {string} button should be disabled',
  async function (this: TestWorld, buttonName: string) {
    const button = this.page.locator('form').getByRole('button', {
        name: buttonName,
        exact: true,
      });

    await expect(button).toBeDisabled();
  }
);

Then(
  'the {string} button should not be visible',
  async function (this: TestWorld, buttonName: string) {
    const button = this.page.locator('.button-navigation').getByRole('button', {
        name: buttonName,
        exact: true,
      });

    await expect(button).toBeHidden();
  }
);