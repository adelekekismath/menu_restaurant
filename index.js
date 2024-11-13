import {menuArray} from "./data.js"

let containerElt = document.getElementById("container");
let menuList = document.getElementById("menu-list");
let orderELt = document.getElementById("order");
let cartDetail = document.getElementById("cart-detail");
let totalPriceElt = document.getElementById("total-price")
let cartDetailModal = document.getElementById("modal-overlay")
let completeOrderBtn = document.getElementById("complete-btn")
let closeBtn = document.getElementById("close-btn")
let cartDetailForm = document.getElementById("card-detail-form")
let cart = []

containerElt.addEventListener("click", function(e){
    const addBtnId = e.target.dataset.addBtn
    const removeBtnId = e.target.dataset.remove
    displayMenu
    if(addBtnId){
        const currentMeal = getMealObject(addBtnId)
        let mealIsInOrder = false;
        if(cart.length === 0){
            orderELt.classList.toggle("hidden")
            orderELt.classList.add("order-layout")
        }
    
        if(cart[addBtnId]){
            cart[addBtnId].price += currentMeal.price
            cart[addBtnId]
            cart[addBtnId].numberOfItem +=1
            console.log("number-of-item-"+addBtnId)
            document.getElementById("number-of-item-"+addBtnId).textContent= `${cart[addBtnId].numberOfItem > 1 ? `(${cart[addBtnId].numberOfItem})` : ''}`
            document.getElementById("meal-price-"+addBtnId).textContent = `$${cart[addBtnId].price}`
            mealIsInOrder = true;
        } 
        else {
            cart[addBtnId] = {
                id: addBtnId,
                name: currentMeal.name,
                price: currentMeal.price,
                numberOfItem : 1
            }
        }
        
        totalPriceElt.textContent = "$"+getTotalPrice()

        if(!mealIsInOrder){
            displayOrder(cart[addBtnId],cart.indexOf(cart[addBtnId]))
        }
            
    }

    if(removeBtnId){
        const id = getCartItemIndex(removeBtnId)
        document.getElementById("cart-line-"+removeBtnId).remove()
        cart.splice(id,1)

        if(cart.length === 0){
            orderELt.classList.remove("order-layout");
            orderELt.classList.add("hidden");
            return
        }
            
        totalPriceElt.textContent = "$"+getTotalPrice()
        
    }

})

completeOrderBtn.addEventListener("click",function(){
    cartDetailModal.classList.remove("hidden")
})

closeBtn.addEventListener("click",function(){
    cartDetailModal.classList.add("hidden")
})

cartDetailForm.addEventListener("submit", function(e){
    e.preventDefault()
    const cartDetailFormData = new FormData(cartDetailForm)
    const clientName =  cartDetailFormData.get('clientName')
    console.log(cartDetailFormData.getAll('clientName'))
    let orderLaunched = document.getElementById("order-launched")
    let orderLaunchedMessage = document.getElementById("order-launched-message")
    orderELt.classList.add("hidden")
    cartDetailModal.classList.add("hidden")
    orderLaunched.classList.remove("hidden")
    orderLaunchedMessage.textContent = `Thanks, ${clientName}! Your order is on its way!`
    
})


function displayOrder(orderObject,index){
    cartDetail.innerHTML += getSingleCartLine(orderObject,index)
}

function getTotalPrice(){
    return  cart.reduce(function(total, {price}){
        return total + price;
    },0)
}

function getCartItemIndex(id){
    return cart.findIndex(function(item){
        return item.id == id;
    })
}

function getMealHtml(mealObject){
    return `
        <div class="meal">
         <div class="meal-layout">
            <img alt="An image of a delious ${mealObject.name} " class="meal-img" src="images/${mealObject.name.toLowerCase()}.png">
             <div class="meal-detail" id="${mealObject.id}">
                <h2 class="meal-name">${mealObject.name}</h2>
                <p class="meal-ingredients">${mealObject.ingredients}</p>
                <p class="meal-price">$${mealObject.price}</p>
            </div>
            </div>
            <button id=${mealObject.id} class="add-btn" data-add-btn=${mealObject.id}>+</button>
        </div>
    `
}

function getSingleCartLine(mealObject,index){
    return `
        <div class="cart-line" id="cart-line-${index}">
            <div class="cart-layout">
                <h2 class="meal-name">
                    ${mealObject.name} 
                    <span id="number-of-item-${index}"></span>
                    <button class="remove" data-remove="${index}">remove</button>
                </h2>
            </div> 
            <p id="meal-price-${index}" class="meal-price">$${mealObject.price}</p>
        </div>
    `
}

function getMealObject(id){
    const mealIndex = menuArray.findIndex(function(meal){
        return meal.id == id
    })
    return menuArray[mealIndex];
}

function getMenuHtml(){menuArray
    return  menuArray.map(getMealHtml).join("")
}


function displayMenu(){
   menuList.innerHTML += getMenuHtml();

}


displayMenu()