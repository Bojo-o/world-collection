import { test, expect } from "@playwright/test";
import { collectibles, collections } from "./MocksData";

test.describe("edit collections tests", () => {
    test.beforeEach(async ({ page }) => {
        // Mock API requests
        // collections
        await page.route('http://localhost:3000/WorldCollectionAPI/get/collections?data=%7B%7D', async route => {
            const json =
                collections
                ;
            await route.fulfill({ json });
        });
        // collectibles
        await page.route('http://localhost:3000/WorldCollectionAPI/get/collectibles?data=%7B%22collectionID%22%3A1%7D', async route => {
            const json =
                collectibles
                ;
            await route.fulfill({ json });
        });

        await page.goto('http://localhost:3000/');
        await page.getByRole('button', { name: 'Edit collections' }).click();
        await expect(page.getByTestId('editation container')).toBeVisible()
    })

    test("render collections editation table", async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'Collections:' })).toBeVisible();
        await expect(page.getByPlaceholder('Search for collection')).toBeVisible();
        // column header
        await expect(page.getByRole('columnheader', { name: 'Name of collection' })).toBeVisible();
        await expect(page.getByRole('columnheader', { name: '#Collectibles' })).toBeVisible();
        await expect(page.getByRole('columnheader', { name: '#', exact: true })).toBeVisible();
        // rows cells
        await expect(page.getByRole('cell', { name: 'Towers', exact: true })).toBeVisible()
        await expect(page.getByRole('cell', { name: 'Castles', exact: true })).toBeVisible()
        await expect(page.getByRole('cell', { name: '2', exact: true })).toBeVisible()
        await expect(page.getByRole('cell', { name: '0', exact: true })).toBeVisible()
        const actionsCell = page.getByRole('row').last().getByRole('cell', { name: 'Edit Collectibles Edit Merge Remove' });
        await expect(actionsCell.getByRole('button', { name: 'Edit Collectibles' })).toBeVisible()
        await expect(actionsCell.getByRole('button', { name: 'Merge' })).toBeVisible()
        await expect(actionsCell.getByRole('button', { name: 'Remove' })).toBeVisible()
    });
    test("after clicking edit collectibles, table with collectibles was rendered", async ({ page }) => {
        await page.getByRole('row').nth(1).getByRole('cell', { name: 'Edit Collectibles Edit Merge Remove' }).getByRole('button', { name: 'Edit Collectibles' }).click()
        await expect(page.getByRole('heading', { name: 'Collectibles of Towers:' })).toBeVisible();
        await expect(page.getByPlaceholder('Search for collectible')).toBeVisible();
        // column header
        await expect(page.getByRole('columnheader', { name: 'Name of collectible' })).toBeVisible();
        await expect(page.getByRole('columnheader', { name: 'Types of' })).toBeVisible();
        await expect(page.getByRole('columnheader', { name: '#', exact: true })).toBeVisible();
        await expect(page.getByRole('columnheader', { name: 'Visition' })).toBeVisible();
        // rows cells
        await expect(page.getByRole('cell', { name: 'Tokyo Tower', exact: true })).toBeVisible()
        await expect(page.getByRole('cell', { name: 'Eiffel Tower', exact: true })).toBeVisible()
        await expect(page.getByRole('cell', { name: 'tourist attraction observation tower lattice tower landmark', exact: true })).toBeVisible()
        await expect(page.getByRole('cell', { name: 'transmitter mast observation tower lattice tower landmark', exact: true })).toBeVisible()

        const actionsCell = page.getByRole('row').last().getByRole('cell', { name: 'Edit Remove' });
        await expect(actionsCell.getByRole('button', { name: 'Edit' })).toBeVisible()
        await expect(actionsCell.getByRole('button', { name: 'Remove' })).toBeVisible()
    });

})