const {test, expect} = require('@playwright/test');


test ('Browser Context Playwright test', async ({page})=>
{
const email = "mcirik19@gmail.com"
const productName = 'ZARA COAT 3';
const products = page.locator(".card-body");
await page.goto("https://rahulshettyacademy.com/client");
await page.getByPlaceholder("email@example.com").fill(email);
await page.getByPlaceholder("enter your passsword").fill("Karol050290*");
await page.getByRole('button',{name: "Login"}).click();
await page.waitForLoadState("networkidle");
await page.locator(".card-body b").first().waitFor();
await page.locator(".card-body").filter({hasText:"ZARA COAT 3"}).getByRole("button",{name:"Add To Cart"}).click();
await page.getByRole("listitem").getByRole("button",{name:"Cart"}).click();
await page.locator ("div li").first().waitFor();

await expect(page.getByText("ZARA COAT 3")).toBeVisible();
await page.getByRole("button",{name:"Checkout"}).click();
await page.getByPlaceholder("Select Country").pressSequentially("ind");
await page.getByRole("button",{name:"India"}).nth(1).click();
await page.getByText("PLACE ORDER").click();
await expect(page.getByText("Thankyou for the order.")).toBeVisible();
})
