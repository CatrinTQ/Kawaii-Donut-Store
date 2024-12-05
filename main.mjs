import './css/style.scss'
import products from './products.mjs';

/* 🦄🦄🦄🦄🦄🦄 JENNI: Kika gärna på varför jag inte får med css på live sidan, tack! */
/* 🦄🦄🦄🦄🦄🦄 är också nyfiken på varför jag inte får use att fungera i sass... */

let selectedProducts = [...products];
let cart = [];

let totalAmount = 0;
let activeDiscount = false;
let discountTotalAmount = 0;
let msg = '';
let deliveryFee = 25;

const productListDiv = document.querySelector('#product-list');
const orderDiv = document.querySelector('#order-products');
const cartSpan = document.querySelector('#amount-in-cart');
const menuBtn = document.querySelector('#menu-button');
const menu = document.querySelector('#menu-div');
const cartLink = document.querySelector('#cart-button');
const orderPage = document.querySelector('#order');
const cartBtnLogo = document.querySelector('#cart-button-2');
const sortNameBtn = document.querySelector('#sort-name-button');
const sortPriceBtn = document.querySelector('#sort-price-button');
const sortRatingBtn = document.querySelector('#sort-rating-button');
const sortCategoryBtn = document.querySelector('#sort-category');
const logo = document.querySelector('#logo');
const today = new Date();
const formPage = document.querySelector('#form');
const invoiceInput = document.querySelector('#payment-invoice');

/* 
###########################################
########### LOGO EFFECT ##################
###########################################
*/

logo.addEventListener('mouseover', () => {
  logo.src="./assets/photos/home-logo-blink.png";
})

logo.addEventListener('mouseout', () => {
  logo.src="./assets/photos/home-logo.png";
})

/* 
###########################################
###########MENU TOGGLE####################
###########################################
*/

menuBtn.addEventListener('click', () => {
  const currentDisplay = getComputedStyle(menu).display;
  if (currentDisplay === "none") {
    menu.style.display = "block";
  } else {
    menu.style.display = "none";
  }
})

cartLink.addEventListener('click', () => {
  const currentDisplay = getComputedStyle(orderPage).display;
  if (currentDisplay === "none") {
    orderPage.style.display = "block";
  } else {
    orderPage.style.display = "none";
  }
})

cartBtnLogo.addEventListener('click', () => {
  const currentDisplay = getComputedStyle(orderPage).display;
  if (currentDisplay === "none") {
    orderPage.style.display = "block";
    menu.style.display = "none";
  } else {
    orderPage.style.display = "none";
  }
})

function resetProductList() {
  selectedProducts = [...products];
}

sortNameBtn.addEventListener('click', () => {
  resetProductList();
  sortByName();
  printDonuts();
})

sortPriceBtn.addEventListener('click', () => {
  resetProductList();
  sortByPrice();
  printDonuts();
})

sortRatingBtn.addEventListener('click', () => {
  resetProductList();
  sortByRating();
  printDonuts();
})

sortCategoryBtn.addEventListener('change', (e) => {
  const category = e.target.value;
  resetProductList();
  sortByCategory(category);
  printDonuts();
})

/* 
###########################################
###########PRINT PRODUCTS##################
###########################################
*/

function printRatingStar(rating) {
  const isHalf = String(rating).indexOf('.');
  let ratingNumber = rating.toString().charAt(0);
  let star = '';
  for (let i = 0; i < ratingNumber; i++) {
    star += `<img src="./assets/icons/rating-donut.png" width="20">`;
  }
  if (isHalf !== -1) {
    star += `<img src="./assets/icons/rating-donut-half.png" width="20">`;
  }
  return star;
}

function decreaseAmount(e) {
  const index = e.currentTarget.dataset.id;
  if (selectedProducts[index].amount <= 0) {
    selectedProducts[index].amount = 0;
  }
  else {
    selectedProducts[index].amount -= 1;
    printDonuts();
    printCart();
    printTotalAmount();
    highlightItemInCart();
  }
}

