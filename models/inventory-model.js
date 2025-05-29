// Imports the database connection file.
const pool = require("../database/");

/* ***********
 * Get all classification data
 * ***********/
// Creats "asynchronous" function, returns a 'promise' without blocking (stopping) the execution of code (using await). Allows the app to continue and will then deal with the results of the 'promise' when delivered.
async function getClassifications() {
  // 'return' indicates data should be sent to code location that is called in the function, 'await' is part of 'async' structure.
  // Returns the result of the given SQL query, which will be sent to the database server using a pool connection when it is sent back by the database server.
  return await pool.query(
    "SELECT * FROM public.classification ORDER BY classification_name"
  );
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
// declares an async function by name and passes a variable, which should contain the classification_id value, as a parameter.
async function getInventoryByClassificationId(classification_id) {
    // Open a try - catch block
  try {
    /* Creates an SQL query, to read the inventory and classification information from their respective tables using an INNER JOIN. The query is written using a parameterized statement. The $1 is a placeholder, which will be replaced by the value shown in the brackets [], when the SQL statement is run. The SQL is queried against the databse via the database pool. Note the await keyword, which means the query will wait for the information to be returned, where it will be stored in the data variable. */
    const data = await pool.query(
      "SELECT * FROM public.inventory AS i JOIN public.classification AS c  ON i.classification_id = c.classification_id WHERE i.classification_id = $1",
      // Sends the data, as an array of all the rows, back to where the function was called (in the controller).
      [classification_id]
    );
    return data.rows;
    // catch error that will write an error to the console for us to read
  } catch (error) {
    console.error("getclassificationsbyid error " + error);
  }
}

// Get a specific vehicle by inventory id
async function getInventoryById(inv_id) {
  try {
    const data = await pool.query(
      "SELECT * FROM public.inventory WHERE inv_id = $1",
      [inv_id]
    )
    return data.rows[0] // Return a single vehicle object
  } catch (error) {
    console.error("getInventoryById error" + error)
    throw error
  }
}

// Exports function for use elsewhere.
module.exports = { getClassifications, getInventoryByClassificationId, getInventoryById };
