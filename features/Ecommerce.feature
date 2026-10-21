Feature: Ecommerce validations
  @Regression
  Scenario: Placing the Order
  Given a login to Ecommerce application with "mcirik19@gmail.com" and "Karol050290*"
    When Add "ZARA COAT 3" to Cart
    Then Verify "ZARA COAT 3" is displayed in the Cart
    When Enter valid details and Place the Order
    Then Verify order in present in the OrderHistory

  @Validation
  Scenario Outline: Placing the Order
  Given a login to Ecommerce2 application with "<username>" and "<password>"
  Then Verify Error message is displayed

  Examples:
  | uusername           | password     |
  | mcirik19@gmail.com  | Karol050290* |
  | hello@123.com       | Iamhello@12  |