function increaseAmount(e) {
  const index = e.currentTarget.dataset.id;
  selectedProducts[index].amount += 1;
  printDonuts();
  printCart();
  printTotalAmount();
  highlightItemInCart();
}

function highlightItemInCart() {
  highlightNumber = 0;
  cart.forEach(product => {
    highlightNumber += product.amount;
  })
  if (highlightNumber > 0) {
    highlightnumberofItems.innerHTML = highlightNumber;
    highlightnumberofItems.classList.remove('hidden');
  } else {
    highlightnumberofItems.innerHTML = '';
  }
}

function printDonuts() {
  productListDiv.innerHTML = "";

  selectedProducts.forEach((product, index) => {
    productListDiv.innerHTML += `
    <section class="product-card">
      <img src="${product.img.url}" class="product-image"></img>
      <h3>${product.name}</h3>
      <p>Pris: ${product.price} kr</p>
      <p>Kategori: ${product.category}</p>
      <p>${product.amount} st</p>
      <button data-id="${index}" class="basic-button minus">-</button>
      <button data-id="${index}" class="basic-button plus">+</button>
      <p>${printRatingStar(product.rating)}</p>
     </section>
    `;
  });
  const minusBtn = document.querySelectorAll('button.minus');
  const plusBtn = document.querySelectorAll('button.plus');

  minusBtn.forEach(btn => {
    btn.addEventListener('click', decreaseAmount);
  });

  plusBtn.forEach((btn) => {
    btn.addEventListener('click', increaseAmount);
  });
}

function getCart() {
  cart = [];
  products.forEach(product => {
    if (product.amount > 0)
    cart.push(product);
  })
}

function printCart() {
  getCart();
  totalAmount = getTotalAmount();
  orderDiv.innerHTML = "";
   if (cart  < 1) {
    orderDiv.innerHTML = "varukorgen är tom";
    return;
   }
  calculateDeliveryFee();

  products.forEach(product => {
    if (product.amount > 0) {
      orderDiv.innerHTML+= `
      <div>
        <span>${product.name}</span>
        <span>${product.amount}</span>
        <span>${product.price * product.amount}</span>
      </div>
      `;
    }
  })
  
  orderDiv.innerHTML += `<p>Frakt: ${deliveryFee} kr</p>`;

  checkDiscount();
  if (activeDiscount === false) {
    orderDiv.innerHTML += `<p>Totalt: ${totalAmount} kr</p>
    `;
  } else {
    orderDiv.innerHTML += `
    <p style="text-decoration: line-through;">Totalt: ${totalAmount} kr</p>
    <p>${msg}</p>
    <p>Totalt: ${discountTotalAmount} kr</p>
    `;
  }

  orderDiv.innerHTML += `<button id="proceed-to-check-out" class=basic-button>Gå vidare</button>`;
  
  const checkoutBtn = document.querySelector('#proceed-to-check-out');
  
  checkoutBtn.addEventListener('click', () => {
    const currentDisplay = getComputedStyle(formPage).display;
    // const display = formPage.style.display;
    console.log(currentDisplay);
    if (currentDisplay === "none") {
      formPage.style.display = "block";
    }

    checkInvoceAccess();
  })
}

function printTotalAmount() {  
  getCart();
  let amount = getTotalAmount();
  cartSpan.innerHTML = "";
  
  cartSpan.innerHTML = amount + " kr";
}

function getTotalAmount() {
  totalAmount = 0;
  cart.forEach(product => {
    totalAmount += product.amount * product.price;
  })
  return totalAmount;
}

/* 
###########################################
########### BUSINESS RULES ################
###########################################
*/

function checkDiscount() {

}

function checkMondayDiscount() {
  const today = new Date();
  discountTotalAmount = 0;
  msg = '';
  activeDiscount = false;
  // fram till 10 på morgonen men innan klockan 3
  if (today.getDay() === 1) {
    discountTotalAmount = totalAmount * 0.9;
    msg = "Du får måndagsrabatt, 10% på hela ordern!";
    activeDiscount = true;
  } 
}

