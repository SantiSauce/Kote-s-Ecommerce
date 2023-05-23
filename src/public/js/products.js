
// const addToCartBtn = document.getElementById("addProduct__btn");
// const pid = addToCartBtn.value;

// addToCartBtn.addEventListener("click", () => {
//   addToCart(cid, pid);
// });



function addToCart(event) {
  event.preventDefault(); // Evita que se realice la navegación predeterminada

  const url = event.target.getAttribute("href");
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  };

  fetch(url, options)
    .then(response => {
      if (response.status === 200) {
        alert("Producto agregado correctamente");
      }
    })
    .catch(error => {
      console.log(error);
    });
}




// const addToCart = async (cid, pid) => {
//   try {
//     const response = await fetch(`/api/carts/${cid}/product/${pid}`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     const result = await response.json();

//     if (response.status === 200) {
//       alert("Producto agregado correctamente");
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };

