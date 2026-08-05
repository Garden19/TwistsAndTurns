import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { TestWorld } from '../support/world';

Given(
  'I open the sign-up page',
  async function (this: TestWorld) {
    await this.page.goto('http://localhost:4200/signup');
  }
);

When(
  'I complete the sign-up form with valid details',
  async function (this: TestWorld) {
    await this.page.locator('#firstName').fill('Lou');
    await this.page.locator('#lastName').fill('Allen');
    await this.page.locator('#email').fill('lou.allen@example.com');
    await this.page.locator('#password').fill('password123');
    await this.page.locator('#confirmPassword').fill('password123');
  }
);

When(
  'I submit the sign-up form',
  async function (this: TestWorld) {
    const signupForm = this.page.locator('form');

    await signupForm.getByRole('button', {
        name: 'Create account',
        exact: true,
      }).click();
  }
);

Then(
  'the sign-up confirmation message should be displayed',
  async function (this: TestWorld) {
    await expect(this.page.getByText(
        'Thank you for signing up Lou!', {
        exact: true,
      })
    ).toBeVisible();
  }
);