function checkWeekendPrice() {
  //Ska gälla från freddag kl ?? till måndag kl 03
  const today = new Date();
  products.forEach(product => {
    product.price *= 1;
  }) 
  if (today.getDay() === 5 && today.getHours > 15 || today.getDate() === 6 || today.getDate() === 0 || today.getDate() === 1 && today.getHours < 10) {
    products.forEach(product => {
      product.price *= 1.15;
    })
  }
}

function calculateDeliveryFee() {
  let itemsInCart = 0;

  cart.forEach(item => {
    itemsInCart += item.amount;
  })

  if (itemsInCart > 15) {
    deliveryFee = "0";
  }
}

function checkInvoceAccess() {
  if (totalAmount > 800 || discountTotalAmount > 800) {
    invoiceInput.disabled = true;
  }
}

function timeoutCustomer() {
  alert('Du är för långsam');
  location.reload();
}

/* 
###########################################
###########SORT FUNCTIONS##################
###########################################
*/

function sortByName() {
  selectedProducts.sort((product1, product2) => product1.name > product2.name);
}

function sortByPrice() {
  selectedProducts.sort((product1, product2) => product1.price - product2.price);
}

function sortByRating() {
  selectedProducts.sort((product1, product2) => product2.rating - product1.rating);
}

function sortByCategory(category) {
  if (category === 'all') {
    return;
  } else {
    selectedProducts = selectedProducts.filter(product => product.category === category);
  }
}

/* 
###########################################
###########FORM FUNCTIONS##################
###########################################
*/


