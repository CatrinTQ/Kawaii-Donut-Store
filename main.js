import '/styles.css';
import products from '/products.js';

// HEJ JENNI! Jag har fortfarande inte fått min sida att publicera korrekt på live server, 
// tänker att jag bokar in handledning för det nästa vecka...

let selectedProducts = [...products];
let cart = [];
let totalAmount = 0;
let oldTotalAmount = 0;
let activeDiscount = false;
let msg = '';
let deliveryFee = 0;
let customerTimer = setTimeout(timeoutCustomer, 1000 * 60 * 15);
customerTimer;
let highlightNumber = 0;

const productListDiv = document.querySelector('#product-list');
const orderDiv = document.querySelector('#order-products');
const cartSpan = document.querySelector('#amount-in-cart');
const menuBtn = document.querySelector('#menu-button');
const menu = document.querySelector('#menu-div');
const cartBtnLogo = document.querySelector('#cart-button');
const orderPage = document.querySelector('#order');
const cartLink = document.querySelector('#cart-button-2');
const sortNameBtn = document.querySelector('#sort-name-button');
const sortPriceBtn = document.querySelector('#sort-price-button');
const sortRatingBtn = document.querySelector('#sort-rating-button');
const sortCategoryBtn = document.querySelector('#sort-category');
const logo = document.querySelector('#logo');
const formPage = document.querySelector('#form');
const invoiceInput = document.querySelector('#invoice-radio-button');
const closeForm = document.querySelector('#close-form');
const productPage = document.querySelector('#product-page');
const closeConfirmation = document.querySelector('#close-confirmation');
const productLink = document.querySelector('#product-link');
const resetOrder = document.querySelector('#reset-order')

const toggleButton = document.getElementById('dark-mode-toggle');
const html = document.documentElement;

resetOrder.addEventListener('click', resetCart);
const spans = document.querySelectorAll('span.info');

function removeInfoMessage() {
  spans.forEach(span => {
    span.classList.add('hidden');
  });
}

function resetCart() {
  clearCart();
  printDonuts();
  printCart();
  highlightItemInCart();
  printTotalAmount();
  removeInfoMessage();
  console.log('test');
}

toggleButton.addEventListener('click', () => {
  if (toggleButton.innerHTML == 'Dark mode') {
    html.classList.toggle('dark');
    toggleButton.innerHTML = 'Light mode';
  } else {
    html.classList.toggle('dark');
    toggleButton.innerHTML = 'Dark mode';
  }
});

/* 
###########################################
########### LOGO EFFECT ##################
###########################################
*/

logo.addEventListener('mouseover', () => {
  logo.src="photos/home-logo-blink.png";
})

logo.addEventListener('mouseout', () => {
  logo.src="photos/home-logo.png";
})

logo.addEventListener('click', () => {
  productPage.classList.remove('hidden');
  cardDiv.classList.add('hidden');
  orderPage.classList.add('hidden');
  formPage.classList.add('hidden');
  menu.classList.add('hidden');
})

/* 
###########################################
###########MENU TOGGLE####################
###########################################
*/
menuBtn.addEventListener('click', () => {
  if (menu.classList.contains('hidden')) {
    menu.classList.remove('hidden');
    orderPage.classList.add('hidden');
    productPage.classList.add('hidden');
    formPage.classList.add('hidden');
  } else {
    menu.classList.add('hidden');
    productPage.classList.remove('hidden');
  }
})

cartLink.addEventListener('click', () => {
  if (orderPage.classList.contains('hidden')) {
    orderPage.classList.remove('hidden');
    menu.classList.add('hidden');
  } else {
    orderPage.classList.add('hidden');
  }
})

productLink.addEventListener('click', () => {
  if (productPage.classList.contains('hidden')) {
    productPage.classList.remove('hidden');
    menu.classList.add('hidden');
  } else {
    productPage.classList.add('hidden');
  }
})

cartBtnLogo.addEventListener('click', () => {
  if (orderPage.classList.contains('hidden')) {
    orderPage.classList.remove('hidden');
    menu.classList.add('hidden');
    productPage.classList.add('hidden');
    
  } else {
    orderPage.classList.add('hidden');
    productPage.classList.remove('hidden');
  }
})

