globalThis.addEventListener("DOMContentLoaded", () => {
  initializeProduct();
  console.log(vitest);
});

const PRODUCT = {
  name: "Classy Modern Smart Watch",
  colors: [
    { name: "Purple", hex: "#8e44ad", image: "./assets/images/img1.jpeg" },
    { name: "Black", hex: "#2c3e50", image: "./assets/images/img2.jpeg" },
    { name: "Blue", hex: "#4c97d3", image: "./assets/images/img3.jpeg" },
    { name: "Cyan", hex: "#1abc9c", image: "./assets/images/img4.jpeg" },
  ],
};

const PRICE = { S: 79.0, M: 89.0, L: 99.0, XL: 109.0 };

// State
let selectedColor = PRODUCT.colors[0];
let selectedSize = "S";
let quantity = 0;
let cart = [];

const productImage = document.getElementById("product-image");
const colorOptions = document.getElementById("color-options");
const sizeOptions = document.getElementById("size-options");
const quantityInput = document.getElementById("quantity");
const addToCartButton = document.getElementById("add-to-cart");
const checkoutButton = document.getElementById("checkout");
const cartCount = document.getElementById("cart-count");
const modal = document.getElementById("modal");
const closeModal = document.getElementById("close-modal");
const cartItems = document.getElementById("cart-items");
const totalQuantity = document.getElementById("total-quantity");
const totalPrice = document.getElementById("total-price");

function initializeProduct() {
  updateProductImage();
  initializeColorOptions();
  initializeSizeOptions();
  updateCartState();
}

function updateProductImage() {
  productImage.src = selectedColor.image;
  productImage.style.borderColor = selectedColor.hex;
}

function initializeColorOptions() {
  colorOptions.innerHTML = "";
  PRODUCT.colors.forEach((color) => {
    const button = document.createElement("button");
    button.style.backgroundColor = color.hex;
    button.innerText = selectedColor.name === color.name ? "✓" : "";
    button.onclick = () => {
      selectedColor = color;
      updateProductImage();
      initializeColorOptions();
    };
    const li = document.createElement("li");
    li.appendChild(button);
    colorOptions.appendChild(li);
  });
}

function initializeSizeOptions() {
  sizeOptions.innerHTML = "";
  Object.keys(PRICE).forEach((size) => {
    const button = document.createElement("button");
    button.innerHTML = `<span>${size}</span>$${PRICE[size]}`;
    button.onclick = () => {
      selectedSize = size;
      initializeSizeOptions();
    };
    if (selectedSize === size) button.classList.add("selected-size");
    const li = document.createElement("li");
    li.appendChild(button);
    sizeOptions.appendChild(li);
  });
}

// Quantity Controls
document.getElementById("increase-quantity").onclick = () => {
  quantity++;
  quantityInput.value = quantity;
  updateCartState();
};

document.getElementById("decrease-quantity").onclick = () => {
  quantity = Math.max(0, quantity - 1);
  quantityInput.value = quantity;
  updateCartState();
};

quantityInput.oninput = (e) => {
  quantity = Math.max(0, Number(e.target.value));
  updateCartState();
};

// Add to Cart

addToCartButton.onclick = () => {
  const existingItem = cart.find(
    (item) => item.color === selectedColor.name && item.size === selectedSize
  );

  if (existingItem) {
    existingItem.quantity += quantity;
    existingItem.price += PRICE[selectedSize] * quantity;
  } else {
    cart.push({
      name: PRODUCT.name,
      color: selectedColor.name,
      size: selectedSize,
      quantity,
      price: PRICE[selectedSize] * quantity,
    });
  }

  updateCartState();
};

// Update Cart State
function updateCartState() {
  addToCartButton.disabled = quantity === 0;
  addToCartButton.style.cursor = quantity === 0 ? "not-allowed" : "pointer";
  checkoutButton.disabled = cart.length === 0;
  checkoutButton.style.cursor = cart.length === 0 ? "not-allowed" : "pointer";
  cartCount.innerText = cart.reduce((sum, item) => sum + item.quantity, 0);
}

checkoutButton.onclick = () => {
  console.log("Checkout button clicked!");
  renderCartItems();
  modal.style.display = "flex";
};

closeModal.onclick = () => {
  console.log("Closing modal...");
  modal.style.display = "none";
};

function renderCartItems() {
  cartItems.innerHTML = "";
  let totalQ = 0;
  let totalP = 0;
  cart.forEach((item) => {
    const row = document.createElement("tr");

    // Get the correct image based on the color of the item
    const itemImage = getImageForColor(item.color);

    row.innerHTML = `
      <td><img src="${itemImage}" alt="${item.name}"/></td>
      <td>${item.name}</td>
      <td>${item.color}</td>
      <td>${item.size}</td>
      <td>${item.quantity}</td>
      <td>$${item.price.toFixed(2)}</td>
    `;
    cartItems.appendChild(row);
    totalQ += item.quantity;
    totalP += item.price;
  });
  totalQuantity.innerText = totalQ;
  totalPrice.innerText = `$${totalP.toFixed(2)}`;
}

// Function to get the image for a given color
function getImageForColor(color) {
  switch (color) {
    case "Purple":
      return "/assets/images/img1.jpeg";
    case "Black":
      return "/assets/images/img2.jpeg";
    case "Blue":
      return "/assets/images/img3.jpeg";
    case "Cyan":
      return "/assets/images/img4.jpeg";
    default:
      return "";
  }
}
