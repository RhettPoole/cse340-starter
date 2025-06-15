const utilities = require("../utilities");
const { body, validationResult } = require("express-validator"); // the body tool allows the validator to access the body object, which contants all of the data, via the HTTPRequest. validationResult is an object that contains all errors detected by the validation process.
const accountModel = require("../models/account-model")
const validate = {};

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.registrationRules = () => {
  return [
    // Firstname is required but be a string
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name. "), // On error, this message is sent

    // lastname is required and must be a string
    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."), // on error, this message is sent.

    // A valid email is required and cannot already exist in the DB
    body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (emailExists) {
          throw new Error("Email exists. Please login or use a different email")
        }
      }),

    // password is requried and must be a strong password
    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ];
};

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
// Validate is the function, checkRegData is the property of the function, we are building what this property does.
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body // collect and store first/last/email values from the request value. These variables will repopulate the the form if errors are found. (Not including the password).
    let errors = []
    errors = validationResult(req) // Calls express validator function and send the request object as a parameter. All errors will be stored in to the array.
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav() // Calls the nav bar to be queried and built.
        res.render("account/register", { // Calls render function to build the registration view.
            errors,
            title: "Registration",
            nav,
            account_firstname,
            account_lastname,
            account_email,
        })
        return
    }
    next()
}

/*  **********************************
 *  Login Data Validation Rules
 * ********************************* */
validate.loginRules = () => {
  return [
    body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail()
      .withMessage("An email with an existing account is required."),

    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      }),
  ];
};


/*  **********************************
 *  Check Login Data and return errors or continue to the login page.
 * ********************************* */
validate.checkLoginData = async (req, res, next) => {
  const {account_email} = req.body // Collect and store the email so that if there is an error the email will repopulate on the form.
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      errors,
      title: "Login",
      nav,
      account_email,
    })
    return
  }
  next()
}

module.exports = validate