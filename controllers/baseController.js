/* A controller is where the logic of the app resides. It's responsible for determining what action is to be carried out in order to fulfill requests submitted from remote clients. The "base" controller will be responsible only for requests to the app in general and not to specific areas of our app. Such as for later accounts or inventory, those would need to be in a seperate file for organization purposes. */

// Imports the index.js file from the utilities folder.
const utilities = require("../utilities/")
// Creates an empty object named baseController
const baseController = {}

/* Creates an anonymous/asyncronous function and assigns it to 'buildHome' which acts as a method of the baseController object. this essentially creates a mothod within a class where baseController would be the class name abd buildHome would be the method. Being async, it doesn't block the application from executing while it awaits the results of the function to be returned. The function accepts the 'request' and 'response' objects as parameters. */
baseController.buildHome = async function (req, res){
    // Calls 'getNav()' that will be found in the utilities/index.js file. Results (when returned) will be stored in the 'nav' variable as our const.
    const nav = await utilities.getNav()
    // Express command to use EJS to send the index view back to the client, using the 'response' object. The 'index' view will need the 'title' name-value pair, and the nav variable. The nav variable will contain the string of HTML code to render this dynamically generated navigation bar.
    res.render("index", {title: "Home", nav})
}

module.exports = baseController