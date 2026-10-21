const { When, Then, Given } = require('@cucumber/cucumber')
const { POManager } = require('../../pageobjects/POManager');
const {expect} = require('@playwright/test');
const playwright = require('@playwright/test');

Given('a login to Ecommerce application with {string} and {string}',{timeout: 100*1000}, async function (username, password) {
  // Write code here that turns the phrase above into concrete actions
const products = this.page.locator(".card-body");
const loginPage = this.poMANAGER.getLoginPage();
await loginPage.goTo();
await loginPage.validLogin(username,password)
});

When('Add {string} to Cart', async function (productName) {
  // Write code here that turns the phrase above into concrete actions
  this.dashboardPage = this.poMANAGER.getDashboardPage();
  await this.dashboardPage.searchProductAddCart(productName);
  await this.dashboardPage.navigateToCart();
});

Then('Verify {string} is displayed in the Cart', { timeout: 30 * 1000 }, async function (productName) {
  // Write code here that turns the phrase above into concrete actions
  const cartPage = this.poMANAGER.getCartPage();
  await cartPage.VerifyProductIsDisplayed(productName);
  await cartPage.Checkout();
});

When('Enter valid details and Place the Order', async function () {
  // Write code here that turns the phrase above into concrete actions
   const ordersReviewPage = this.poMANAGER.getOrdersReviewPage();
   await ordersReviewPage.searchCountryAndSelect("ind","India");
   this.orderId = await ordersReviewPage.SubmitAndGetOrderId();
   console.log(this.orderId);
});

Then('Verify order in present in the OrderHistory', async function () {
  // Write code here that turns the phrase above into concrete actions
   await this.dashboardPage.navigateToOrders();
   const ordersHistoryPage = this.poMANAGER.getOrdersHistoryPage();
   await ordersHistoryPage.searchOrderAndSelect(this.orderId);
   expect(this.orderId.includes(await ordersHistoryPage.getOrderId())).toBeTruthy();
});

Given('a login to Ecommerce2 application with {string} and {string}', async function (username, password) {
const userName = this.page.locator('#username');
const signIn = this.page.locator("#signInBtn");
await this.page.goto("https://rahulshettyacademy.com/loginpagePractise/");
console.log(await this.page.title());
await userName.fill(username);
await this.page.locator("[type='password']").fill(password);
await signIn.click();
});

Then('Verify Error message is displayed', async function () {
  // Write code here that turns the phrase above into concrete actions
console.log(await this.page.locator("[style*='block']").textContent());
await expect(this.page.locator("[style*='block']")).toContainText('Incorrect');
});