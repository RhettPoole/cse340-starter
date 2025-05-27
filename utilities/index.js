// Utilities are meant to be resused over and over, but don't have to follow the typical MVC structure.

// Requires inventory-model file so it can be used to get data from the database.
const invModel = require("../models/inventory-model")
// Creates an empty Util object just like the baseController
const Util = {}

/* ******
* Constructs the nav HTML unordered list
********* */
// Creates an async function which accepts req, res, and next methods as parameters. Then stored in the getNave variable of the Util object.
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

module.exports = Util