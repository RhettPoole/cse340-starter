// Needed resources below
// Brings Express into the scope of the file
const express = require("express")
// Uses Express to create a new Router object. Using seperate router file for specific elements of the app keeps the server.js file smaller and more manageable.
const router = new express.Router()
// Brings the inventory controller into this router documents scope so we can use it.
const invController = require("../controllers/invController")
// Brings utilities w/ error handling into the router's scope.
const utilities = require("../utilities")

// Route to build inventory by classification view
// 'get' indicates that it's listening for get method call in the webpage.
// /type/:classificationId is the route be watched for.
// invController.buildByClassification indicates the buildByClassification function within the invController is being used to fulfill the request sent by the route.
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build by vehicle by ID.
router.get('/detail/:inv_id', utilities.handleErrors(invController.buildByInventoryId));

// Intentional 500 Error Route
router.get("/cause-error", utilities.handleErrors(invController.causeError));

// Exports the router so we can use it elsewhere.
module.exports = router;