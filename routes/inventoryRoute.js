// Needed resources below
// Brings Express into the scope of the file
const express = require("express")
// Uses Express to create a new Router object. Using seperate router file for specific elements of the app keeps the server.js file smaller and more manageable.
const router = new express.Router()
// Brings the inventory controller into this router documents scope so we can use it.
const invController = require("../controllers/invController")
// Brings utilities w/ error handling into the router's scope.
const utilities = require("../utilities")
// Brings the inventory validation rules into the router's scope.
const invValidate = require("../utilities/inventory-validation");

// Route to build inventory by classification view
// 'get' indicates that it's listening for get method call in the webpage.
// /type/:classificationId is the route be watched for.
// invController.buildByClassification indicates the buildByClassification function within the invController is being used to fulfill the request sent by the route.
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build by vehicle by ID.
router.get('/detail/:inv_id', utilities.handleErrors(invController.buildByInventoryId));

// Intentional 500 Error Route
router.get("/cause-error", utilities.handleErrors(invController.causeError));

// Route to build inventory management view
router.get("/", utilities.checkAccountType, utilities.handleErrors(invController.buildManagement));

// Route for management add-classification view
router.get("/add-classification", utilities.checkAccountType, utilities.handleErrors(invController.buildAddClassification));

// Route for management add-inventory view
router.get("/add-inventory", utilities.checkAccountType, utilities.handleErrors(invController.buildAddInventory));

// Post route for adding classification
router.post("/add-classification", utilities.checkAccountType, invValidate.classificationRules(), invValidate.checkClassificationData, utilities.handleErrors(invController.addClassification));

// Post route for adding to inventory
router.post("/add-inventory", utilities.checkAccountType, invValidate.inventoryRules(), invValidate.checkInventoryData, utilities.handleErrors(invController.addInventory)
);

// Route for modifying classifications
router.get("/getInventory/:classification_id", utilities.checkAccountType, utilities.handleErrors(invController.getInventoryJSON));

// Route for Inv management, edit by ID
router.get("/edit/:inv_id", utilities.checkAccountType, utilities.handleErrors(invController.editInventoryView))

// Route for handling incoming update inv request
router.post("/update/", utilities.checkAccountType, invValidate.inventoryRules(), invValidate.checkUpdateData, invController.updateInventory)

// Route for building the delete confirmation of an inv item by ID
router.get("/delete/:inv_id", utilities.checkAccountType, utilities.handleErrors(invController.buildDeleteInventoryView))

// Route for handling the incoming delete inv item request.
router.post("/delete-confirm/:inv_id", utilities.checkAccountType, utilities.handleErrors(invController.deleteInventoryItem));

// Exports the router so we can use it elsewhere.
module.exports = router;