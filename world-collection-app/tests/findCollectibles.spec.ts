import { test, expect, Page } from "@playwright/test";
import { collectibles, collections } from "./MocksData";


test.describe("find collectible tests", () => {
    test.beforeEach(async ({ page }) => {
        // Mock API requests
        // collections
        await page.route('http://localhost:3000/WorldCollectionAPI/get/collections?data=%7B%7D', async route => {
            const json =
                collections
                ;
            await route.fulfill({ json });
        });

        await page.goto('http://localhost:3000/');
        await page.getByRole('button', { name: 'Find collectibles' }).click();
    })
    const typeChoose = async (page: Page) => {
        await page.getByPlaceholder('examples : castle, cave, museum').fill("castle");
        await page.getByRole('button', { name: 'castle type of fortified structure built in Europe, Asia and the Middle East during the Middle Ages by nobility' }).click();
        await expect(page.getByRole('button', { name: 'Continue' })).toBeVisible();
        await page.getByRole('button', { name: 'Continue' }).click();
    }
    const areaRestriction = async (page: Page) => {
        await page.getByRole('button', { name: 'Use' }).nth(1).click();
        await page.getByPlaceholder('Type administrative area, country').fill("Slovakia");
        await page.getByRole('button', { name: 'Slovakia country in Central Europe' }).click();
        await expect(page.getByRole('button', { name: 'Continue' })).toBeVisible();
        await page.getByRole('button', { name: 'Continue' }).click();
    }
    const filterApplication = async (page: Page) => {
        await page.getByTestId('filters dropdown').click();
        await page.getByRole('button', { name: 'All filters' }).click();
        await page.getByPlaceholder('Search for filter').fill("heritage designation");
        await page.getByTestId('filter option').first().click();
        const useFilterBtn = page.getByRole('button', { name: 'Use filter' });
        await expect(useFilterBtn).not.toBeVisible()
        await page.getByPlaceholder('Search for wikibase items').fill("Unesco");
        await page.getByRole('button', { name: 'UNESCO World Heritage Site place of significance listed by UNESCO' }).click();
        await expect(useFilterBtn).toBeVisible()
        await page.getByRole('button', { name: 'Use filter' }).click();

        await page.getByRole('button', { name: 'Continue' }).click();
    }
    test("step one - choose type", async ({ page }) => {
        await typeChoose(page);
    });
    test("step two - choose area, set administrative area", async ({ page }) => {
        await typeChoose(page);
        await areaRestriction(page);
    });
    test("step three - use filter", async ({ page }) => {
        await typeChoose(page);
        await areaRestriction(page);
        await filterApplication(page);
    });
})