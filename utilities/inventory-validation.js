const { body, validationResult } = require("express-validator");
const utilities = require("../utilities");

const classificationRules = () => [
  body("classification_name")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Classifcation name is required.")
    .matches(/^[A-Za-z0-9]+$/)
    .withMessage("No spaces or special characters allowed."),
];

const checkClassificationData = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Re-render the form with errors and sticky value
    return res.render("inventory/add-classification", {
      title: "Add Classification",
      flashMessage: null,
      errors: errors.array(),
      classification_name: req.body.classification_name,
    });
  }
  next();
};

// Server-side validation for adding to inventory
const inventoryRules = () => [
  body("inv_make").trim().notEmpty().withMessage("Make is required."),
  body("inv_model").trim().notEmpty().withMessage("Model is required."),
  body("inv_year").isInt({ min: 1900, max: 2099 }).withMessage("Year is required and must be valid."),
  body("inv_description").trim().notEmpty().withMessage("Description is required."),
  body("inv_image").trim().notEmpty().withMessage("Image path is required."),
  body("inv_thumbnail").trim().notEmpty().withMessage("Thumbnail path is required."),
  body("inv_price").isFloat({ min: 0 }).withMessage("Price is required and must be a positive number."),
  body("inv_miles").isInt({ min: 0 }).withMessage("Miles is required and must be a positive integer."),
  body("inv_color").trim().notEmpty().withMessage("Color is required."),
  body("classification_id").isInt().withMessage("Classification is required.")
];

// Errors will be directed back to the add inventory view
const checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req);
  let nav = await utilities.getNav();
  let classificationList = await utilities.buildClassificationList(req.body.classification_id);
  if (!errors.isEmpty()) {
    return res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      flashMessage: null,
      errors: errors.array(),
      ...req.body
    });
  }
  next();
};

// Errors will be redirected back to the edit view
const checkUpdateData = async (req, res, next) => {
  const errors = validationResult(req);
  let nav = await utilities.getNav();
  let classificationList = await utilities.buildClassificationList(req.body.classification_id);
  if (!errors.isEmpty()) {
    return res.render("inv/edit", {
      title: "Edit Inventory",
      nav,
      classificationList,
      flashMessage: null,
      errors: errors.array(),
      inv_id: req.body.inv_id, // Add the "inv_id" to the list of variables to hold data from the request body
      ...req.body
    });
  }
  next();
};

module.exports = { classificationRules, checkClassificationData, inventoryRules, checkInventoryData, checkUpdateData };