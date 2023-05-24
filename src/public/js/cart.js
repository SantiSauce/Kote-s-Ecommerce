const purchaseBtn = document.getElementById("purchase__btn");

const cid = purchaseBtn.value;
const pid = document.getElementById("plus").value

const plusBtns = document.querySelectorAll(".plus");

// Agregar evento click al botón "CHECKOUT"
purchaseBtn.addEventListener("click", () => {
  redirectToCheckout(cid);
});

// Agregar evento click a los botones de suma
plusBtns.forEach((plusBtn) => {
  plusBtn.addEventListener("click", () => {
    const productId = plusBtn.value;
    addProductToCart(cid, productId);
  });
});

// Redireccionar al proceso de pago (Checkout)
const redirectToCheckout = async (cid) => {
  try {
    console.log(cid);
    const confirmCartResponse = await fetch (`/api/carts/${cid}/confirmCart`, {
      method: "POST",
      headers: {
        "Content-Type" : "application/json",
      },
      body: JSON.stringify({cid}),
    });
    const confirmation = await confirmCartResponse.json()
    
    if(confirmation.message === "confirmed") {
      const response = await fetch("/api/payments/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({cid}),
      });  
      const data = await response.json();
      // Redireccionar al Checkout de Stripe
      if (response.ok) {
        window.location.href = data.payload.url;
      } else {
        console.error(data.error);
      }
    }else{
      alert("Out of stock")
    }
  } catch (error) {
    console.log(error);
  }
};

// Agregar producto al carrito
const addProductToCart = async (cartId, productId) => {
  try {
    const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Actualizar la vista o realizar cualquier otra acción después de agregar el producto al carrito
    if (response.ok) {
      // Realizar alguna acción, como actualizar la cantidad total, mostrar un mensaje de éxito, etc.
    } else {
      console.error("Failed to add product to cart");
    }
  } catch (error) {
    console.log(error);
  }
};
