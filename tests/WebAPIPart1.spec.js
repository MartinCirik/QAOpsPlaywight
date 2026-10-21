const {test, expect, request} = require('@playwright/test');
const {APiUtils} = require('../Utils/APiUtils');
const loginPayLoad ={userEmail:"mcirik19@gmail.com",userPassword:"Karol050290*"};
const orderPayLoad={orders:[{country:"Slovakia (Slovak Republic)",productOrderedId:"6960ea76c941646b7a8b3dd5"}]};
let response;
test.beforeAll(async ()=>
{
const apiContext = await request.newContext();
const apiUtils = new APiUtils(apiContext,loginPayLoad);
response= await apiUtils.createOrder(orderPayLoad);
});

test.beforeEach( ()=>
{

});

test ('@web Place the order', async ({page})=>
{  
await page.addInitScript(value=>

    {
        window.localStorage.setItem('token', value);
    }, response.token);
const email = "mcirik19@gmail.com"
const productName = 'ZARA COAT 3';
await page.goto("https://rahulshettyacademy.com/client/");
await page.locator("button[routerlink*='myorders']").click();
await page.locator("tbody").waitFor();
const rows = await page.locator("tbody tr");
for (let i=0; i<await rows.count();++i)
{
const rowOrderId= await rows.nth(i).locator("th").textContent();
if(response.orderId.includes(rowOrderId))
{
    await rows.nth(i).locator("button").first().click();
    break;
}
}
await page.pause();
const orderIdDetails = await page.locator(".col-text").textContent();
expect(response.orderId.includes(orderIdDetails)).toBeTruthy;
await page.pause();

});