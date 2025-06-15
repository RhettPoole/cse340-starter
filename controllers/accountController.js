const utilities = require("../utilities");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
console.log("accountModel loaded:", accountModel);

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
    erros: null,
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

module.exports = { buildLogin, buildRegister, registerAccount };
