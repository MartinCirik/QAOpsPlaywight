const { test, expect, request } = require('@playwright/test');
const { APiUtils } = require('../Utils/APiUtils');
const loginPayLoad = { userEmail: "mcirik19@gmail.com", userPassword: "Karol050290*" };
const orderPayLoad = { orders: [{ country: "Slovakia (Slovak Republic)", productOrderedId: "6960ea76c941646b7a8b3dd5" }] };
const fakePayloadOrders = { data: [], message: "No Orders" };

let response;
test.beforeAll(async () => {
    const apiContext = await request.newContext();
    const apiUtils = new APiUtils(apiContext, loginPayLoad);
    response = await apiUtils.createOrder(orderPayLoad);
});

test.beforeEach(() => {

});

test('Place the order', async ({ page }) => {
    await page.addInitScript(value => {
        window.localStorage.setItem('token', value);
    }, response.token);
    const email = "mcirik19@gmail.com"
    const productName = 'ZARA COAT 3';
    await page.goto("https://rahulshettyacademy.com/client/");
    await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/6a64b34b85b8849b490ca12d",
        async route => {
            const response = await page.request.fetch(route.request());
            let body = JSON.stringify(fakePayloadOrders);
            route.fulfill(
                {
                    response,
                    body,
                }
            );
             //intercepting response -APi response-> { playwright fakeresponse}->browser->render data on front end
        }
    );
    await page.locator("button[routerlink*='myorders']").click();
    await page.waitForResponse("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/6a64b34b85b8849b490ca12d");
    console.log(await page.locator(".mt-4").textContent());


});