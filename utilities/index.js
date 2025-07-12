// Utilities are meant to be resused over and over, but don't have to follow the typical MVC structure.

// Requires inventory-model file so it can be used to get data from the database.
const invModel = require("../models/inventory-model")
// Creates an empty Util object just like the baseController
const Util = {}
// Allows for webtoken and dotenv packages
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ******
* Constructs the nav HTML unordered list
********* */
// Creates an async function which accepts req, res, and next methods as parameters. Then stored in the getNav variable of the Util object.
Util.getNav = async function (req, res, next) {
    // Calls the getClassifications() function from the inventory-model file and stores the returned resultset into the data variable.
    let data = await invModel.getClassifications()
    // Creates a JS variable named list and assigns a string to it. In this case it's the opening of an HTML unordered list.
    let list = "<ul>"
    // Allows an addition to the string to what already excists. Appends a new item for the list, containing a link to the index file.
    list += '<li><a href="/" title="Home page"> Home</a></li>'
    // Use a forEach loop to move through the rows of data array one at a time, each row is assigned to a row variable and is used in the function.
    data.rows.forEach((row) => {
        // Appends an opening list item to the string in the list variable.
        list += "<li>"
        // A string that includes the beginning of an HTML anchor, used to join two strings together. The value in the href attribute is part of a route that will be watched for in an Express router.
        list +=
            '<a href="/inv/type/' +
            row.classification_id +
            '" title="See our inventory of ' +
            row.classification_name + 
            '">' + row.classification_name +
            "</a>"
        list += "</li>"
    })
    list += "</ul>"
    console.log(list)
    return list
}


/* Take an array of inventory items, break each item and its data out of the array and embed it into HTML. When done, there will be a string that will be embedded into the view. */
/* **************************************
* Build the classification view HTML
* ************************************ */
// Declares an async function and expects a data array as a parameter.
Util.buildClassificationGrid = async function(data) {
    let grid // Declares a variable to hold a string
    if(data.length > 0){ // "if" to check that array is not empty.
        grid = '<ul id="inv-display">' // Creates an unordered list and adds it to the 'grid' variable
    data.forEach(vehicle => { // Sets up a 'forEach' loop, to breack each element of the data array into a 'vehicle' object.
      grid += '<li>' // Builds a single <li> element, below is the structure of each element.
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else {  // Else is executed if the 'data' array is empty.
    // Stores a <p> with a message indicating that no vehicles match the classification.
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the inventoryID view HTML
* ************************************ */
Util.buildDetailView = async function(vehicle) {
  if (!vehicle) {
    return "<p>Vehicle not found.</p>";
  }

  // Format price and miles with commas and currency
  const price = Number(vehicle.inv_price).toLocaleString("en-US", {style: "currency", currency: "USD"});
  const miles = Number(vehicle.inv_miles).toLocaleString("en-US");

  return `
  <div class="vehicle-detail">
      <div class="vehicle-detail-image">
        <img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}">
      </div>
      <div class="vehicle-detail-info">
        <h2>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h2>
        <p><strong>Price:</strong> ${price}</p>
        <p><strong>Mileage:</strong> ${miles} miles</p>
        <p><strong>Description:</strong> ${vehicle.inv_description}</p>
        <p><strong>Color:</strong> ${vehicle.inv_color}</p>
      </div>
    </div>
  `;
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
// Util.handleErrors = - Declares the property which is appended to the "Util" object
// fn - accepts req, res, and next as parameters through the arrow function.
// Promis.resolve(fn(req, res, next)) a "wrapper" that accepts a function as a parameter of the "Promise.resolve" function. In other words, the wrapped function is called and attampts to fulfill its normal process, but now does so within a JavaScript promis. If it succeeds, then the promise is resolved and everything continues normally.
// If there is an error, then the Promse "fails", the error that caused the failure is "caught" and forwarded to the next process in application chain.
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ******************************
 * Build Classification list for adding a new classification
 ********************************/
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''> Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) { // If the cookie exists, use the jsonwebtoken "verify" function to check the validity of the token. Takes 3 arguments: the token, secret value, callback function.
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("Please log in")
          res.clearCookie("jwt")
          return res.redirect("/account/login")
        }
        res.locals.accountData = accountData
        res.locals.loggedin = 1
        next()
      })
  } else {
    next()
  }
}

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}

/* ****************************************
 *  Check Account Type for Admin/Employee Access
 * ************************************ */
Util.checkAccountType = (req, res, next) => {
  // FIrst check if the user is logged in
  if(!res.locals.loggedin) {
    req.flash("notice", "Please log in to access this resource.")
    return res.redirect("/account/login")
  }

  // Check if account type is Employee or Admin
  const accountType = res.locals.accountData.account_type
  if (accountType === "Employee" || accountType === "Admin") {
    next() // Allow access
  } else {
    req.flash("notice", "You do not have permissions to access this resource.")
  }
}

module.exports = Util