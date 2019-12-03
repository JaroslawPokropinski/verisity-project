const assert = require('assert');
const delay = require('delay');
const emailId = 'email';
const usernameId = 'username';
const passwordId = 'password';
const reppasswordId = 'rep-password';
const submitId = 'submit';
const correctEmail = "admin@example.com";
const incorrectEmail = "admin1@example.com";
const correctPassword = "adminadmin";
const incorrectPassword = "adminadmin1";
const password = generateRandomString(10);



function shouldRegisterCorrectly(){
const webdriver = require("selenium-webdriver");
const driver = new webdriver.Builder().forBrowser("chrome").build();
driver.navigate().to("http://localhost:9000/app/register")
.then(() => driver.wait(webdriver.until.elementLocated(webdriver.By.id(emailId))))
.then(emailInput => emailInput.sendKeys(generateRandomEmail()))
.then(() => driver.wait(webdriver.until.elementLocated(webdriver.By.id(usernameId))))
.then(usernameInput => usernameInput.sendKeys(generateRandomString(10)))
.then(() => driver.wait(webdriver.until.elementLocated(webdriver.By.id(passwordId))))
.then(passwordInput => passwordInput.sendKeys(password))
.then(() => driver.wait(webdriver.until.elementLocated(webdriver.By.id(reppasswordId))))
.then(reppasswordInput => reppasswordInput.sendKeys(password))
.then(() => driver.sleep(2000))
.then(() => driver.close());
}

function shouldNotRegisterCorrectlyWith2CharacterEmail(){
const webdriver = require("selenium-webdriver");
const driver = new webdriver.Builder().forBrowser("chrome").build();
driver.navigate().to("http://localhost:9000/app/register")
.then(() => driver.wait(webdriver.until.elementLocated(webdriver.By.id(emailId))))
.then(emailInput => emailInput.sendKeys(generateRandomString(2)))
.then(() => driver.wait(webdriver.until.elementLocated(webdriver.By.id(usernameId))))
.then(usernameInput => usernameInput.sendKeys(generateRandomString(10)))
.then(() => driver.wait(webdriver.until.elementLocated(webdriver.By.id(passwordId))))
.then(passwordInput => passwordInput.sendKeys(correctPassword))
.then(() => driver.wait(webdriver.until.elementLocated(webdriver.By.id(reppasswordId))))
.then(reppasswordInput => reppasswordInput.sendKeys(correctPassword))
.then(() => driver.wait(webdriver.until.elementLocated(webdriver.By.id(submitId))))
.then(submitButton => submitButton.click())
.then(() => driver.wait(webdriver.until.elementLocated(webdriver.By.className('Toastify__toast-body'), 1000), 2000))
.then(() => driver.sleep(2000))
.then(() => driver.findElement(webdriver.By.className('Toastify__toast-body')))
.then(element => element.getAttribute("innerText"))
.then(text => {assert.equal('Email must have at least 3 signs', text);})
.then(() => driver.sleep(2000))
.then(() => driver.close());
}

function shouldNotRegisterCorrectlyWithInvalidEmail(){
const webdriver = require("selenium-webdriver");
const driver = new webdriver.Builder().forBrowser("chrome").build();
driver.navigate().to("http://localhost:9000/app/register")
.then(() => driver.wait(webdriver.until.elementLocated(webdriver.By.id(emailId))))
.then(emailInput => emailInput.sendKeys(generateRandomString(10)))
.then(() => driver.wait(webdriver.until.elementLocated(webdriver.By.id(usernameId))))
.then(usernameInput => usernameInput.sendKeys(generateRandomString(10)))
.then(() => driver.wait(webdriver.until.elementLocated(webdriver.By.id(passwordId))))
.then(passwordInput => passwordInput.sendKeys(correctPassword))
.then(() => driver.wait(webdriver.until.elementLocated(webdriver.By.id(reppasswordId))))
.then(reppasswordInput => reppasswordInput.sendKeys(correctPassword))
.then(() => driver.wait(webdriver.until.elementLocated(webdriver.By.id(submitId))))
.then(submitButton => submitButton.click())
.then(() => driver.wait(webdriver.until.elementLocated(webdriver.By.className('Toastify__toast-body'), 1000), 2000))
.then(() => driver.sleep(2000))
.then(() => driver.findElement(webdriver.By.className('Toastify__toast-body')))
.then(element => element.getAttribute("innerText"))
.then(text => {assert.equal('Email must be valid', text);})
.then(() => driver.sleep(2000))
.then(() => driver.close());
}

function shouldNotRegisterCorrectlyWith2CharacterUsername(){
const webdriver = require("selenium-webdriver");
const driver = new webdriver.Builder().forBrowser("chrome").build();
driver.navigate().to("http://localhost:9000/app/register")
.then(() => driver.wait(webdriver.until.elementLocated(webdriver.By.id(emailId))))
.then(emailInput => emailInput.sendKeys(generateRandomEmail()))
.then(() => driver.wait(webdriver.until.elementLocated(webdriver.By.id(usernameId))))
.then(usernameInput => usernameInput.sendKeys(generateRandomString(2)))
.then(() => driver.wait(webdriver.until.elementLocated(webdriver.By.id(passwordId))))
.then(passwordInput => passwordInput.sendKeys(correctPassword))
.then(() => driver.wait(webdriver.until.elementLocated(webdriver.By.id(reppasswordId))))
.then(reppasswordInput => reppasswordInput.sendKeys(correctPassword))
.then(() => driver.wait(webdriver.until.elementLocated(webdriver.By.id(submitId))))
.then(submitButton => submitButton.click())
.then(() => driver.wait(webdriver.until.elementLocated(webdriver.By.className('Toastify__toast-body'), 1000), 2000))
.then(() => driver.sleep(2000))
.then(() => driver.findElement(webdriver.By.className('Toastify__toast-body')))
.then(element => element.getAttribute("innerText"))
.then(text => {assert.equal('Username must have at least 3 signs', text);})
.then(() => driver.sleep(2000))
.then(() => driver.close());
}

