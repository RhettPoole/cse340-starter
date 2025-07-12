// Bring express to the scope of the file.
const express = require("express")
// Calls our validator utility into scope.
const regValidate = require('../utilities/account-validation')

// Creates a new router object for this router file.
const router = new express.Router()

const utilities = require("../utilities")

const accountController = require("../controllers/accountController")

router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Registration Routes
router.get("/register", utilities.handleErrors(accountController.buildRegister))
router.post('/register', 
    ...regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount))

// Process the login attempt
router.post('/login',
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
)

router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagement));

// Route for update account view
router.get("/update/:account_id", utilities.checkLogin, utilities.handleErrors(accountController.buildUpdateAccount));

// Process the account update
router.post("/update",
    utilities.checkLogin,
    regValidate.accountUpdateRules(),
    regValidate.checkAccountData,
    utilities.handleErrors(accountController.updateAccount)
);

// Process the password update
router.post("/update-password",
    utilities.checkLogin,
    regValidate.passwordRules(),
    regValidate.checkPasswordData,
    utilities.handleErrors(accountController.updatePassword)
);

// Logout route
router.get("/logout", utilities.handleErrors(accountController.accountLogout));

module.exports = router;