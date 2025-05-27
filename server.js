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
app.get("/", baseController.buildHome)
// Inventory routes - any route that starts with "/inv" will be rerouted to the inventoryRoute.js file to find the rest of the route needed.
// app.use() - an Express function that directs the application to use the resources passed in as parameters.
// /inv - keyword indicating that a route that contains this word will use thie route file to work with inventory-related processes; "inv" is simply a shorter version of "inventory".
// inventoryRoute - our variable representing the inventoryRoute.js file which was required (brough into the scope of the server.js file).
app.use("/inv", inventoryRoute)

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
