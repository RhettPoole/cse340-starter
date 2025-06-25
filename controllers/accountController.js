const utilities = require("../utilities");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
console.log("accountModel loaded:", accountModel);
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Process Login - Started this preemptively on 6.14, doesn't need started yet and hasn't been taught.
 * *************************************** 
async function loginAccount(req, res) {
  let nav = await utilities.getNav();
  const {
    account_email,
    account_password,
  } = req.body;
  const 
} */

/* ****************************************
 *  Deliver registration view
 * *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\`re registered ${account_firstname}. Please log in. `
    );
    let noticeMessages = req.flash("notice");
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      noticeMessages,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    let noticeMessages = req.flash("notice");
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      noticeMessages,
    });
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try { // bcript.compare() takes the incoming plain text password and the hashed password from the db and compares them to see if they match. Returns TRUE or False, which is then evaluated by the "if" statement.
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      // Checks for "dev" as our environment so we can test this using localhost and not just in the browser after pushing our changes.
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, {httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, {httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    console.error("Login error:", error);
    throw new Error('Access Forbidden')
  }
}

async function buildAccountManagement(req, res) {
  let nav = await utilities.getNav();
  res.render("account/accountManagement", { title: "Account Management", nav })
}

module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildAccountManagement };
