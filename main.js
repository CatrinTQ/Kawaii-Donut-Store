import './css/style.scss'

const products = [
  {
    id: 0,
    name: 'Tiger',
    price: 35,
    rating: 4,
    amount: 0,
    category: 'sweet',
    img: {
      url: './assets/photos/product-image-1.png',
      width: 50,
      heigt: 50,
      alt: ''
    },
  },
  {
    id: 1,
    name: 'Snölejon',
    price: 30,
    rating: 5,
    amount: 0,
    category: 'animal',
    img: {
      url: './assets/photos/product-image-2.png',
      width: 50,
      heigt: 50,
      alt: ''
    },
  },
  {
    id: 2,
    name: 'Blå tiger',
    price: 250,
    rating: 2.5,
    amount: 0,
    category: 'animal',
    img: {
      url: './assets/photos/product-image-3.png',
      width: 50,
      heigt: 50,
      alt: ''
    },
  },
  {
    id: 3,
    name: 'Kanin',
    price: 40,
    rating: 1.5,
    amount: 0,
    category: 'animal',
    img: {
      url: './assets/photos/product-image-4.png',
      width: 50,
      heigt: 50,
      alt: ''
    },
  },
];

let selectedProducts = [];

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
const cartBtn = document.querySelector('#cart-button');
const orderPage = document.querySelector('#order');
const cartBtn2 = document.querySelector('#cart-button-2');
const sortNameBtn = document.querySelector('#sort-name-button');
const sortPriceBtn = document.querySelector('#sort-price-button');
const sortRatingBtn = document.querySelector('#sort-rating-button');
const sortCategoryBtn = document.querySelector('#sort-category');
const logo = document.querySelector('#logo');
const today = new Date();

logo.addEventListener('mouseover', () => {
  logo.src="./assets/photos/home-logo-blink.png";
})

logo.addEventListener('mouseout', () => {
  logo.src="./assets/photos/home-logo.png";
})

menuBtn.addEventListener('click', () => {
  const currentDisplay = getComputedStyle(menu).display;
  if (currentDisplay === "none") {
    menu.style.display = "block";
  } else {
    menu.style.display = "none";
  }
})


cartBtn.addEventListener('click', () => {
  const currentDisplay = getComputedStyle(orderPage).display;
  if (currentDisplay === "none") {
    orderPage.style.display = "block";
  } else {
    orderPage.style.display = "none";
  }
})

cartBtn2.addEventListener('click', () => {
  const currentDisplay = getComputedStyle(orderPage).display;
  if (currentDisplay === "none") {
    orderPage.style.display = "block";
    menu.style.display = "none";
  } else {
    orderPage.style.display = "none";
  }
})

sortNameBtn.addEventListener('click', () => {
  sortByName();
  printDonuts(products);
})

sortPriceBtn.addEventListener('click', () => {
  sortByPrice();
  printDonuts(products);
})

sortRatingBtn.addEventListener('click', () => {
  sortByRating();
  printDonuts(products);
})

sortCategoryBtn.addEventListener('change', (e) => {
  const category = e.target.value;
  if (category === "Alla") {
    printDonuts(products);
  }
  else if (category === "Djur") {
    const optionOne = 'animal';
    sortByCategory(optionOne);
  }
  else if (category === "Söt") {
    const optionOne = 'sweet';
    sortByCategory(optionOne);
  }
})
// PRINT PRODUCTS

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
  if (products[index].amount <= 0) {
    products[index].amount = 0;
  }
  else {
    products[index].amount -= 1;
    printDonuts(products);
    printCart();
    printTotalAmount();
  }
}

function increaseAmount(e) {
  const index = e.currentTarget.dataset.id;
  products[index].amount += 1;
  printDonuts(products);
  printCart();
  printTotalAmount();
}

function printDonuts(productArray) {
  productListDiv.innerHTML = "";

  productArray.forEach((product, index) => {
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

//På måndagar innan kl 10 ska det ges 10% på beställningssumman. I varukorgen ska det stå 10% rabatt

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

  orderDiv.innerHTML += `<button class=basic-button>Gå vidare</button>`;
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

//SORT FUNCTIONS

function sortByName() {
  products.sort((product1, product2) => product1.name > product2.name);
}

function sortByPrice() {
  products.sort((product1, product2) => product1.price - product2.price);
}

function sortByRating() {
  products.sort((product1, product2) => product2.rating - product1.rating);
}

function sortByCategory(category) {
  selectedProducts = [];
  products.forEach(product => {
    if (product.category === category) {
      selectedProducts.push(product);
    }
    printDonuts(selectedProducts);
  }) 
}

function checkInvoceAccess() {
  if (totalAmount > 800 || discountTotalAmount > 800) {

  }
}

checkWeekendPrice();
printDonuts(products);



