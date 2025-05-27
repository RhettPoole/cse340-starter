// Imports the Pool functionality from the "pg or PostGresql". A poole is a collection of connection objects that allows multiple site visitors to be interacting with the database at any given time. Keeps us from having to define seperate connections.
// This file implies that the connection pool will find the information it needs to talk to the database server in the .env file, because of that we need to get that inserted into the .env file.
const { Pool } = require("pg")

// Imports the "dotenv" package allowing sensitive information about the database location and connection credentials to be stored in a seperate location but can still be accessed.
require("dotenv").config()
/* ***************
 * Connection Pool
 * SSL Object needed for local testing of app
 * But will cause problems in production environment
 * If - else will make determination which to use
 * *************** */

// Create local pool variable
let pool
// test to see if code exists in dev environment, as should be declared in the .env file.
if (process.env.NODE_ENV == "development") {
    // Create new pool instance from the imported Pool class
  pool = new Pool({
    // Indicates how pool will connect to the database (using a connectionString) and value that will be stored in a name - value pair.
    // Which is in the .env file locally, and in an "environment variable" on a remote server.
    connectionString: process.env.DATABASE_URL,
    /* SSL is a means of excrypting the flow of information from one network location to another. In this case, when we attempt to communicate with the remote database server from our own computer the code indicates that the server should not reject our connection. However, when we work in a remote production server, the ssl lines must not exist. This is because our application server and the database server will be in the same system and their communication will be secure, which is what we will require. */
    ssl:  false
  })

// Added for troubleshooting queries during development
/* Exports an asynchronous "query" function that accepts the text of the query and any parameters. When the query is run it will add the SQL to the console.log. If the query fails, it will console log the SQL text to the console as an error. This code is primarily for troubleshooting as you develop. As you test the application in your dev mode, have the terminal open, and you will see the queries logged into the terminal as each is executed. */
module.exports = {
  async query(text, params) {
    try {
      const res = await pool.query(text, params)
      console.log("executed query", { text })
      return res
    } catch (error) {
      console.error("error in query", { text })
      throw error
    }
  },
}
/* Creates a new "pool" instance from the "Pool" class. Indicates the value of the connection string will be found in an environment variable. In the production env, this variable will not be stored in our .env file, but in the server's settings. This also exports the pool object to the be used whenever a database connection is needed. */
} else {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  })
  module.exports = pool
}