const { test, expect } = require('@playwright/test');
const {customtest} = require('../Utils/test-base');

const { POManager } = require('../pageobjects/POManager');
//Json->string->js object
const dataset = JSON.parse(JSON.stringify(require("../Utils/placeoderTestData.json")));

for(const data of dataset)
{

test (`Client App login for ${data.productName}`, async ({page})=>
{
const poMANAGER = new POManager(page);
//js file - Login js, DashboardPage
const products = page.locator(".card-body");
const loginPage = poMANAGER.getLoginPage();
await loginPage.goTo();
await loginPage.validLogin(data.username,data.password)
const dashboardPage = poMANAGER.getDashboardPage();
await dashboardPage.searchProductAddCart(data.productName);
await dashboardPage.navigateToCart();

const cartPage = poMANAGER.getCartPage();
    await cartPage.VerifyProductIsDisplayed(data.productName);
    await cartPage.Checkout();

    const ordersReviewPage = poMANAGER.getOrdersReviewPage();
    await ordersReviewPage.searchCountryAndSelect("ind","India");
    const orderId = await ordersReviewPage.SubmitAndGetOrderId();
   console.log(orderId);
   await dashboardPage.navigateToOrders();
   const ordersHistoryPage = poMANAGER.getOrdersHistoryPage();
   await ordersHistoryPage.searchOrderAndSelect(orderId);
   expect(orderId.includes(await ordersHistoryPage.getOrderId())).toBeTruthy();

//Zara Coat 3
});
}

customtest (`Client App login`, async ({page,testDataForOrder}) =>
{
const poMANAGER = new POManager(page);
//js file - Login js, DashboardPage
const products = page.locator(".card-body");
const loginPage = poMANAGER.getLoginPage();
await loginPage.goTo();
await loginPage.validLogin(testDataForOrder.username,testDataForOrder.password)
const dashboardPage = poMANAGER.getDashboardPage();
await dashboardPage.searchProductAddCart(testDataForOrder.productName);
await dashboardPage.navigateToCart();

const cartPage = poMANAGER.getCartPage();
    await cartPage.VerifyProductIsDisplayed(testDataForOrder.productName);
    await cartPage.Checkout();





});
