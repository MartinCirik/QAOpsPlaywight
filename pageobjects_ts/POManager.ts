//const {LoginPage} = require('./LoginPage');
import {LoginPage} from './LoginPage';
//const {DashboardPage} = require('./DashboardPage');
import {DashboardPage} from './DashboardPage';
//const {OrdersHistoryPage} = require('./OrdersHistoryPage');
import {OrdersHistoryPage} from './OrdersHistoryPage';
//const {OrdersReviewPage} = require('./OrdersReviewPage');
import {OrdersReviewPage} from './OrdersReviewPage';
//const {CartPage} = require('./CartPage');
import {CartPage} from './CartPage';
import {Page} from 'playwright/test';

export class POManager
{
loginPage: LoginPage;
dashboardPage: DashboardPage;
ordersHistoryPage: OrdersHistoryPage;
ordersReviewPage: OrdersReviewPage;
cartPage: CartPage;
page: Page;
constructor(page:Page)
{
    this.page = page;
    this.loginPage = new LoginPage(this.page);
    this.dashboardPage = new DashboardPage(this.page);
    this.ordersHistoryPage = new OrdersHistoryPage(this.page);
    this.ordersReviewPage = new OrdersReviewPage(this.page);
    this.cartPage = new CartPage(this.page);


}

getLoginPage()
{
    return this.loginPage;
}

getCartPage()
{
    return this.cartPage;
}

getDashboardPage()
{
    return this.dashboardPage;
}
getOrdersHistoryPage()
{
    return this.ordersHistoryPage;
}

getOrdersReviewPage()
{
    return this.ordersReviewPage;
}
}
module.exports = {POManager};