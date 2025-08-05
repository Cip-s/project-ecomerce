document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  if (productId) {
    // Kalau di halaman detail produk
    loadProductDetail(productId);

    const addToCartBtn = document.getElementById("add-to-cart");
    if (addToCartBtn) {
      addToCartBtn.addEventListener("click", () =>
        tambahKeKeranjang(productId)
      );
    }
  } else {
    // Kalau di halaman cart
    tampilkanCart();
  }
});

// ======================
// === DETAIL PRODUK ====
// ======================
async function loadProductDetail(id) {
  try {
    const res = await fetch(`https://fakestoreapi.com/products/${id}`);
    const data = await res.json();

    document.getElementById("product-image").src = data.image;
    document.getElementById("product-title").textContent = data.title;
    document.getElementById("product-price").textContent =
      "$. " + data.price.toLocaleString("id-ID");
    document.getElementById("product-description").textContent =
      data.description;

    // Tampilkan rating dan stock jika ada elemen-nya
    if (data.rating && document.getElementById("product-rating")) {
      document.getElementById("product-rating").textContent =
        `Rating: ${data.rating.rate} (${data.rating.count} reviews)`;
    }

    // Simpan data sementara buat add-to-cart
    window.currentProduct = {
      id: data.id,
      title: data.title,
      image: data.image,
      price: data.price,
      quantity: 1,
      color: "Default",
      package: "Standard",
    };
  } catch (err) {
    document.getElementById("product-description").textContent =
      "Gagal memuat data produk.";
  }
}

function tambahKeKeranjang(productId) {
  if (!window.currentProduct) return;

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const index = cart.findIndex((item) => item.id === window.currentProduct.id);

  if (index !== -1) {
    cart[index].quantity += 1;
  } else {
    cart.push(window.currentProduct);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Produk ditambahkan ke keranjang!");
}
//----Buy Now Button
document.getElementById("buy-now-btn")?.addEventListener("click", () => {
  if (!window.currentProduct) return;

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const index = cart.findIndex((item) => item.id === window.currentProduct.id);

  if (index !== -1) {
    cart[index].quantity += 1;
  } else {
    cart.push(window.currentProduct);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Produk dibeli! Silakan cek keranjang Anda.");
  window.location.href = "cart.html"; // Redirect ke halaman keranjang
}); 

// ==================
// === CART PAGE ====
// ==================
function tampilkanCart() {
  const cartContainer = document.getElementById("cart-items");
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const summaryItems = document.getElementById("summary-items");
  const summarySubtotal = document.getElementById("summary-subtotal");
  const summaryTotal = document.getElementById("summary-total");
  const totalItems = document.getElementById("total-items");

  if (
    !cartContainer ||
    !summaryItems ||
    !summarySubtotal ||
    !summaryTotal ||
    !totalItems
  )
    return;

  cartContainer.innerHTML = "";
  let totalQty = 0;

  if (cart.length === 0) {
    cartContainer.innerHTML = `<p class="text-gray-500">Keranjang kamu kosong.</p>`;
    summaryItems.textContent = "0";
    summarySubtotal.textContent = "$ 0";
    summaryTotal.textContent = "$ 0";
    totalItems.textContent = "0";
    return;
  }

  cart.forEach((item, index) => {
    const el = document.createElement("div");
    el.className = "flex gap-4 border-b pb-4 mb-4 items-start";

    el.innerHTML = `
      <input type="checkbox" class="item-checkbox mt-2" data-index="${index}" />
      <img src="${item.image}" alt="${
      item.title
    }" class="w-24 h-24 object-contain" />
      <div class="flex-1">
        <h3 class="font-semibold">${item.title}</h3>
        <p class="text-sm text-gray-500">Color: ${item.color} | Package: ${
      item.package
    }</p>
        <p class="text-sm">Qty: ${item.quantity}</p>
        <p class="text-sm font-medium text-gray-700">Price: $. ${item.price.toLocaleString(
          "id-ID"
        )}</p>
      </div>
      <button onclick="hapusItem(${index})" class="text-red-500 text-sm hover:underline">Cancel</button>
    `;
    cartContainer.appendChild(el);
  });

  // Tambahkan event listener untuk checkbox
  function updateSummaryFromCheckedItems() {
    const checkboxes = document.querySelectorAll(".item-checkbox");
    let subtotal = 0;
    let totalQty = 0;

    checkboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        const index = parseInt(checkbox.dataset.index);
        const item = cart[index];
        subtotal += item.price * item.quantity;
        totalQty += item.quantity;
      }
    });

    summaryItems.textContent = totalQty;
    summarySubtotal.textContent = `$ ${subtotal.toLocaleString("id-ID")}`;
    summaryTotal.textContent = `$ ${subtotal.toLocaleString("id-ID")}`;
    totalItems.textContent = totalQty;
  }

  document.querySelectorAll(".item-checkbox").forEach((cb) => {
    cb.addEventListener("change", updateSummaryFromCheckedItems);
  });

  // Checkbox "Pilih Semua"
  const selectAll = document.getElementById("select-all");
  if (selectAll) {
    selectAll.checked = false;
    selectAll.addEventListener("change", function () {
      const checked = this.checked;
      document.querySelectorAll(".item-checkbox").forEach((cb) => {
        cb.checked = checked;
      });
      updateSummaryFromCheckedItems();
    });
  }

  // Inisialisasi total kosong dulu
  updateSummaryFromCheckedItems();
}

document.getElementById("checkout-btn")?.addEventListener("click", () => {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const checkboxes = document.querySelectorAll(".item-checkbox");

  const newCart = cart.filter((_, i) => {
    const checkbox = [...checkboxes].find(
      (cb) => parseInt(cb.dataset.index) === i
    );
    return !checkbox?.checked;
  });

  localStorage.setItem("cart", JSON.stringify(newCart));
  alert("Pesanan Anda Berhasil, Terima kasih sudah berbelanja.");
  tampilkanCart();
});


function hapusItem(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  tampilkanCart();
}


