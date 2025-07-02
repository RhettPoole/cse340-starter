// Imports the database connection file.
// const { updateInventory } = require("../controllers/invController");
// const { deleteInventoryItem } = require("../controllers/invController");
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
    );
    return data.rows[0]; // Return a single vehicle object
  } catch (error) {
    console.error("getInventoryById error" + error);
    throw error;
  }
}

// Add new classification to table
async function addClassification(classification_name) {
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1)";
    const data = await pool.query(sql, [classification_name]);
    return data.rowCount > 0;
  } catch (error) {
    return false;
  }
}

// Model function for addInventory to table
async function addInventory(item) {
  try {
    const sql = `
      INSERT INTO inventory
      (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
    `;
    const data = await pool.query(sql, [
      item.inv_make, item.inv_model, item.inv_year, item.inv_description,
      item.inv_image, item.inv_thumbnail, item.inv_price, item.inv_miles,
      item.inv_color, item.classification_id
    ]);
    return data.rowCount > 0;
  } catch (error) {
    console.error("DB Error:", error);
    return false;
  }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(
  inv_id,
  inv_make,
  inv_model,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_year,
  inv_miles,
  inv_color,
  classification_id
) {
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
    const data = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
      inv_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

/* ***************************
 *  Carry out the Delete Inventory Data function
 * ************************** */
async function deleteInventory(
  inv_id
) {
  try {
    const sql =
      'DELETE FROM inventory WHERE inv_id = $1'
    const data = await pool.query(sql, [
      inv_id
    ])
    return data
  } catch (error) {
    new Error("Delete Inventory Error")
  }
}

// Exports function for use elsewhere.
module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getInventoryById,
  addClassification,
  addInventory,
  updateInventory,
  deleteInventory
};
