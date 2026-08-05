import { Before, After, setDefaultTimeout } from "@cucumber/cucumber";
import { chromium } from "playwright";
import { TestWorld } from "./world";

setDefaultTimeout(30_000);

Before(async function (this: TestWorld) {
    this.browser = await chromium.launch({
        headless: false,
    });

    this.context = await this.browser.newContext();
    this.page = await this.context.newPage();
});

After(async function (this: TestWorld) {
    await this.page.close();
    await this.context.close();
    await this.browser.close();
});