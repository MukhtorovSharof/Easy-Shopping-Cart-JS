"use strict";

const cartContainer = document.querySelector(".cart-container"),
  productList = document.querySelector(".product-list"),
  cartList = document.querySelector(".cart-list"),
  cartTotalValue = document.querySelector("#cart-total-value"),
  cartCountInfo = document.querySelector("#cart-count-info");

let cartItemID = 1;

function eventListeners() {
  window.addEventListener("DOMContentLoaded", () => {
    loadJson();
    loadCart();
  });

  document.querySelector(".navbar-toggle").addEventListener("click", () => {
    document.querySelector(".navbar-collapse").classList.toggle("show-navbar");
  });

  document.querySelector("#cart-btn").addEventListener("click", () => {
    cartContainer.classList.toggle("show-cart-container");
  });

  productList.addEventListener("click", purchaseProduct);

  cartList.addEventListener("click", deleteProduct);
}

eventListeners();

function updateCartInfo() {
  let cartInfo = findCartInfo();
  cartCountInfo.textContent = cartInfo.productCount;
  cartTotalValue.textContent = cartInfo.total;
}   

function loadJson() {
  fetch("furniture.json")
    .then((response) => response.json())
    .then((data) => {
      let html = "";
      data.forEach((product) => {
        html += `
        <div class="product-item">
          <div class="product-img">
            <img src=${product.imgSrc} alt="pr image" />
            <button type="button" class="add-to-cart-btn">
              <i class="fas fa-shopping-cart"></i>Add to Cart
            </button>
          </div>
          <div class="product-content">
            <h3 class="product-name">${product.name}</h3>
            <span class="product-category">${product.category}</span>
            <p class="product-price">$${product.price}</p>
          </div>
        </div>
        `;
      });
      productList.innerHTML = html;
    })
    .catch((error) => {
      alert("User live server or local server");
    });
}

function purchaseProduct(e) {
  if (e.target.classList.contains("add-to-cart-btn")) {
    let product = e.target.parentElement.parentElement;
    getProductInfo(product);
  }
}

function getProductInfo(product) {
  let productInfo = {
    id: cartItemID,
    imgSrc: product.querySelector(".product-img img").src,
    name: product.querySelector(".product-name").textContent,
    category: product.querySelector(".product-category").textContent,
    price: product.querySelector(".product-price").textContent,
  };
  cartItemID++;
  addToCartList(productInfo);
  saveProductInStorage(productInfo);
}

function addToCartList(productInfo) {
  const cartItem = document.createElement("div");
  cartItem.classList.add("cart-item");
  cartItem.setAttribute("data-id", `${productInfo.id}`);
  cartItem.innerHTML = `
        <img src="${productInfo.imgSrc}" alt="product image" />
        <div class="cart-item-info">
          <h3 class="cart-item-name">${productInfo.name}</h3>
          <span class="cart-item-category">${productInfo.category}</span>
          <span class="cart-item-price">${productInfo.price}</span>
        </div>
        <button type="button" class="cart-item-del-btn">
          <i class="fas fa-times"></i>
        </button>
  `;
  cartList.appendChild(cartItem);
}

function saveProductInStorage(item) {
  let products = getProductFromStorage();
  products.push(item);
  localStorage.setItem("products", JSON.stringify(products));
  updateCartInfo();
}

function getProductFromStorage() {
  return localStorage.getItem("products")
    ? JSON.parse(localStorage.getItem("products"))
    : [];
}

function loadCart() {
  let products = getProductFromStorage();
  if (products.length < 1) {
    cartItemID = 1;
  } else {
    cartItemID = products[products.length - 1].id;
    cartItemID++;
  }
  products.forEach((product) => addToCartList(product));
  updateCartInfo();
}

function findCartInfo() {
  let products = getProductFromStorage();
  let total = products.reduce((acc, product) => {
    let price = parseFloat(product.price.substr(1));
    return (acc += price);
  }, 0);
  return {
    total: total.toFixed(2),
    productCount: products.length,
  };
}

function deleteProduct(e) {
  let cartItem;
  if (e.target.tagName === "BUTTON") {
    cartItem = e.target.parentElement;
    cartItem.remove();
  } else if (e.target.tagName === "I") {
    cartItem = e.target.parentElement.parentElement;
    cartItem.remove();
  }

  let products = getProductFromStorage();
  let updatedProducts = products.filter((product) => {
    return product.id !== parseInt(cartItem.dataset.id);
  });
  localStorage.setItem("products", JSON.stringify(updatedProducts));
  updateCartInfo();
}
