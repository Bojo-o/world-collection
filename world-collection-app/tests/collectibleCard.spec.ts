import { test, expect } from "@playwright/test";
import { collectibles, collections } from "./MocksData";

test.describe("collectible card tests", () => {
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
        await page.getByTestId('buttonToOpenCollectionList').click();
        await page.getByRole('listitem').filter({ hasText: 'Towers1/2' }).click();
        await page.getByRole('button', { name: 'Marker' }).first().click();
        const container = page.getByTestId('collectible card');
        await expect(container).toBeVisible()
    })

    test("image was rendered", async ({ page }) => {
        const container = page.getByTestId('collectible card');
        await expect(container.getByRole('img', { name: 'image of Tokyo Tower' })).toBeVisible()
    });
    test("collectible info were rendered", async ({ page }) => {
        const container = page.getByTestId('collectible card');
        await expect(container.getByRole('heading', { name: 'Tokyo Tower' })).toBeVisible()
        await expect(container.getByText('tower in Tokyo, Japan')).toBeVisible()
        // instances
        await expect(container.getByText('transmitter mastobservation towerlattice towerlandmark')).toBeVisible()
        // notes
        await expect(container.getByText('Huge tower', { exact: true })).toBeVisible()
    });
    test("visited collectible visitation status was rendered", async ({ page }) => {
        const container = page.getByTestId('collectible card');
        await expect(container.locator('span').filter({ hasText: 'Visited' })).toBeVisible()
    });

    test("not yet visited collectible visitation status was rendered", async ({ page }) => {
        await page.getByRole('button', { name: 'Marker' }).nth(1).click()
        const container = page.getByTestId('collectible card');
        await expect(container.locator('span').filter({ hasText: 'Not visited yet' })).toBeVisible()
    });

    test("show details button is visible and works", async ({ page }) => {
        const button = page.getByTestId('collectible card').getByRole('button', { name: 'Show details' });
        await expect(button).toBeVisible()
        await button.click()
        await expect(page.getByTestId("list of details")).toBeVisible()
        await page.getByTestId('collectible card').getByRole('button', { name: 'Close' }).click()
        await expect(page.getByTestId("list of details")).not.toBeVisible()
    });

    test("filters details by name of filter", async ({ page }) => {
        const button = page.getByTestId('collectible card').getByRole('button', { name: 'Show details' });
        await button.click()
        await page.getByPlaceholder('Search for detail').fill("inspired by")
        await expect(page.getByTestId("list of details").getByText('inspired by')).toBeVisible()
        const count = await page.getByTestId("list of details").getByRole('listitem').count();
        await expect(count).toBe(1)
    });
    test("visitation button is visible and works", async ({ page }) => {
        const button = page.getByTestId('collectible card').getByRole('button', { name: 'Visitation' });
        await expect(button).toBeVisible()
        await button.click()
        await expect(page.getByTestId("visitation container")).toBeVisible()
        await page.getByTestId('collectible card').getByRole('button', { name: 'Close' }).click()
        await expect(page.getByTestId("visitation container")).not.toBeVisible()
    });
    test("edit icon button is visible and works", async ({ page }) => {
        const button = page.getByTestId('collectible card').getByRole('button', { name: 'Edit Icon' });
        await expect(button).toBeVisible()
        await button.click()
        await expect(page.getByTestId("icon selector")).toBeVisible()
        await page.getByTestId('collectible card').getByRole('button', { name: 'Close' }).click()
        await expect(page.getByTestId("icon selector")).not.toBeVisible()
    });
    test("edit notes button is visible and works", async ({ page }) => {
        const button = page.getByTestId('collectible card').getByRole('button', { name: 'Edit notes' });
        await expect(button).toBeVisible()
        await button.click()
        const notes = page.getByTestId("notes")
        await expect(notes).toBeVisible()
        const saveButton = page.getByRole('button', { name: 'Save notes' });
        const notes_input = page.getByPlaceholder('Make some notes')
        await expect(notes_input).toBeVisible()
        await expect(saveButton).toBeDisabled()
        await notes_input.fill("new notes")
        await expect(saveButton).not.toBeDisabled()
        await page.getByTestId('collectible card').getByRole('button', { name: 'Close' }).click()
        await expect(notes).not.toBeVisible()
        await expect(notes_input).not.toBeVisible()
    });

})