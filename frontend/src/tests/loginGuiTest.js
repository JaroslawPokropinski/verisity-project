const assert = require('assert');
const delay = require('delay');
const emailId = 'email';
const passwordId = 'password';
const submitId = 'submit';
const correctEmail = "admin@example.com";
const incorrectEmail = "admin1@example.com";
const correctPassword = "adminadmin";
const incorrectPassword = "adminadmin1";


function shouldLogCorrectly(){
const webdriver = require("selenium-webdriver");
const driver = new webdriver.Builder().forBrowser("chrome").build();
driver.navigate().to("http://localhost:9000/app/login")
.then(() => driver.wait(webdriver.until.elementLocated(webdriver.By.id(emailId))))
.then(emailInput => emailInput.sendKeys(correctEmail))
.then(() => driver.wait(webdriver.until.elementLocated(webdriver.By.id(passwordId))))
.then(passwordInput => passwordInput.sendKeys(correctPassword))
.then(() => driver.wait(webdriver.until.elementLocated(webdriver.By.id(submitId))))
.then(submitButton => submitButton.click())
.then(() => driver.sleep(2000))
.then(() => driver.close());
}

function shouldFailToLogWithIncorrectEmail(){
const webdriver = require("selenium-webdriver");
const driver = new webdriver.Builder().forBrowser("chrome").build();
driver.navigate().to("http://localhost:9000/app/login")
.then(() => driver.wait(webdriver.until.elementLocated(webdriver.By.id(emailId))))
.then(emailInput => emailInput.sendKeys(incorrectEmail))
.then(() => driver.wait(webdriver.until.elementLocated(webdriver.By.id(passwordId))))
.then(passwordInput => passwordInput.sendKeys(correctPassword))
.then(() => driver.wait(webdriver.until.elementLocated(webdriver.By.id(submitId))))
.then(submitButton => submitButton.click())
.then(() => driver.sleep(2000))
.then(() => driver.wait(webdriver.until.elementLocated(webdriver.By.className('Toastify__toast Toastify__toast--error'), 10000), 20000))
.then(() => driver.findElement(webdriver.By.className('Toastify__toast Toastify__toast--error')).
findElement(webdriver.By.className('Toastify__toast-body')))
.then(element => element.getAttribute("innerText"))
.then(text => {assert.equal('Failed to submit form! [object Object]', text);})
.then(() => driver.sleep(2000))
.then(() => driver.close());
}

function shouldFailToLogWithIncorrectPasword(){
const webdriver = require("selenium-webdriver");
const driver = new webdriver.Builder().forBrowser("chrome").build();
driver.navigate().to("http://localhost:9000/app/login")
.then(() => driver.wait(webdriver.until.elementLocated(webdriver.By.id(emailId))))
.then(emailInput => emailInput.sendKeys(correctEmail))
.then(() => driver.wait(webdriver.until.elementLocated(webdriver.By.id(passwordId))))
.then(passwordInput => passwordInput.sendKeys(incorrectPassword))
.then(() => driver.wait(webdriver.until.elementLocated(webdriver.By.id(submitId))))
.then(submitButton => submitButton.click())
.then(() => driver.sleep(2000))
.then(() => driver.wait(webdriver.until.elementLocated(webdriver.By.className('Toastify__toast Toastify__toast--error'), 10000), 20000))
.then(() => driver.findElement(webdriver.By.className('Toastify__toast Toastify__toast--error')).
findElement(webdriver.By.className('Toastify__toast-body')))
.then(element => element.getAttribute("innerText"))
.then(text => {assert.equal('Failed to submit form! [object Object]', text);})
.then(() => driver.sleep(2000))
.then(() => driver.close());
}



//Run all tests
shouldLogCorrectly();
shouldFailToLogWithIncorrectEmail();
shouldFailToLogWithIncorrectPasword();
