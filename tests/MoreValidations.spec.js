const {test,expect}=require('@playwright/test')

//test.describe.configure({mode:'parallel'});
test.describe.configure({mode:'serial'});
test ("Popup validations", async({page})=>
{
await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
//await page.goto("http://www.google.com/");
//await page.goBack();
//await page.goForward();
await expect(page.locator("#displayed-text")).toBeVisible();
await page.locator("#hide-textbox").click();
await expect(page.locator("#displayed-text")).toBeHidden();
page.on('dialog', dialog=>dialog.accept());
await page.locator("#confirmbtn").click();
await page.locator("#mousehover").hover();
await page.pause();
const framesPage = page.frameLocator('iframe[name="iframe-name"]');
await framesPage.getByRole('link', { name: 'All Access Plan' }).click();
const textCheck = await framesPage.getByText('Join 13,522 Happy Subscibers!').textContent();
console.log(textCheck.trim().split(" ")[1]);
})

test ("Screenshot & Visual comparision", async({page})=>
{
await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
await expect(page.locator("#displayed-text")).toBeVisible();
await page.locator("#displayed-text").screenshot({path:'partialScreenshot.png'});
await page.locator("#hide-textbox").click();
await page.screenshot({path:'screnshot.png'});
await expect(page.locator("#displayed-text")).toBeHidden();
});

test ("Visual", async({page})=>
{
await page.goto("https://www.google.com/");
expect(await page.screenshot()).toMatchSnapshot('landing.png');

})