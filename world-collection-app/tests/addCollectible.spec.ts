import { test, expect, Page } from "@playwright/test";
import { collections } from "./MocksData";

test.describe("collectible card tests", () => {
    test.beforeEach(async ({ page }) => {
        // Mock API requests
        // collections
        await page.route('http://localhost:3000/WorldCollectionAPI/get/collections', async route => {
            const json =
                collections
                ;
            await route.fulfill({ json });
        });

        await page.goto('http://localhost:3000/');
        await page.getByRole('button', { name: 'Add Collectibles' }).click();
    })
    const searchEiffelTower = async (page: Page) => {
        await page.getByTestId("open adding menu").click();
        await page.getByPlaceholder('Type some collectible, likes Eiffel tower').fill("Eiffel tower");
    }
    const addEiffelTowerToList = async (page: Page) => {
        searchEiffelTower(page);
        await page.getByRole('button', { name: 'Eiffel Tower tower located on the Champ de Mars in Paris, France' }).click()
        await page.getByTestId('adding menu').getByRole('button', { name: 'Add' }).click();
    }
    test("open and close side bar adding menu", async ({ page }) => {
        await expect(page.locator('.side-menu')).toBeVisible();
        await page.getByTestId("open adding menu").click();
        await expect(page.getByTestId("adding menu")).toBeVisible();
        await page.getByTestId('close adding menu').click();
        await expect(page.getByTestId("adding menu")).not.toBeVisible();
    });
    test("search for collectible ", async ({ page }) => {
        searchEiffelTower(page)
        await expect(page.getByRole('button', { name: 'Eiffel Tower tower located on the Champ de Mars in Paris, France' })).toBeVisible();
    });
    test("add collectible to list ", async ({ page }) => {
        addEiffelTowerToList(page);
        await expect(page.getByTestId('adding menu').getByRole('listitem').getByRole('heading', { name: 'Eiffel Tower' })).toBeVisible();
    });
    test("remove collectible from list ", async ({ page }) => {
        addEiffelTowerToList(page);
        await page.getByTestId('adding menu').click()
        await page.getByTestId('adding menu').getByRole('listitem').first().getByRole('button', { name: 'Remove' }).click()
        await expect(page.getByTestId('adding menu').getByRole('listitem').getByRole('heading', { name: 'Eiffel Tower' })).not.toBeVisible();
    });


})