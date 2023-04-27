import { expect, test } from "@playwright/test";

test('open list with collections', async ({ page }) => {
    await page.route('http://localhost:3000/DatabaseAPI/get/collections', async route => {
        const json = 
        [{collection_id: 4, name: 'castles', visited: 6, notVisited: 9}]
    ;
        await route.fulfill({ json });
    });
    await page.goto('http://localhost:3000/');


    await page.getByTestId("buttonToOpenCollectionList").click()

    await expect(page.getByText("castles",{ exact: true })).toBeVisible()


    await expect(page.getByTestId("collectionsMenu")).toBeVisible()
  });