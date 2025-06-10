const utilities = require("../utilities")

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    console.log("Rendering login view")
    res.render("account/login", {
        title: "Login",
        nav,
    })
}

module.exports = {buildLogin}