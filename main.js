import './css/style.scss'

const products = [
  {
    id: 0,
    name: 'Product 1',
    price: 35,
    rating: 4,
    amount: 0,
    category: 'sweet',
    img: {
      url: '/assets/photos/home-logo.png',
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
      url: '/assets/photos/home-logo.png',
      width: 100,
      heigt: 100,
      alt: ''
    },
  },
  {
    id: 2,
    name: 'Blå tiger',
    price: 25,
    rating: 2.5,
    amount: 0,
    category: 'animal',
    img: {
      url: '/assets/photos/home-logo.png',
      width: 100,
      heigt: 100,
      alt: ''
    },
  },
];

const cart = [];

const productListDiv = document.querySelector('#product-list');
const orderDiv = document.querySelector('#order-products');
const cartSpan = document.querySelector('#amount-in-cart');


function decreaseAmount(e) {
  const index = e.currentTarget.dataset.id;
  if (products[index].amount <= 0) {
    products[index].amount = 0;
  }
  else {
    products[index].amount -= 1;
    printDonuts();
    printCart();
  }
}

function increaseAmount(e) {
  const index = e.currentTarget.dataset.id;
  products[index].amount += 1;
  printDonuts();
  printCart();
}

function printDonuts() {
  productListDiv.innerHTML = "";

  products.forEach((product, index) => {
    productListDiv.innerHTML += `
    <section class="product-card">
      <img src="${product.img.url}" class="product-image"></img>
      <h3>${product.name}</h3>
      <p>Pris: ${product.price} kr</p>
      <p>Kategori: ${product.category}</p>
      <p>${product.amount} st</p>
      <button data-id="${index}" class="basic-button minus">-</button>
      <button data-id="${index}" class="basic-button plus">+</button>
      <p>${product.rating}</p>
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

function printCart() {
  orderDiv.innerHTML = "";
  
  products.forEach(product =>  {
    if (product.amount > 0) {
      cart.push(product);
    }
  })

  console.log(cart);

  cart.forEach(product => {
    orderDiv.innerHTML += `
    <section class="product-card">
      <img src="${product.img.url}" class="product-image"></img>
      <h3>${product.name}</h3>
      <p>${product.amount} st</p>
      <p>${product.amount * product.price} kr</p>
     </section>
    `
  });

  orderDiv.innerHTML += `
   <button class="basic-button" id="proceedCheckOutBtn">Gå vidare</button>
  `
}


printDonuts();