const regexFirstName = RegExp(/^[A-Za-zåäöÅÄÖéèêëáàâäåîïìíóòôöùüûùÿčćşź-]+(\s[A-Za-zåäöÅÄÖéèêëáàâäåîïìíóòôöùüûùÿčćşź-]+)*$/);
const regexLastName = new RegExp(/^[A-Za-zåäöÅÄÖéèêëáàâäåîïìíóòôöùüûùÿčćşź-]+(\s[A-Za-zåäöÅÄÖéèêëáàâäåîïìíóòôöùüûùÿčćşź-]+)*$/);
const regexPhone = new RegExp(/^07([0-9][ -]*){7}[0-9]$/); 
const regexEmail = new RegExp(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/);
const regexAddress = new RegExp(/^(?=.*[A-Za-zÅÄÖåäö])(?=.*\d)[A-Za-zÅÄÖåäö\d\s\-./']+$/);
const regexPostalNumber = new RegExp(/^\d{3}\s?\d{2}$/);
const regexPostalAddress = new RegExp(/^[A-Za-zåäöÅÄÖ\s]+$/);
const regexPersonalNumber = new RegExp(/^(\d{6}|\d{2}\d{2}\d{2})[-]?\d{4}$/);
const regexCardNumber = new RegExp(/^4[0-9]{12}(?:[0-9]{3})?$/);
const regexMonthYear = new RegExp(/^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/);
const regexCvc = new RegExp(/^\d{3,4}$/);

const firstNameInput = document.querySelector('#first-name');
const lastNameInput = document.querySelector('#last-name');
const emailInput = document.querySelector('#email');
const phoneInput = document.querySelector('#phone');
const addressInput = document.querySelector('#address');
const postalNumberInput = document.querySelector('#postal-number');
const postalAddressInput = document.querySelector('#postal-address');
const acceptGdpr = document.querySelector('#accept-gdpr');
const invoiceRadioBtn = document.querySelector('#invoice-radio-button');
const cardRadioBtn = document.querySelector('#card-radio-button');
// const payementInfo = document.querySelector('#payment-info');
const invoiceDiv = document.querySelector('#invoice-field');
const cardDiv = document.querySelector('#card-field');
const personalNumber = document.querySelector('#personal-number');
const cardInfo = document.querySelector('#card-info');
const monthYear = document.querySelector('#month-year');
const cvcCode = document.querySelector('#cvc-code');

let msgFirstName = document.querySelector('#msg-first-name');
let msgLastName = document.querySelector('#msg-last-name');
let msgPhone = document.querySelector('#msg-phone');
let msgEmail = document.querySelector('#msg-email');
let msgAddress =  document.querySelector('#msg-address');
let msgPostalNumber = document.querySelector('#msg-postal-number');
let msgPostalAddress = document.querySelector('#msg-postal-address');
let msgPersonalNumber = document.querySelector('#msg-personal-number');
let msgCardInfo = document.querySelector('#msg-card-info');
let msgMonthYear = document.querySelector('#msg-month-year');
let msgCvcCode = document.querySelector('#msg-cvc-code');

let firstNameRegexResult;
let lastNameRegexResult;
let phoneRegexResult;
let emailRegexResult;
let addresRegexResult;
let postalNumberRegexResult;
let postalAddressRegexResult;
let personalNumberRegexResult;
let cardInfoRegexResult;
let monthYearRegexResult;
let cvcCodeRegexResult;


const placeOrderBtn = document.querySelector('#place-order-button');
const orderConfirmation = document.querySelector('#confirmation-page');
const customerInfo = document.querySelector('#receiver-info');

placeOrderBtn.addEventListener('click', () => {
  const currentDisplay = getComputedStyle(orderConfirmation).display;
  if (currentDisplay === "none") {
    orderConfirmation.style.display = "block";

    customerInfo.innerHTML = `
      <p>${firstNameInput.value} ${lastNameInput.value}</p>
      <p>${addressInput.value}</p>
      <p>${postalNumberInput.value} ${postalAddressInput.value}</p>
      <p>${phoneInput.value}</p>
      <p>${emailInput.value}</p>
    `

  } else {
    orderConfirmation.style.display = "none";
  }

  const form = document.querySelector('#order-form');
  form.reset();
});
 
/******************* TELEFON ***********************/
phoneInput.addEventListener('input', (event) =>{
    const inputValue = event.target.value;
    phoneRegexResult = regexPhone.test(inputValue);

    if(!phoneRegexResult) {
        msgPhone.innerHTML = 'Ogiltigt inmatning';
    } else {
        msgPhone.innerHTML = '';
    }
    checkValidForm();
});

/***************** EMAIL ***********************/
emailInput.addEventListener('input', (event) => {
    const writtenValue = event.target.value; 

    emailRegexResult = regexEmail.test(writtenValue);

    if(!emailRegexResult) {
        msgEmail.innerHTML = 'Ogiltig inmatning';
    } else {
        msgEmail.innerHTML = '';
    }
    checkValidForm();
}); 

addressInput.addEventListener('input', (event) => {
  const writtenValue = event.target.value; 
  addresRegexResult = regexAddress.test(writtenValue);

  if (!addresRegexResult) {
    msgAddress.innerHTML = 'Ogiltigt inmatning';
  } else {
    msgAddress.innerHTML = '';
  }
  checkValidForm();
})

postalNumberInput.addEventListener('input', (event) => {
  const writtenValue = event.target.value; 
  postalNumberRegexResult = regexPostalNumber.test(writtenValue);

  if (!postalNumberRegexResult) {
    msgPostalNumber.innerHTML = 'Ogiltigt inmatning';
  } else {
    msgPostalNumber.innerHTML = '';
  }
  checkValidForm();
})

postalAddressInput.addEventListener('input', (event) => {
  const writtenValue = event.target.value;
  postalAddressRegexResult = regexPostalAddress.test(writtenValue);

  if (!postalAddressRegexResult) {
    msgPostalAddress.innerHTML = 'Ogiltigt inmatning';
  } else {
    msgPostalAddress.innerHTML = '';
  }
  checkValidForm();
})

firstNameInput.addEventListener('input', (event) => {
  const writtenValue = event.target.value;
  firstNameRegexResult = regexFirstName.test(writtenValue);

  if (!firstNameRegexResult) {
    msgFirstName.innerHTML = 'Ogiltigt inmatning';
  } else {
    msgFirstName.innerHTML = '';
  }
  checkValidForm();
})

lastNameInput.addEventListener('input', (event) => {
  const writtenValue = event.target.value;
  lastNameRegexResult = regexLastName.test(writtenValue);

  if (!lastNameRegexResult) {
    msgLastName.innerHTML = 'Ogiltig inmatning';
  } else {
    msgLastName.innerHTML = '';
  }
  checkValidForm();
})

/******************* CHECKBOX GDPR ***********************/
acceptGdpr.addEventListener('change', () => {
  checkValidForm();
});

/******************* CHECK PAYMENT  ***********************/

invoiceRadioBtn.addEventListener('click', () => {
  if (invoiceRadioBtn.checked) {
    if (invoiceDiv.classList.contains('hidden')) {
      invoiceDiv.classList.remove('hidden');
      cardDiv.classList.add('hidden');
    }
  }
  checkValidForm();
});

personalNumber.addEventListener('input', (event) => {
  const writtenValue = event.target.value;
  personalNumberRegexResult = regexPersonalNumber.test(writtenValue);

  if (!personalNumberRegexResult) {
    msgPersonalNumber.innerHTML = 'Ogiltigt format';
  } else {
    msgPersonalNumber.innerHTML = '';
  }
  checkValidForm();
})

cardRadioBtn.addEventListener('click', () => {
  if (cardRadioBtn.checked) {
    if (cardDiv.classList.contains('hidden')) {
      cardDiv.classList.remove('hidden');
      invoiceDiv.classList.add('hidden');
    }
  } 
  checkValidForm();
});

cardInfo.addEventListener('input', (event) => {
  const writtenValue = event.target.value;
  cardInfoRegexResult = regexCardNumber.test(writtenValue);

  if (!cardInfoRegexResult) {
    msgCardInfo.innerHTML = 'Ogiltigt format';
  } else {
    msgCardInfo.innerHTML = '';
  }
  checkValidForm();
});

monthYear.addEventListener('input', (event) => {
  const writtenValue = event.target.value;
  monthYearRegexResult = regexMonthYear.test(writtenValue);

  if (!monthYearRegexResult) {
    msgMonthYear.innerHTML = 'Ogiltigt format';
  } else {
    msgMonthYear.innerHTML = '';
  }
  checkValidForm();
})

cvcCode.addEventListener('input', (event) => {
  const writtenValue = event.target.value;
  cvcCodeRegexResult = regexCvc.test(writtenValue);

  if (!cvcCodeRegexResult) {
    msgCvcCode.innerHTML = 'Ogiltigt format';
  } else {
    msgCvcCode.innerHTML = '';
  }
  checkValidForm();
})

/******************* SUBMIT-BUTTON ***********************/
function checkValidForm() {
  if (firstNameRegexResult && lastNameRegexResult && addresRegexResult && emailRegexResult && phoneRegexResult && postalNumberInput 
    && postalAddressRegexResult && acceptGdpr.checked && invoiceRadioBtn.checked && personalNumberRegexResult ||
    firstNameRegexResult && lastNameRegexResult && addresRegexResult && emailRegexResult && phoneRegexResult && postalNumberInput 
    && postalAddressRegexResult && acceptGdpr.checked && cardRadioBtn.checked && cardInfoRegexResult && monthYearRegexResult && cvcCodeRegexResult) {
    placeOrderBtn.disabled = false;
    placeOrderBtn.style.color = 'green';
    } else {
    placeOrderBtn.disabled = true;
    placeOrderBtn.style.color = 'black';
    // console.log(firstNameRegexResult, lastNameRegexResult, addresRegexResult, emailRegexResult, phoneRegexResult, postalNumberInput,
    // postalAddressRegexResult, acceptGdpr.checked, invoiceRadioBtn.checked, personalNumberRegexResult);
  }
}  
checkWeekendPrice();
printDonuts();
