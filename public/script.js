async function ambilData() {
  try {
    const response = await fetch("https://fakestoreapi.com/products");
    const data = await response.json();
    const container = document.getElementById("data-product");

    data.forEach((post) => {
      const postElement = document.createElement("div");
      postElement.className = `
        bg-white border border-gray-300 rounded-lg shadow-md 
        flex flex-col p-4 h-full min-h-[400px]
      `;

      postElement.innerHTML = `
        <img src="${post.image}" alt="${post.title}" 
         class="h-40 object-contain mb-4 mx-auto" 
         onclick="goToDetail(${post.id})"/>

        <h2 class="font-semibold text-base mb-2 line-clamp-2 text-center">${post.title}</h2>
        <p class="text-green-600 font-bold text-md text-center mb-2">$${post.price}</p>
        <p class="text-sm text-gray-600 mb-4 line-clamp-2 truncate text-justify flex-grow">${post.description}</p>

        <div class="mt-auto flex gap-2">
          <button
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full text-sm"
          >Add To Cart</button>
        </div>
      `;

      container.appendChild(postElement);
      // Tambahkan event listener untuk tombol Add to Cart
      const addToCartBtn = postElement.querySelector('button.bg-blue-500');
      addToCartBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        tambahKeCart(post);
      });
    });
  } catch (error) {
    console.log("Data Error", error);
  }
}

// Fungsi untuk menambah ke cart dan redirect ke cart.html
function tambahKeCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existing = cart.find(item => item.id == product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  // Redirect ke halaman cart
  alert("Produk telah ditambahkan ke keranjang!");
}
// Fungsi redirect ke halaman detail
function goToDetail(productId) {
  window.location.href = `des.html?id=${productId}`;
}
ambilData();
