import { test, expect } from "@playwright/test";
import { collectibles, collections } from "./MocksData";


test.describe("home state tests", () => {
    test.beforeEach(async ({ page }) => {
        // Mock API requests
        // collections
        await page.route('http://localhost:3000/DatabaseAPI/get/collections', async route => {
            const json =
                collections
                ;
            await route.fulfill({ json });
        });
        // collectibles
        await page.route('http://localhost:3000/DatabaseAPI/get/collectibles', async route => {
            const json =
                collectibles
                ;
            await route.fulfill({ json });
        });

        await page.goto('http://localhost:3000/');
    })

    test("open and close list of collections", async ({ page }) => {
        await expect(page.getByTestId('collectionsMenu')).not.toBeVisible()
        await page.getByTestId('buttonToOpenCollectionList').click();
        await expect(page.getByTestId('collectionsMenu')).toBeVisible()
        await page.getByTestId('close collectionsMenu').click();
        await expect(page.getByTestId('collectionsMenu')).not.toBeVisible()
    });
    test("list of collections renders right", async ({ page }) => {
        await page.getByTestId('buttonToOpenCollectionList').click();

        await expect(page.getByRole('listitem').filter({ hasText: 'Towers1/2' })).toBeVisible()
        await expect(page.getByRole('listitem').filter({ hasText: 'Castles0/0' })).toBeVisible()
    });
    test("filter collections by input", async ({ page }) => {
        await page.getByTestId('buttonToOpenCollectionList').click();

        await page.getByPlaceholder('Search for collection').fill("Tow");
        await expect(page.getByRole('listitem').filter({ hasText: 'Towers1/2' })).toBeVisible()
        await expect(page.getByRole('listitem').filter({ hasText: 'Castles0/0' })).not.toBeVisible()
    });

    test("after clicking on collection collectibles on the map were rendered", async ({ page }) => {
        await page.getByTestId('buttonToOpenCollectionList').click();
        await page.getByRole('listitem').filter({ hasText: 'Towers1/2' }).click();

        await expect(page.getByRole('button', { name: 'Marker' }).first()).toBeVisible()
        await expect(page.getByRole('button', { name: 'Marker' }).nth(1)).toBeVisible()
    });
    test("after clicking on collectible marker card was rendered", async ({ page }) => {
        await page.getByTestId('buttonToOpenCollectionList').click();
        await page.getByRole('listitem').filter({ hasText: 'Towers1/2' }).click();
        await page.getByRole('button', { name: 'Marker' }).nth(1).click();
        await expect(page.getByTestId('collectible card')).toBeVisible()
    });
})