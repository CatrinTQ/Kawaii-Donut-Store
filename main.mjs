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
  }
}

function increaseAmount(e) {
  const index = e.currentTarget.dataset.id;
  selectedProducts[index].amount += 1;
  printDonuts();
  printCart();
  printTotalAmount();
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
  discountTotalAmount = 0;
  msg = '';
  activeDiscount = false;
  if (today.getDay() === 1) {
    discountTotalAmount = totalAmount * 0.9;
    msg = "Du får måndagsrabatt, 10% på hela ordern!";
    activeDiscount = true;
  } 
}

function checkWeekendPrice() {
  products.forEach(product => {
    product.price *= 1;
  }) 
  if (today.getDay() === 5 || today.getDate() === 6 || today.getDate() === 0 || today.getDate() === 1) {
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



checkWeekendPrice();
printDonuts();
