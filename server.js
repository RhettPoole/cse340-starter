/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project. This file can also be called "index.js" or "app.js"
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const baseController = require("./controllers/baseController")
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const inventoryRoute = require("./routes/inventoryRoute")
const utilities = require("./utilities/")
/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // Not at views root

/* ***********************
 * Routes
 *************************/
// Static Route
app.use(static)
// Index Route
app.get("/", utilities.handleErrors(baseController.buildHome)) // the middleware function that catches any erros generated and sends them to the Express Error Handler.

// Inventory routes - any route that starts with "/inv" will be rerouted to the inventoryRoute.js file to find the rest of the route needed.
// app.use() - an Express function that directs the application to use the resources passed in as parameters.
// /inv - keyword indicating that a route that contains this word will use thie route file to work with inventory-related processes; "inv" is simply a shorter version of "inventory".
// inventoryRoute - our variable representing the inventoryRoute.js file which was required (brough into the scope of the server.js file).
app.use("/inv", inventoryRoute)

// File Not Found Route - must be last route in the list
app.use(async (req, res, next) => {
  // 'next' function to pass control to the next function in the processing chain. An object (error object here) with a status and message is sent.
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
// app.use - Express function, accepts default Express arrow function to be used with errors.
app.use(async (err, req, res, next) => {
  // Builds the nav bar for the error view
  let nav = await utilities.getNav()
  // Prints to the console that an error has occured as well as where it has occured.
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  // This line checks to see if the status code is 404. If so, the default error message - "File Not Found" - is assigned to the "message" property. If it is anything else, a generic message is used.
  if(err.status == 404) { message = err.message } else {message ='Oh no! There was a crash. Maybe try a different route?'}
  // Calls the "error.ejs" view in the "errors" folder.
  res.render("errors/error", {
    // sets the value of the "title" for the view. It will use the status code or "server error" as the title if no status code is set.
    title: err.status || 'Server Error',
    // Sets the message to be displayed in the error view to the message sent in the error object.
    message,
    // Renders the nav bar on the error page.
    nav
  })
})


/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
