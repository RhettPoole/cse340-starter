const utilities = require("../utilities");
const accountModel = require("../models/account-model");

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  let errorMessages = req.flash("error");
  res.render("account/login", {
    title: "Login",
    nav,
    errorMessages,
  });
}

/* ****************************************
 *  Deliver registration view
 * *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  let errorMessages = req.flash("error");
  res.render("account/register", {
    title: "Register",
    nav,
    errorMessages,
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

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_password
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
