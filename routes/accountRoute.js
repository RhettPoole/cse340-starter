// Bring express to the scope of the file.
const express = require("express")

// Creates a new router object for this router file.
const router = new express.Router()

const utilities = require("../utilities")

const accountController = require("../controllers/accountController")

router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Registration Routes
router.get("/register", utilities.handleErrors(accountController.buildRegister))
router.post('/register', utilities.handleErrors(accountController.registerAccount))

module.exports = router;