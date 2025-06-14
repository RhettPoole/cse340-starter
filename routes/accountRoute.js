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
    (req, res) => {
        res.status(200).send('login process')
    }
)

module.exports = router;