closeConfirmation.addEventListener('click', () => {
  orderConfirmation.classList.add('hidden');
  productPage.classList.remove('hidden');
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

closeForm.addEventListener('mouseover', () => {
  closeForm.classList.remove('ml-4');
  closeForm.classList.add('ml-2');
})

closeForm.addEventListener('mouseout', () => {
  closeForm.classList.add('ml-4');
  closeForm.classList.remove('ml-2');
})

closeForm.addEventListener('click', () => {
  formPage.classList.add('hidden');
  orderPage.classList.remove('hidden');
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
    star += `<img src="photos/rating-donut.png" width="20">`;
  }
  if (isHalf !== -1) {
    star += `<img src="photos/rating-donut-half.png" width="20">`;
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
  });

  const highlightnumberofItems = document.getElementById('number-of-donuts');

  if (highlightNumber > 0) {
    highlightnumberofItems.innerHTML = highlightNumber;
    highlightnumberofItems.classList.remove('hidden'); 

    highlightnumberofItems.classList.remove('scale-100');
    highlightnumberofItems.classList.add('scale-125');

    highlightnumberofItems.classList.add('bg-yellow-400');

    setTimeout(() => {
      highlightnumberofItems.classList.remove('scale-125');
      highlightnumberofItems.classList.add('scale-100');

      highlightnumberofItems.classList.remove('bg-yellow-400');
      highlightnumberofItems.classList.add('bg-red-400');
    }, 500); 
  } else {
    highlightnumberofItems.classList.remove('scale-100'); 
    highlightnumberofItems.classList.add('scale-90');

    setTimeout(() => {
      highlightnumberofItems.classList.add('hidden');
      highlightnumberofItems.classList.remove('scale-90');
    }, 500); 
  }
}

function printDonuts() {
  productListDiv.innerHTML = "";

  selectedProducts.forEach((product, index) => {
    productListDiv.innerHTML += `
    <section class="flex items-center content-center gap-4 hover:bg-yellow-100 dark:hover:bg-gray-500">
      <img src="${product.img.url}" class="product-image" alt="${product.img.alt}" width="${product.img.width}" height="${product.img.height}"></img>
      <div class="gap-1">
        <h3>${product.name}</h3>
        <p>Pris: ${Math.round(product.price)} kr</p>
        <p class="flex flex-row">Betyg: ${printRatingStar(product.rating)}</p>
        <p>Kategori: ${product.category}</p>

        <div class="flex items-center">
          <button data-id="${index}" class="basic-button minus rounded-md hover:scale-105 hover:shadow-lg" aria-label="Minska antal ${product.name}">-</button>
          <p class="min-w-32">${product.amount} st</p>
          <button data-id="${index}" class="basic-button plus rounded-md hover:scale-105 hover:shadow-lg" aria-label="Öka antal ${product.name}">+</button>
        </div>
      </div>
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
  selectedProducts.forEach(product => {
    if (product.amount > 0)
    cart.push(product);
  })
}

function printCart() {
  orderDiv.innerHTML = "";
  getCart();
   if (cart  < 1) {
    orderDiv.innerHTML = "varukorgen är tom";
    return;
   } else {
    cart.forEach(product => {
      if (product.amount > 0) {
        orderDiv.innerHTML+= `
            <div class="flex gap-4">
              <img src="${product.img.url}" class="cart-image" />
              
              <div class="flex flex-col justify-center gap-2">
                <span>${product.name}</span>
                <span>${product.amount}st à ${product.price}kr</span>
                <span>${product.amount * product.price}kr</span>
              </div>   
            </div>
        `;
      }
    })

    totalAmount = getTotalAmount();
    checkDiscount();
    checkMondayDiscount();
    calculateDeliveryFee();

    if (activeDiscount) {
      orderDiv.innerHTML += `
      <p style="text-decoration: line-through;">Summa: ${oldTotalAmount} kr</p>
      <p class="pb-5 pt-5">${msg}</p>
      <p>Ny summa: ${totalAmount} kr</p>
      `;
    } else if (discount > 0 && !activeDiscount) {
      orderDiv.innerHTML += `
      <p style="text-decoration: line-through;">Summa: ${totalAmount + discount} kr</p>
      <p>Rabatt: ${discount}</p>
      <p>Ny summa: ${totalAmount} kr</p>
      <p>Du får 10% mängdrabatt på munkar som du beställt 10 eller mer av 😊</p>
      `;
    } else {
      orderDiv.innerHTML += 
    `
      <p>Summa: ${totalAmount}</p>
      `
    }
    orderDiv.innerHTML += 
    `
    <p class="">Frakt: ${Math.round(deliveryFee)} kr</p>
    <p>Summa att betala: ${Number(totalAmount) + Number(deliveryFee)}</p>
    <div class="flex gap-2">
      <label>Rabattkod</label>
      <input id="discount-field" type="text" class="w-20">
      <button>Aktivera</button>
    </div>
    `;
    
    orderDiv.innerHTML += `<button id="proceed-to-check-out" class=basic-button cart-button>Gå vidare</button>`;
    
    const checkoutBtn = document.querySelector('#proceed-to-check-out');
    
    checkoutBtn.addEventListener('click', () => {
      formPage.classList.remove('hidden');
      orderPage.classList.add('hidden');

      checkValidForm();
      checkInvoceAccess();
    })
  }
}

function printTotalAmount() {  
  getCart();
  let amount = Math.round(getTotalAmount());
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

function clearCart() {
  selectedProducts.forEach(product => {
    product.amount = 0;
  });
}

/* 
###########################################
########### BUSINESS RULES ################
###########################################
*/

let discount = 0;

function checkDiscount() {
  discount = 0;
  cart.forEach(item => {
    if (item.amount >= 10) {
      discount += (item.price * item.amount) * 0.1; 
      msg = "Du får 10% mängdrabatt på munkar som du beställt 10 eller mer av 😊";
    }
  });
  totalAmount -= discount;
}

function checkMondayDiscount() {
  const today = new Date();
  msg = '';
  activeDiscount = false;
  // fram till 10 på morgonen men innan klockan 3
  if (today.getDay() === 1 && today.getHours < 10) {
    oldTotalAmount = totalAmount;
    totalAmount = totalAmount * 0.9;
    msg = "Du får måndagsrabatt, 10% på hela ordern 😊";
    activeDiscount = true;
  } 
}

function checkWeekendPrice() {
  //Ska gälla från freddag kl 15 till måndag kl 03
  const today = new Date();
  products.forEach(product => {
    product.price *= 1;
  }) 
  if (today.getDay() === 5 && today.getHours > 15 || today.getDay() === 6 || today.getDay() === 0 || today.getDay() === 1 && today.getHours < 10) {
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
  } else {
    deliveryFee = 0;
    deliveryFee = 25 + (totalAmount * 0.1);
  }
}

function checkInvoceAccess() {
  if (totalAmount > 800) {
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
const regexAddress = RegExp(/^[A-Za-zåäöÅÄÖéÉèÈóÓçÇüÜß\- ]+(\s\d+[A-Za-z]?)?(,\s?\d{3}\s?\d{2}\s[A-Za-zåäöÅÄÖéÉèÈóÓçÇüÜß\- ]+)?$/);
const regexPostalNumber = new RegExp(/^[0-9]{3}\s?[0-9]{2}$/);
const regexPostalAddress = new RegExp(/^^[A-Za-zåäöÅÄÖéèêëáàâäåîïìíóòôöùüûùÿčćşź-]+(\s[A-Za-zåäöÅÄÖéèêëáàâäåîïìíóòôöùüûùÿčćşź-]+)*$/);
const regexPhone = new RegExp(/^0\d{9}$/); 
const regexEmail = new RegExp(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/);
const regexPersonalNumber = new RegExp(/^(\d{10}|\d{12}|\d{6}-\d{4}|\d{8}-\d{4}|\d{8} \d{4}|\d{6} \d{4})/);

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
const invoiceDiv = document.querySelector('#invoice-field');
const cardDiv = document.querySelector('#card-field');
const personalNumber = document.querySelector('#personal-number');

let firstNameRegexResult;
let lastNameRegexResult;
let phoneRegexResult;
let emailRegexResult;
let addresRegexResult;
let postalNumberRegexResult;
let postalAddressRegexResult;
let personalNumberRegexResult;

const placeOrderBtn = document.querySelector('#place-order-button');
const orderConfirmation = document.querySelector('#confirmation-page');
const customerInfo = document.querySelector('#receiver-info');

placeOrderBtn.addEventListener('click', () => {
  orderConfirmation.classList.remove('hidden');
  customerInfo.innerHTML = `
    <p>${firstNameInput.value} ${lastNameInput.value}</p>
    <p>${addressInput.value}</p>
    <p>${postalNumberInput.value} ${postalAddressInput.value}</p>
    <p>${phoneInput.value}</p>
    <p>${emailInput.value}</p>
  `
  
  clearCart();
  printCart();
  highlightItemInCart();
  printTotalAmount();
  formPage.classList.add('hidden');
  const form = document.querySelector('#order-form');
  form.reset();
});

/**************FIRST NAME **************** */
firstNameInput.addEventListener('input', (event) => {
  const writtenValue = event.target.value;

  const accept = document.querySelector('#accept-name');
  const error = document.querySelector('#error-name');

  firstNameRegexResult = regexFirstName.test(writtenValue);

  if (!firstNameRegexResult) {
    accept.classList.add('hidden');
    error.classList.remove('hidden');
  } else {
    accept.classList.remove('hidden');
    error.classList.add('hidden');
  }
  checkValidForm();
});

/**************LAST NAME **************** */
lastNameInput.addEventListener('input', (event) => {
  const writtenValue = event.target.value;

  const accept = document.querySelector('#accept-last-name');
  const error = document.querySelector('#error-last-name');

  lastNameRegexResult = regexLastName.test(writtenValue);

  if (!lastNameRegexResult) {
    accept.classList.add('hidden');
    error.classList.remove('hidden');
  } else {
    accept.classList.remove('hidden');
    error.classList.add('hidden');
  }
  checkValidForm();
});

/***************** ADRESS ***********************/
addressInput.addEventListener('input', (event) => {
  const writtenValue = event.target.value; 
  
  const accept = document.querySelector('#accept-address');
  const error = document.querySelector('#error-address');
  addresRegexResult = regexAddress.test(writtenValue);

  if (!addresRegexResult) {
    accept.classList.add('hidden');
    error.classList.remove('hidden');
  } else {
    accept.classList.remove('hidden');
    error.classList.add('hidden');
  }
  checkValidForm();
})

/***************** POSTNUMMER ***********************/
postalNumberInput.addEventListener('input', (event) => {
  const writtenValue = event.target.value; 

  const accept = document.querySelector('#accept-postal-number');
  const error = document.querySelector('#error-postal-number');

  postalNumberRegexResult = regexPostalNumber.test(writtenValue);

  if (!postalNumberRegexResult) {
    accept.classList.add('hidden');
    error.classList.remove('hidden');
  } else {
    accept.classList.remove('hidden');
    error.classList.add('hidden');
  }
  checkValidForm();
})

/***************** POSTADRESS ***********************/
postalAddressInput.addEventListener('input', (event) => {
  const writtenValue = event.target.value;

  const accept = document.querySelector('#accept-postal');
  const error = document.querySelector('#error-postal');

  postalAddressRegexResult = regexPostalAddress.test(writtenValue);

  if (!postalAddressRegexResult) {
    accept.classList.add('hidden');
    error.classList.remove('hidden');
  } else {
    accept.classList.remove('hidden');
    error.classList.add('hidden');

  }
  checkValidForm();
})

/******************* TELEFON ***********************/
phoneInput.addEventListener('input', (event) =>{
    const inputValue = event.target.value;
    const accept = document.querySelector('#accept-phone');
    const error = document.querySelector('#error-phone');

    phoneRegexResult = regexPhone.test(inputValue);

    if(!phoneRegexResult) {
      accept.classList.add('hidden');
      error.classList.remove('hidden');
    } else {
      accept.classList.remove('hidden');
      error.classList.add('hidden');
    }
    checkValidForm();
});

/***************** EMAIL ***********************/
emailInput.addEventListener('input', (event) => {
    const writtenValue = event.target.value; 
    
    const acceptEmail = document.querySelector('#accept-email');
    const errorEmail = document.querySelector('#error-email');
    
    emailRegexResult = regexEmail.test(writtenValue);

    if(!emailRegexResult) {
      acceptEmail.classList.add('hidden');
      errorEmail.classList.remove('hidden');
    } else {
      acceptEmail.classList.remove('hidden');
      errorEmail.classList.add('hidden');
    }
    checkValidForm();
}); 

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

/***************** PERSONNUMMER ***********************/
personalNumber.addEventListener('input', (event) => {
  const writtenValue = event.target.value;

  const accept = document.querySelector('#accept-personal');
  const error = document.querySelector('#error-personal');

  personalNumberRegexResult = regexPersonalNumber.test(writtenValue);

  if (!personalNumberRegexResult) {
    accept.classList.add('hidden');
    error.classList.remove('hidden');
  } else {
    accept.classList.remove('hidden');
    error.classList.add('hidden');
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


/******************* SUBMIT-BUTTON ***********************/
function checkValidForm() {
  if (firstNameRegexResult && lastNameRegexResult && addresRegexResult && emailRegexResult && phoneRegexResult && postalNumberInput 
    && postalAddressRegexResult && acceptGdpr.checked && invoiceRadioBtn.checked && personalNumberRegexResult ||
    firstNameRegexResult && lastNameRegexResult && addresRegexResult && emailRegexResult && phoneRegexResult && postalNumberInput 
    && postalAddressRegexResult && acceptGdpr.checked && cardRadioBtn.checked) {
    placeOrderBtn.disabled = false;
    placeOrderBtn.style.color = 'green';
    } else {
    placeOrderBtn.disabled = true;
    placeOrderBtn.style.color = 'black';
    }
}  
checkValidForm();
checkWeekendPrice();
printDonuts();
