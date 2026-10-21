const base = require('@playwright/test');


exports.customtest = base.test.extend(
{
testDataForOrder: {
    username: "mcirik19@gmail.com",
    password: "Karol050290*",
    productName: "ZARA COAT 3"


}

}

)