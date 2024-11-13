import { menuArray } from "./data.js";

// Cache DOM elements
const containerElt = document.getElementById("container");
const menuList = document.getElementById("menu-list");
const orderElt = document.getElementById("order");
const cartDetail = document.getElementById("cart-detail");
const totalPriceElt = document.getElementById("total-price");
const cartDetailModal = document.getElementById("modal-overlay");
const completeOrderBtn = document.getElementById("complete-btn");
const closeBtn = document.getElementById("close-btn");
const cartDetailForm = document.getElementById("card-detail-form");

let cart = [];

// Event Listener for adding and removing items
containerElt.addEventListener("click", onClickContainer);

// Open and close modal events
completeOrderBtn.addEventListener("click", () => cartDetailModal.classList.remove("hidden"));
closeBtn.addEventListener("click", () => cartDetailModal.classList.add("hidden"));

// Submit order form
cartDetailForm.addEventListener("submit", submitCartDetailForm);

function onClickContainer(e) {
    const addBtnId = e.target.dataset.addBtn;
    const removeBtnId = e.target.dataset.remove;

    if (addBtnId) 
        addToCart(addBtnId);

    if (removeBtnId) 
        removeFromCart(removeBtnId);
}

function addToCart(addBtnId) {
    const currentMeal = getMealObject(addBtnId);

    if (cart.length === 0) {
        document.getElementById("order-launched").classList.add("hidden");
        orderElt.classList.remove("hidden");
        orderElt.classList.add("order-layout");
    }

    if (cart[addBtnId]) {
        cart[addBtnId].price += currentMeal.price;
        cart[addBtnId].numberOfItem += 1;
        updateCartItemDisplay(addBtnId);
    } else {
        cart[addBtnId] = { ...currentMeal, numberOfItem: 1 };
        displayOrder(cart[addBtnId], addBtnId);
    }

    updateTotalPrice();
}

function removeFromCart(removeBtnId) {
    const itemIndex = getCartItemIndex(removeBtnId);

    if (itemIndex > -1) {
        cart.splice(itemIndex, 1);
        document.getElementById(`cart-line-${removeBtnId}`).remove();
        
        if (cart.length === 0) {
            orderElt.classList.remove("order-layout");
            orderElt.classList.add("hidden");
        } else {
            updateTotalPrice();
        }
    }
}

function submitCartDetailForm(e) {
    e.preventDefault();

    const clientName = new FormData(cartDetailForm).get("clientName");
    cleanForm();
    showOrderConfirmation(clientName);
}

function showOrderConfirmation(clientName) {
    const orderLaunched = document.getElementById("order-launched");
    const orderLaunchedMessage = document.getElementById("order-launched-message");
    removeAllChildNodes(cartDetail);
    orderElt.classList.add("hidden");
    cartDetailModal.classList.add("hidden");
    orderLaunched.classList.remove("hidden");
    orderLaunchedMessage.textContent = `Thanks, ${clientName}! Your order is on its way!`;
    cart.length = 0;
}

function displayOrder(orderObject, index) {
    cartDetail.insertAdjacentHTML("beforeend", getSingleCartLine(orderObject, index));
}

function updateCartItemDisplay(index) {
    const cartItem = cart[index];
    document.getElementById(`number-of-item-${index}`).textContent = cartItem.numberOfItem > 1 ? `(${cartItem.numberOfItem})` : "";
    document.getElementById(`meal-price-${index}`).textContent = `$${cartItem.price}`;
}

function updateTotalPrice() {
    totalPriceElt.textContent = "$" + getTotalPrice();
}

function getTotalPrice() {
    return cart.reduce((total, item) => total + item.price, 0);
}

function getCartItemIndex(id) {
    return cart.findIndex(item => item.id == id);
}

function getMealObject(id) {
    return menuArray.find(meal => meal.id == id);
}

function getMealHtml(mealObject) {
    return `
        <div class="meal">
            <div class="meal-layout">
                <img alt="An image of a delicious ${mealObject.name}" class="meal-img" src="images/${mealObject.name.toLowerCase()}.png">
                <div class="meal-detail" id="${mealObject.id}">
                    <h2 class="meal-name">${mealObject.name}</h2>
                    <p class="meal-ingredients">${mealObject.ingredients}</p>
                    <p class="meal-price">$${mealObject.price}</p>
                </div>
            </div>
            <button id=${mealObject.id} class="add-btn" data-add-btn=${mealObject.id}>+</button>
        </div>
    `;
}

function getSingleCartLine(mealObject, index) {
    return `
        <div class="cart-line" id="cart-line-${index}">
            <div class="cart-layout">
                <h2 class="meal-name">
                    ${mealObject.name} 
                    <span id="number-of-item-${index}">${mealObject.numberOfItem > 1 ? `(${mealObject.numberOfItem})` : ""}</span>
                    <button class="remove" data-remove="${index}">remove</button>
                </h2>
            </div> 
            <p id="meal-price-${index}" class="meal-price">$${mealObject.price}</p>
        </div>
    `;
}

function getMenuHtml() {
    return menuArray.map(getMealHtml).join("");
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function cleanForm() {
    cartDetailForm.reset();
}

function displayMenu() {
    menuList.innerHTML = getMenuHtml();
}

// Initialize the menu
displayMenu();
