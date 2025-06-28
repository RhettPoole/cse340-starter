'use strict' // This tells the JS parser to follow all of the rules very striclty.


/* The below funciton requests the data, based on the classification_id and catches any errors if they exist, and sends the retrieved data to the buildInventoryList function for building it into HTML and then displays it into the management view. */
// Get a list of items in inventory based on the classification_id
let classificationList = document.querySelector("#classificationList")

/* The below funciton requests the data, based on the classification_id and catches any errors if they exist, and sends 
the retrieved data to the buildInventoryList function for building it into HTML and then displays it into the management view. */
classificationList.addEventListener("change", function () { // Attaches the eventListener to the variable representing the classification select element and listens for any "change". When a change occurs an anonymous function is executed.
    let classification_id = classificationList.value // Captures the new value and stores it.
    console.log(`classification_id is: ${classification_id}`) // Writes the value to the console for testing.
    let classIdURL = "/inv/getInventory/"+classification_id // The URL used to request inv data form the inv controller.
    fetch(classIdURL) // JS "Fetch" - modern method for in itiating an AJAX request.
    .then(function (response) { // "Then" method - waits for data to be returned, then response object is passed into anonymous function for processing.
    if (response.ok) { // "if" test to see if the response was returned successfully. If not, an error occurs.
        return response.json();
    }
    throw Error("Network response was not OK");
    })
    .then(function (data) { // Accepts the JS object and passes it as a parameter to anonymous function.
        console.log(data); // Sends to console for testing
        buildInventoryList(data); // Sends the JS object to a new function that will parse the data into HTML table elements and inject them into the inv management view.
    })
    .catch(function (error) {
        console.log('There was a problem: ',  error.message)
    })
})

// Build inventory items into HTML table components and inject into DOM
function buildInventoryList(data) {
    let inventoryDisplay = document.getElementById("inventoryDisplay");
    // Set up the table labels
    let dataTable = '<thead>';
    dataTable += '<tr><th>Vehicle Name</th><td>&nbsp;</td>&</td></tr>';
    dataTable += '</thead>';
    // Set up the table body
    dataTable += '<tbody>';
    // Iterate over all vehicles in the array and put each in a row
    data.forEach(function (element) {
        console.log(element.inv_id + ", " + element.inv_model);
    dataTable += `<tr><td>${element.inv_make} ${element.inv_model}</td>`;
    dataTable += `<td><a href='/inv/edit/${element.inv_id}' title='Click to update'>Modify</a></td>`;
    dataTable += `<td><a href='/inv/delete/${element.inv_id}' title='Click to delete'>Delete</a></td></tr>`;
    })
    dataTable += '</tbody>';
    // Display the contents in the Inventory Management view
    inventoryDisplay.innerHTML = dataTable;
}