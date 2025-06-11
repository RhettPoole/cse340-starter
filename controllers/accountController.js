const utilities = require("../utilities")

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    let errorMessages = req.flash("error")
    res.render("account/login", {
        title: "Login",
        nav,
        errorMessages
    })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    let errorMessages = req.flash("error")
    res.render("account/register", {
        title: "Register",
        nav,
        errorMessages
    })
}

module.exports = {buildLogin, buildRegister}