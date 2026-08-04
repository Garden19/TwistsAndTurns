import { IWorldOptions, World, setWorldConstructor } from '@cucumber/cucumber';
import type { Browser, BrowserContext, Page } from 'playwright'

export class TestWorld extends World {
    browser!: Browser;
    context!: BrowserContext;
    page!: Page;

    constructor(options: IWorldOptions) {
        super(options);
    }
}

setWorldConstructor(TestWorld);