function shouldNotRegisterCorrectlyWith7CharacterPassword(){
const webdriver = require("selenium-webdriver");
const driver = new webdriver.Builder().forBrowser("chrome").build();
driver.navigate().to("http://localhost:9000/app/register")
.then(() => driver.wait(webdriver.until.elementLocated(webdriver.By.id(emailId))))
.then(emailInput => emailInput.sendKeys(generateRandomEmail()))
.then(() => driver.wait(webdriver.until.elementLocated(webdriver.By.id(usernameId))))
.then(usernameInput => usernameInput.sendKeys(generateRandomString(10)))
.then(() => driver.wait(webdriver.until.elementLocated(webdriver.By.id(passwordId))))
.then(passwordInput => passwordInput.sendKeys(generateRandomString(7)))
.then(() => driver.wait(webdriver.until.elementLocated(webdriver.By.id(reppasswordId))))
.then(reppasswordInput => reppasswordInput.sendKeys(generateRandomString(7)))
.then(() => driver.wait(webdriver.until.elementLocated(webdriver.By.id(submitId))))
.then(submitButton => submitButton.click())
.then(() => driver.wait(webdriver.until.elementLocated(webdriver.By.className('Toastify__toast-body'), 1000), 2000))
.then(() => driver.sleep(2000))
.then(() => driver.findElement(webdriver.By.className('Toastify__toast-body')))
.then(element => element.getAttribute("innerText"))
.then(text => {assert.equal('Password must have at least 8 signs', text);})
.then(() => driver.sleep(2000))
.then(() => driver.close());
}


function shouldNotRegisterCorrectlyWithExistingEmail(){
const webdriver = require("selenium-webdriver");
const driver = new webdriver.Builder().forBrowser("chrome").build();
driver.navigate().to("http://localhost:9000/app/register")
.then(() => driver.wait(webdriver.until.elementLocated(webdriver.By.id(emailId))))
.then(emailInput => emailInput.sendKeys(correctEmail))
.then(() => driver.wait(webdriver.until.elementLocated(webdriver.By.id(usernameId))))
.then(usernameInput => usernameInput.sendKeys(generateRandomString(10)))
.then(() => driver.wait(webdriver.until.elementLocated(webdriver.By.id(passwordId))))
.then(passwordInput => passwordInput.sendKeys(correctPassword))
.then(() => driver.wait(webdriver.until.elementLocated(webdriver.By.id(reppasswordId))))
.then(reppasswordInput => reppasswordInput.sendKeys(correctPassword))
.then(() => driver.wait(webdriver.until.elementLocated(webdriver.By.id(submitId))))
.then(submitButton => submitButton.click())
.then(() => driver.wait(webdriver.until.elementLocated(webdriver.By.className('Toastify__toast-body'), 1000), 2000))
.then(() => driver.sleep(2000))
.then(() => driver.findElement(webdriver.By.className('Toastify__toast-body')))
.then(element => element.getAttribute("innerText"))
.then(text => {assert.equal('Failed to submit form! [object Object]', text);})
.then(() => driver.sleep(2000))
.then(() => driver.close());
}

function shouldNotRegisterCorrectlyWithDifferendPasswords(){
const webdriver = require("selenium-webdriver");
const driver = new webdriver.Builder().forBrowser("chrome").build();
driver.navigate().to("http://localhost:9000/app/register")
.then(() => driver.wait(webdriver.until.elementLocated(webdriver.By.id(emailId))))
.then(emailInput => emailInput.sendKeys(generateRandomEmail()))
.then(() => driver.wait(webdriver.until.elementLocated(webdriver.By.id(usernameId))))
.then(usernameInput => usernameInput.sendKeys(generateRandomString(10)))
.then(() => driver.wait(webdriver.until.elementLocated(webdriver.By.id(passwordId))))
.then(passwordInput => passwordInput.sendKeys(password))
.then(() => driver.wait(webdriver.until.elementLocated(webdriver.By.id(reppasswordId))))
.then(reppasswordInput => reppasswordInput.sendKeys(generateRandomString(10)))
.then(() => driver.wait(webdriver.until.elementLocated(webdriver.By.id(submitId))))
.then(submitButton => submitButton.click())
.then(() => driver.wait(webdriver.until.elementLocated(webdriver.By.className('Toastify__toast-body'), 1000), 2000))
.then(() => driver.sleep(2000))
.then(() => driver.findElement(webdriver.By.className('Toastify__toast-body')))
.then(element => element.getAttribute("innerText"))
.then(text => {assert.equal('Passwords must be identical', text);})
.then(() => driver.sleep(2000))
.then(() => driver.close());
}

function generateRandomString(length){
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
   return result;
}

function generateRandomEmail(){
    var result = '';
    result += generateRandomString(10);
    result += '@';
    result += generateRandomString(5);
    result += '.com'
    return result;
}


//shouldRegisterCorrectly();
shouldNotRegisterCorrectlyWith2CharacterEmail();
shouldNotRegisterCorrectlyWith2CharacterUsername();
shouldNotRegisterCorrectlyWith7CharacterPassword();
shouldNotRegisterCorrectlyWithExistingEmail();
shouldNotRegisterCorrectlyWithDifferendPasswords();
