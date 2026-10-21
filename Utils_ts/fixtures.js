const base =require('@playwright/test');
const {APiUtils} = require('./APiUtils.js');
const {request} = require('@playwright/test');
const loginPayLoad ={userEmail:"mcirik19@gmail.com",userPassword:"Karol050290*"};
const orderPayLoad={orders:[{country:"Slovakia (Slovak Republic)",productOrderedId:"6960ea76c941646b7a8b3dd5"}]};


exports.customtest = base.test.extend(
    {

authenticatedPage : async({browser}, use)=>
{
const context = await browser.newContext();
const page = await context.newPage();    
await page.goto('https://rahulshettyacademy.com/client');
await page.locator("#userEmail").fill("mcirik19@gmail.com");
await page.locator("#userPassword").fill("Karol050290*");
await page.locator("[value='Login']").click();
await page.waitForLoadState("networkidle");
await use(page);
//tear down
await context.close();
},

createOrder: async({}, use)=>
{
    const apiContext = await request.newContext();
    const apiUtils = new APiUtils(apiContext,loginPayLoad);
    const response= await apiUtils.createOrder(orderPayLoad);
    await use(response);
    await apiContext.dispose();
},

testDataForOrder: {

    productName: 'ADIDAS ORIGINAL'
}
    

});