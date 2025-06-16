// Brings the inventory-model.js file into scope and stores its functionality into a invModel variable
const invModel = require("../models/inventory-model");
// Brings the utilities/index.js file into scope and stores it into an utilities variable
const utilities = require("../utilities");

// Creates an empty object in the invCont variable for us to use. This holds all of the controller functions in this file.
const invCont = {};

/* *************
 * Build inventory by classification view
 * *************/
// Creates an async anonymous function which accepts the request and response objects, along wiht the Express next function as parameters. The function is stored into a named method of buildByClassificationId.
invCont.buildByClassificationId = async function (req, res, next) {
  // Collects the classification_id that has been sent, as a named parameter, through the URL and stores it into the classification_id variable.
  // req - request which is sent to the server. params - Express function, used to represent data that is passed in the URL from the client to the server.
  const classification_id = req.params.classificationId;
  // Calls the getInventoryByClassificationId function which is in the inventory-model file and passes the classification_id as a parameter. The function 'awaits' until the data is returned, then stores it into the 'data' variable.
  const data = await invModel.getInventoryByClassificationId(classification_id);
  // Calls a utility function to build a grid, containing all vehicles within that classification. The 'data' array is passed in as a parameter, then stored into the 'grid' variable.
  const grid = await utilities.buildClassificationGrid(data);
  // Calls the function to build the nav bar for use in the view and stores it into the 'nav' variable.
  let nav = await utilities.getNav();
  // Extracts the name of the classification, which matches the classficiation_id, from the data returned form the database and stores it in the className variable.
  const className = data[0].classification_name;
  // Calls the Express render function to return a view to the browser. The view to be returned is named 'classification' which exists in the inventory folder which is inside of the views folder.
  res.render("inventory/classification", {
    // Builds the 'title' value to be used in the head partial, dynamic to match the data.
    title: className + " vehicles",
    // Contains the nav variable, which will display the nav bar.
    nav,
    // Contains the grid variable to display the inventory items.
    grid,
  });
};

invCont.buildByInventoryId = async function (req, res, next) {
  try {
    // Create constant
    const inv_id = req.params.inv_id;
    // Get the vehicle data from the model
    const data = await invModel.getInventoryById(inv_id);
    // Build the nav
    const nav = await utilities.getNav();
    // Build the detail HTML using a utility function
    const detail = await utilities.buildDetailView(data);
    // Set the title using make and model
    const title = `${data.inv_make} ${data.inv_model} Details`;
    // Render the detail view
    res.render("inventory/detail", {
      title,
      nav,
      detail,
    });
  } catch (error) {
    next(error);
  }
};

// Build inventory management view
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav();
  // Get flash message if any
  let flashMessage = req.flash("notice");
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    flashMessage: flashMessage.length ? flashMessage[0] : null,
  });
};

// Serverside logic that delivers the form to user
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav();
  let flashMessage = req.flash("notice");
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    flashMessage: flashMessage.length ? flashMessage[0] : null,
    errors: [],
  });
};

invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  let classificationList = await utilities.buildClassificationList();
  let flashMessage = req.flash("notice");
  res.render("inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    classificationList,
    flashMessage: flashMessage.length ? flashMessage[0] : null,
    errors: [],
    // Stick Values here
  });
};

// Add classification controller function
invCont.addClassification = async function (req, res) {
  const { classification_name } = req.body;
  const result = await invModel.addClassification(classification_name);
  if (result) {
    req.flash("notice", "Classification added successfully!");
    let nav = await utilities.getNav();
    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      flashMessage: req.flash("notice")[0],
    });
  } else {
    res.render("inventory/add-classification", {
      title: "Add Classification",
      flashMessage: "Failed to add classification.",
      errors: [],
      classfication_name,
    });
  }
};

// Controller function for adding to addInventory
invCont.addInventory = async function (req, res) {
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;
  const result = await invModel.addInventory({
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  });
  let nav = await utilities.getNav();
  if (result) {
    req.flash("notice", "Inventory item added successfully!");
    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      flashMessage: req.flash("notice")[0],
    });
  } else {
    res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      flashMessage: "Failed to add inventory item.",
      errors: [],
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    });
  }
};

// Intentional error controller
invCont.causeError = async function (req, res, next) {
  // Throw an error to simulate a server crash
  const err = new Error("Intentional server error");
  err.status = 500;
  throw err;
};

// Exports our invCont object to be used elsewhere.
module.exports = invCont;
