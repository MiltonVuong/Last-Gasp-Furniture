function inputIsValid(inputPrompt, promptAlt, inputCheck = [], inputType) {
  let input;
  while (true) {
    input = prompt(inputPrompt)?.trim();
    if (input) {
      switch (inputType) {
        case 'string':
          input = input.toLowerCase();
          if (inputCheck.some(item => item.toLowerCase() === input.toLowerCase())) {
            return inputCheck.findIndex(item => item.toLowerCase() === input.toLowerCase());
          }
          break;
        case 'quantity':
          input = Number(input);
          if (!isNaN(input) && Number.isInteger(input) && input > 0) {
            return input;
          }
          break;
      }
    }
    inputPrompt = promptAlt;
  }
}

function purchase() {
  let itemTotal = 0;
  let shippingCost = 0;
  let continueShopping;
  let validInput = false;
  let listItems = '';
  let shipState;
  let subTotal;
  let tax;
  let invoiceTotal;
  const yesNo = ["y", "n"];
  const items = ["Chair", "Recliner", "Table", "Umbrella"];
  const prices = [25.50, 37.75, 49.95, 24.89];
  const postalAbbrs = ["AL", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"];
  const zone5 = ["WA", "OR", "CA", "NV", "AZ", "UT", "ID", "WY", "MT", "NM"];
  const zone4 = ["ND", "SD", "NE", "CO", "OK", "AR", "LA", "MS"];
  const zone3 = ["MN", "WI", "MI", "IA", "IL", "KS", "MO", "TN", "AL", "GA", "FL", "TX"];
  const zone2 = ["IN", "OH", "KY", "WV", "PA", "DE", "MD", "VA", "NC", "SC"];
  let invoiceItem = [];
  let invoiceQuantity = [];
  let invoicePrice = [];
  do {
    let itemQuantity;
    let itemIndex;
    while (!validInput) {
      itemIndex = inputIsValid(`What item would you like to buy today: Chair, Recliner, Table, or Umbrella?`, `Invalid choice, please enter Chair, Recliner, Table, or Umbrella.`, items, 'string');
      invoiceItem.push(items[itemIndex]);
      validInput = true;
    }
    validInput = false;
    while (!validInput) {
      itemQuantity = inputIsValid(`How many ${items[itemIndex]} would you like to buy?`, `Invalid quantity, please enter a number.`, [], 'quantity');
      invoiceQuantity.push(itemQuantity);
      invoicePrice.push(prices[itemIndex]);
      validInput = true;
    }
    validInput = false;
    while (!validInput) {
      continueShopping = inputIsValid(`Continue shopping? y/n`, `Invalid choice, please enter y or n.`, yesNo, 'string');
      validInput = true;
    }
    validInput = false;
  } while (continueShopping === 0);
  while (!validInput) {
    shipState = inputIsValid(`Please enter the two-letter state abbreviation.`, `Invalid choice, please enter a two-letter state abbreviation. \nNote: Shipping only available in the contiguous United States.`, postalAbbrs, 'string');
    validInput = true;
  }
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
    case (itemTotal > 100):
      shippingCost = 0;
      break;
    case zone5.map(state => state.toLowerCase()).includes(postalAbbrs[shipState].toLowerCase()):
      shippingCost = 45;
      break;
    case zone4.map(state => state.toLowerCase()).includes(postalAbbrs[shipState].toLowerCase()):
      shippingCost = 35;
      break;
    case zone3.map(state => state.toLowerCase()).includes(postalAbbrs[shipState].toLowerCase()):
      shippingCost = 30;
      break;
    case zone2.map(state => state.toLowerCase()).includes(postalAbbrs[shipState].toLowerCase()):
      shippingCost = 20;
      break;
    default:
      shippingCost = 0;
  }
  subTotal = itemTotal + shippingCost;
  tax = itemTotal * 0.15;
  invoiceTotal = subTotal + tax;
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