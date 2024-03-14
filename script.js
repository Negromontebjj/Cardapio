const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")


let cart = [];



//Abrir o Modal do carrinho
cartBtn.addEventListener("click", function(){
  updateCartModal()
  cartModal.style.display = "flex"
  
})

//fechar o modal quando clicar fora
cartModal.addEventListener("click", function(event){
  if(event.target === cartModal){
    cartModal.style.display = "none"
  }
})

//botao fechar o modal 
closeModalBtn.addEventListener("click", function(){
  cartModal.style.display = "none"
})

// pegar os nomes e valores dos produtos
menu.addEventListener("click", function(event){
  let parentButton = event.target.closest(".add-to-cart-btn")
if(parentButton){
  const name = parentButton.getAttribute("data-name")
  const price = parseFloat(parentButton.getAttribute("data-price"))

// Adicionar no carinho
addToCart(name, price)

  
}
})

// funcção para adicionar no carrinho
function addToCart(name, price){

  const existingItem = cart.find(item => item.name ===name)
  if(existingItem){
    existingItem.quantity += 1;

  }else{
    cart.push({
      name,
      price,
      quantity: 1,
    })
  }

  updateCartModal()

}


// atualiza o carrinho
function updateCartModal(){
  cartItemsContainer.innerHTML = "";
  let total = 0;
  cart.forEach(item => {
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

    cartItemElement.innerHTML = `
    <div class="flex item-center justify-between mt-3">
      <div>
        <p class="font-bold">${item.name}<p/>
        <p>Qtd: ${item.quantity}<p/>
        <p class="font-medium mt-2 text-red-600">R$ ${item.price.toFixed(2)}<p/>
      </div>

      
      <button class="remove-from-cart-btn" data-name="${item.name}">
        Remover
      </button>
      

    </div>
    `

    total += item.price * item.quantity;

    cartItemsContainer.appendChild(cartItemElement)
  })

  cartTotal.textContent = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });

  cartCounter.innerHTML = cart.length;


}

// Função para remover item do carrinho

cartItemsContainer.addEventListener("click", function(event){
  if(event.target.classList.contains("remove-from-cart-btn")){
    const name = event.target.getAttribute("data-name")

    removeItemCart(name);
  }
})

function removeItemCart(name){
  const index = cart.findIndex(item => item.name === name);

  if(index !== -1){
    const item = cart[index];

    if(item.quantity > 1){
      item.quantity -= 1;
      updateCartModal();
      return;
    }

    cart.splice(index, 1);
    updateCartModal();
  }
}


// Pegar tudo no campo endereço
addressInput.addEventListener("input", function(event){
  let inputValue = event.target.value;

  if(inputValue !== ""){
    addressInput.classList.remove("border-red-500")
    addressWarn.classList.add("hidden")
  }

})

// verificação se o endereço ta digitado
// finalizar pedido
checkoutBtn.addEventListener("click", function(){

  const isOpen = checkHorario();
  if(!isOpen){
    Toastify({
      text: "Ops! O restaurante encontra-se fechado!",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right",
      stopOnFocus: true,
      style: {
        background: "linear-gradient(to right, #00b09b, #96c93d)",
      }
    }).showToast();
    return;
  }
  

  if(cart.length === 0) return;
  if(addressInput.value === ""){
    addressWarn.classList.remove("hidden")
    addressInput.classList.add("border-red-500")
    return;
  }

  //Enviar o pedido para Whatsapp
  const cartItems = cart.map((item) =>{
    return(
      `${item.name} Quantidade : (${item.quantity}) Preço : R$ ${item.price} |`
      )
  }).join("")

  const message = encodeURIComponent(cartItems)
  const phone = "5581997592087"

  window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")

  cart = [];
  updateCartModal();

})


// Verificar e manipular o cart hora
function checkHorario(){
  const data = new Date();
  const hora = data.getHours();
  return hora >= 18 && hora < 22;
}

const spanItem =  document.getElementById("date-span")
const isOpen = checkHorario();

if(isOpen){
  spanItem.classList.remove("bg-red-500");
  spanItem.classList.add("bg-green-600")
}else{
  spanItem.classList.remove("bg-green-600")
  spanItem.classList.add("bg-red-500")
}
