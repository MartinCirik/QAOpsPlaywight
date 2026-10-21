//const base = require('@playwright/test');
import {test as baseTest} from '@playwright/test';
interface TestDataForOrder {
 username: string;
 password: string;
 productName: string;
};

export const customTest = baseTest.extend<{testDataForOrder:TestDataForOrder}>(
{
testDataForOrder: {
    username: "mcirik19@gmail.com",
    password: "Karol050290*",
    productName: "ZARA COAT 3"


}

}

)