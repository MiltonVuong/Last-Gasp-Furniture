function inputIsValid(inputPrompt, promptAlt, inputCheck = [], inputType) {
  let input;
  while (true) {
    // Prompt the user for input and trim any whitespace
    input = prompt(inputPrompt)?.trim();
    if (input) {
      switch (inputType) {
        case 'string':
          // Convert input to lowercase for case-insensitive comparison
          input = input.toLowerCase();
          // Check if the input matches any item in the inputCheck array (case-insensitive)
          if (inputCheck.some(item => item.toLowerCase() === input.toLowerCase())) {
            // Return the index of the matching item
            return inputCheck.findIndex(item => item.toLowerCase() === input.toLowerCase());
          }
          break;
        case 'quantity':
          // Convert input to a number
          input = Number(input);
          // Check if the input is a valid positive integer
          if (!isNaN(input) && Number.isInteger(input) && input > 0) {
            return input;
          }
          break;
      }
    }
    // Update the prompt message for the next iteration
    inputPrompt = promptAlt;
  }
}

function purchase() {
  // Declare variables
  let itemTotal = 0;
  let shippingCost = 0;
  let continueShopping;
  let validInput = false;
  let listItems = '';
  let shipState;
  let subTotal;
  let tax;
  let invoiceTotal;
  // Arrays for yes/no options, items, prices, and postal abbreviations
  const yesNo = ["y", "n"];
  const items = ["Chair", "Recliner", "Table", "Umbrella"];
  const prices = [25.50, 37.75, 49.95, 24.89];
  const postalAbbrs = ["AK", "DC", "HI", "PR", "VI","AL", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"];
  // Arrays for shipping zones
  // Made assumptions for the mixed shipping zones based on which color they were "mostly"
  // Added unlisted abbreviations to zone5 as noted on the discussion. DC was also added here 
  const zone5 = ["AK", "DC", "HI", "PR", "VI","WA", "OR", "CA", "NV", "AZ", "UT", "ID", "WY", "MT", "NM"];
  const zone4 = ["ND", "SD", "NE", "CO", "OK", "AR", "LA", "MS"];
  const zone3 = ["MN", "WI", "MI", "IA", "IL", "KS", "MO", "TN", "AL", "GA", "FL", "TX"];
  const zone2 = ["IN", "OH", "KY", "WV", "PA", "DE", "MD", "VA", "NC", "SC"];
  // Arrays for invoice details
  let invoiceItem = [];
  let invoiceQuantity = [];
  let invoicePrice = [];
  do {
    let itemQuantity;
    let itemIndex;
    // Loop until a valid item is selected
    while (!validInput) {
      itemIndex = inputIsValid(
        `What item would you like to buy today: Chair, Recliner, Table, or Umbrella?`,
        `Invalid choice, please enter Chair, Recliner, Table, or Umbrella.`,
        items,
        'string'
      );
      invoiceItem.push(items[itemIndex]);
      validInput = true;
    }
    validInput = false;
    // Loop until a valid quantity is entered
    while (!validInput) {
      itemQuantity = inputIsValid(
        `How many ${items[itemIndex]} would you like to buy?`,
        `Invalid quantity, please enter a number.`,
        [],
        'quantity'
      );
      invoiceQuantity.push(itemQuantity);
      invoicePrice.push(prices[itemIndex]);
      validInput = true;
    }
    validInput = false;
    // Loop until a valid choice for continuing is made
    while (!validInput) {
      continueShopping = inputIsValid(
        `Continue shopping? y/n`,
        `Invalid choice, please enter y or n.`,
        yesNo,
        'string'
      );
      validInput = true;
    }
    validInput = false;
  } while (continueShopping === 0);
  // Loop until a valid state abbreviation is entered
  while (!validInput) {
    shipState = inputIsValid(
      `Please enter the two-letter state abbreviation.`,
      `Invalid choice, please enter a two-letter state abbreviation. \nNote: Shipping only available in the contiguous United States.`,
      postalAbbrs,
      'string'
    );
    validInput = true;
  }
  // Calculate the total for each item and build the HTML table rows
  invoiceItem.forEach((item, index) => {
    itemTotal += invoiceQuantity[index] * invoicePrice[index];
    listItems += `<tr>
                    <td class="centered">${item}</td>
                    <td class="centered">${invoiceQuantity[index]}</td>
                    <td class="right">${invoicePrice[index].toFixed(2)}</td>
                    <td class="right">${(invoicePrice[index] * invoiceQuantity[index]).toFixed(2)}</td>
                  </tr>`;
  });
  switch (true) {
    // Free shipping for orders over $100
    case (itemTotal > 100):
      shippingCost = 0;
      break;
      // Shipping cost for Zone 5
    case zone5.map(state => state.toLowerCase()).includes(postalAbbrs[shipState].toLowerCase()):
      shippingCost = 45;
      break;
      // Shipping cost for Zone 4
    case zone4.map(state => state.toLowerCase()).includes(postalAbbrs[shipState].toLowerCase()):
      shippingCost = 35;
      break;
      // Shipping cost for Zone 3
    case zone3.map(state => state.toLowerCase()).includes(postalAbbrs[shipState].toLowerCase()):
      shippingCost = 30;
      break;
      // Shipping cost for Zone 2
    case zone2.map(state => state.toLowerCase()).includes(postalAbbrs[shipState].toLowerCase()):
      shippingCost = 20;
      break;
      // Default shipping cost
    default:
      shippingCost = 0;
  }
  // Calculate the subtotal, tax, and invoice total
  subTotal = itemTotal + shippingCost;
  tax = itemTotal * 0.15;
  invoiceTotal = subTotal + tax;
  // Update the HTML to display the invoice details
  document.getElementById('invoice').innerHTML = `
    <div class="item">
      <div class="item">
        <table>
          <tr>
            <th class="centered">Item</th>
            <th class="centered">Quantity</th>
            <th class="right">Unit Price</th>
            <th class="right">Price</th>
          </tr>
          ${listItems}
        </table>
      </div>
      <hr>
      <div class="item">
        <table>
          <tr>
            <td class="bold">Item Total:</td>
            <td class="right">${itemTotal.toFixed(2)}</td>
          </tr>
          <tr>
            <td class="bold">Shipping to ${postalAbbrs[shipState]}:</td>
            <td class="right">$${shippingCost.toFixed(2)}</td>
          </tr>
          <tr>
            <td class="bold">Subtotal:</td>
            <td class="right">$${subTotal.toFixed(2)}</td>
          </tr>
          <tr>
            <td class="bold">Tax:</td>
            <td class="right">$${tax.toFixed(2)}</td>
          </tr>
          <tr>
            <td class="bold">Invoice Total:</td>
            <td class="right">$${invoiceTotal.toFixed(2)}</td>
          </tr>
        </table>
      </div>
      <br>
      <div class="centered">
        <button onclick="location.reload()">Shop Again</button>
      </div>
    </div>`;
}
