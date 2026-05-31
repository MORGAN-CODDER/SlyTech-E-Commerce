// ==========================
// SLYTECH FULL ECOMMERCE
// ==========================

// ==========================
// DATABASE STORAGE
// ==========================

let users =
  JSON.parse(localStorage.getItem("slytechUsers")) || [];

let cart =
  JSON.parse(localStorage.getItem("slytechCart")) || [];

let currentUser =
  JSON.parse(localStorage.getItem("slytechCurrentUser")) || null;

// ==========================
// PRODUCT DATA
// ==========================

const products = [
  {
    id: 1,
    name: "Gaming Laptop",
    category: "laptops",
    price: 1299,
    image:
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=800&auto=format&fit=crop",
  },

  {
    id: 2,
    name: "MacBook Pro",
    category: "laptops",
    price: 1999,
    image:
      "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?q=80&w=800&auto=format&fit=crop",
  },

  {
    id: 3,
    name: "Wireless Headphones",
    category: "audio",
    price: 199,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop",
  },

  {
    id: 4,
    name: "Smart Watch",
    category: "smart-watch",
    price: 249,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop",
  },
];

// ==========================
// NOTIFICATION
// ==========================

function showNotification(message) {

  const notification =
    document.createElement("div");

  notification.classList.add("notification");

  notification.innerText = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add("show");
  }, 100);

  setTimeout(() => {

    notification.classList.remove("show");

    setTimeout(() => {
      notification.remove();
    }, 300);

  }, 2500);
}

// ==========================
// REGISTER SYSTEM
// ==========================

const registerModal =
  document.getElementById("registerModal");

const loginModal =
  document.getElementById("loginModal");

const userIcon =
  document.querySelector(".fa-user");

// OPEN LOGIN
userIcon.addEventListener("click", () => {

  if (currentUser) {

    const logout = confirm(
      `Logged in as ${currentUser.name}\n\nLogout?`
    );

    if (logout) {

      localStorage.removeItem(
        "slytechCurrentUser"
      );

      currentUser = null;

      showNotification("Logged Out");
    }

    return;
  }

  loginModal.classList.add("active");
});

// SHOW REGISTER
document
  .getElementById("showRegister")
  .addEventListener("click", () => {

    loginModal.classList.remove("active");

    registerModal.classList.add("active");
  });

// SHOW LOGIN
document
  .getElementById("showLogin")
  .addEventListener("click", () => {

    registerModal.classList.remove("active");

    loginModal.classList.add("active");
  });

// CLOSE MODALS
document
  .querySelector(".close-auth")
  .addEventListener("click", () => {

    loginModal.classList.remove("active");
  });

document
  .querySelector(".close-register")
  .addEventListener("click", () => {

    registerModal.classList.remove("active");
  });

// REGISTER
document
  .getElementById("registerForm")
  .addEventListener("submit", (e) => {

    e.preventDefault();

    const name =
      document.getElementById(
        "registerName"
      ).value;

    const email =
      document.getElementById(
        "registerEmail"
      ).value;

    const password =
      document.getElementById(
        "registerPassword"
      ).value;

    const userExists = users.find(
      (u) => u.email === email
    );

    if (userExists) {
      showNotification("User already exists");
      return;
    }

    const newUser = {
      name,
      email,
      password,
    };

    users.push(newUser);

    localStorage.setItem(
      "slytechUsers",
      JSON.stringify(users)
    );

    showNotification("Registration Successful");

    registerModal.classList.remove("active");

    loginModal.classList.add("active");
  });

// LOGIN
document
  .getElementById("loginForm")
  .addEventListener("submit", (e) => {

    e.preventDefault();

    const email =
      document.getElementById(
        "loginEmail"
      ).value;

    const password =
      document.getElementById(
        "loginPassword"
      ).value;

    const user = users.find(
      (u) =>
        u.email === email &&
        u.password === password
    );

    if (!user) {
      showNotification("Invalid Credentials");
      return;
    }

    currentUser = user;

    localStorage.setItem(
      "slytechCurrentUser",
      JSON.stringify(user)
    );

    loginModal.classList.remove("active");

    showNotification(
      `Welcome ${user.name}`
    );
  });

// ==========================
// ADD TO CART
// ==========================

const addButtons = document.querySelectorAll(
  ".product-info button"
);

addButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (!currentUser) {
      showNotification("Please login first");
      loginModal.classList.add("active");
      return;
    }

    const card = button.closest(".product-card");
    const category = card?.dataset?.category;

    // Find matching product by category. If multiple products share a category (like laptops),
    // fall back to the first match.
    const match = products.find((p) => p.category === category);
    addToCart(match || products[0]);
  });
});

function addToCart(product) {

  const existing = cart.find(
    (item) => item.id === product.id
  );

  if (existing) {

    existing.quantity++;

  } else {

    cart.push({
      ...product,
      quantity: 1,
    });
  }

  localStorage.setItem(
    "slytechCart",
    JSON.stringify(cart)
  );

  updateCartCount();

  renderCart();

  showNotification(
    `${product.name} added to cart`
  );
}

// ==========================
// CART COUNT
// ==========================

function updateCartCount() {

  const cartIcon =
    document.querySelector(
      ".fa-cart-shopping"
    );

  let total = 0;

  cart.forEach((item) => {
    total += item.quantity;
  });

  let badge =
    document.querySelector(".cart-badge");

  if (!badge) {

    badge = document.createElement("span");

    badge.classList.add("cart-badge");

    cartIcon.parentElement.appendChild(
      badge
    );
  }

  badge.innerText = total;
}

// ==========================
// CART SIDEBAR
// ==========================

const cartButton =
  document.querySelector(
    ".fa-cart-shopping"
  );

cartButton.addEventListener("click", () => {

  if (!currentUser) {

    showNotification("Please login");

    loginModal.classList.add("active");

    return;
  }

  openCart();
});

function openCart() {

  let sidebar =
    document.querySelector(
      ".cart-sidebar"
    );

  if (!sidebar) {

    sidebar = document.createElement("div");

    sidebar.classList.add(
      "cart-sidebar"
    );

    sidebar.innerHTML = `
      <div class="cart-header">
        <h2>Shopping Cart</h2>
        <button class="close-cart">X</button>
      </div>

      <div class="cart-items"></div>

      <div class="cart-footer">
        <h3>
          Total:
          $<span class="cart-total">0</span>
        </h3>

        <button class="checkout-btn">
          Checkout
        </button>
      </div>
    `;

    document.body.appendChild(sidebar);

    sidebar
      .querySelector(".close-cart")
      .addEventListener("click", () => {

        sidebar.classList.remove(
          "active"
        );
      });
  }

  renderCart();

  sidebar.classList.add("active");
}

// ==========================
// RENDER CART
// ==========================

function renderCart() {

  const cartItems =
    document.querySelector(".cart-items");

  const totalElement =
    document.querySelector(".cart-total");

  if (!cartItems || !totalElement) return;

  cartItems.innerHTML = "";

  let total = 0;

  cart.forEach((item, index) => {

    total += item.price * item.quantity;

    const div = document.createElement("div");

    div.classList.add("cart-item");

    div.innerHTML = `
      <img src="${item.image}">

      <div class="cart-info">

        <h4>${item.name}</h4>

        <p>$${item.price}</p>

        <div class="qty-controls">

          <button onclick="decreaseQty(${index})">
            -
          </button>

          <span>${item.quantity}</span>

          <button onclick="increaseQty(${index})">
            +
          </button>

        </div>

      </div>

      <button onclick="removeItem(${index})">
        <i class="fa-solid fa-trash"></i>
      </button>
    `;

    cartItems.appendChild(div);
  });

  totalElement.innerText =
    total.toFixed(2);
}

// ==========================
// CART FUNCTIONS
// ==========================

function increaseQty(index) {

  cart[index].quantity++;

  saveCart();
}

function decreaseQty(index) {

  if (cart[index].quantity > 1) {
    cart[index].quantity--;
  }

  saveCart();
}

function removeItem(index) {

  cart.splice(index, 1);

  saveCart();
}

function saveCart() {

  localStorage.setItem(
    "slytechCart",
    JSON.stringify(cart)
  );

  renderCart();

  updateCartCount();
}

// ==========================
// CHECKOUT SYSTEM
// ==========================

document.addEventListener("click", (e) => {

  if (
    e.target.classList.contains(
      "checkout-btn"
    )
  ) {

    if (!currentUser) {
      showNotification("Please login to checkout");
      loginModal.classList.add("active");
      return;
    }

    if (cart.length === 0) {

      showNotification(
        "Cart is empty"
      );

      return;
    }

    let total = 0;

    cart.forEach((item) => {

      total +=
        item.price * item.quantity;
    });

    const order = {
      user: currentUser.email,
      products: cart,
      total,
      date: new Date(),
    };

    let orders =
      JSON.parse(
        localStorage.getItem(
          "slytechOrders"
        )
      ) || [];

    orders.push(order);

    localStorage.setItem(
      "slytechOrders",
      JSON.stringify(orders)
    );

    cart = [];

    localStorage.removeItem(
      "slytechCart"
    );

    renderCart();

    updateCartCount();

    showNotification(
      "Order Placed Successfully"
    );
  }
});

// ==========================
// SEARCH
// ==========================

const searchInput =
  document.querySelector(
    ".search-box input"
  );

searchInput.addEventListener(
  "keyup",
  () => {

    const value =
      searchInput.value.toLowerCase();

    const cards =
      document.querySelectorAll(
        ".product-card"
      );

    cards.forEach((card) => {

      const title =
        card
          .querySelector("h3")
          .innerText.toLowerCase();

      if (title.includes(value)) {

        card.style.display = "block";

      } else {

        card.style.display = "none";
      }
    });
  }
);

// ==========================
// SLIDER
// ==========================

const sliderImages = [

  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop",

  "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=1200&auto=format&fit=crop",

  "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop",
];

let currentSlide = 0;

const sliderImage =
  document.querySelector(
    ".main-slider img"
  );

function showSlide(index) {

  sliderImage.src =
    sliderImages[index];
}

document
  .querySelector(".right")
  .addEventListener("click", () => {

    currentSlide++;

    if (
      currentSlide >=
      sliderImages.length
    ) {
      currentSlide = 0;
    }

    showSlide(currentSlide);
  });

document
  .querySelector(".left")
  .addEventListener("click", () => {

    currentSlide--;

    if (currentSlide < 0) {

      currentSlide =
        sliderImages.length - 1;
    }

    showSlide(currentSlide);
  });

setInterval(() => {

  currentSlide++;

  if (
    currentSlide >=
    sliderImages.length
  ) {

    currentSlide = 0;
  }

  showSlide(currentSlide);

}, 5000);

// ==========================
// SECTION NAV (SIDEBAR MENU) + CATEGORY FILTERING
// ==========================

function scrollToSection(sectionId) {
  const target = document.querySelector(sectionId);
  if (!target) return;

  target.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

function setActiveMenu(menuItem) {
  document
    .querySelectorAll(".menu-item")
    .forEach((mi) => mi.classList.remove("active"));

  menuItem.classList.add("active");
}

function showCategorySection(targetSelector) {
  // Hide all category sections, show the selected one
  document.querySelectorAll(".products[id]").forEach((sec) => {
    sec.style.display = "none";
  });

  const selected = document.querySelector(targetSelector);
  if (selected) selected.style.display = "block";
}

document.querySelectorAll(".menu-item").forEach((item) => {
  item.addEventListener("click", () => {
    const target = item.dataset.target;
    if (!target) return;

    // Redirect to section using hash (so it works like a page navigation)
    // Example: #laptops
    window.location.hash = target;

    setActiveMenu(item);
    scrollToSection(target);
    showCategorySection(target);
  });
});

// Handle direct loads like: index.html#laptops
window.addEventListener("hashchange", () => {
  const hash = window.location.hash;
  if (!hash) return;

  // hash is like "#laptops"
  const section = document.querySelector(hash);
  if (!section) return;

  // set active menu item
  document.querySelectorAll(".menu-item").forEach((mi) => {
    mi.classList.toggle("active", mi.dataset.target === hash);
  });

  // show the right section
  showCategorySection(hash);

  // ensure scroll to the visible part
  scrollToSection(hash);
});

// ==========================
// FORGOT PASSWORD MODAL
// ==========================

const forgotModal = document.getElementById("forgotModal");
const forgotForm = document.getElementById("forgotForm");
const forgotMessage = document.getElementById("forgotMessage");
const closeForgotModal = document.querySelector("#forgotModal .close-forgot");
const forgotPasswordLink = document.getElementById("forgotPassword");

if (forgotModal && forgotForm && forgotMessage && closeForgotModal && forgotPasswordLink) {
  // Open forgot modal from login modal
  forgotPasswordLink.addEventListener("click", (e) => {
    e.preventDefault();
    loginModal.classList.remove("active");
    forgotMessage.innerText = "";
    forgotModal.classList.add("active");
  });

  // Close Forgot Modal
  closeForgotModal.addEventListener("click", () => {
    forgotModal.classList.remove("active");
  });

  // Handle Forgot Password form submission
  forgotForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("forgotEmail").value;

    // Check if user exists
    const user = users.find((u) => u.email === email);

    if (user) {
      // For demo, we simulate sending a reset.
      forgotMessage.innerText =
        "A reset link has been sent to your email.";
      forgotMessage.style.color = "#28a745"; // Green success color
    } else {
      forgotMessage.innerText =
        "No account found with that email.";
      forgotMessage.style.color = "#dc3545"; // Red error color
    }
  });
}

// ==========================
// ADMIN DASHBOARD
// ==========================

const ADMIN_EMAIL = "Qwekuapex@gmail.com";
const ADMIN_PASSWORD = "Qweku@059";

let adminSession =
  JSON.parse(localStorage.getItem("slytechAdminSession")) || null;

function ensureAdminUI() {
  // Create admin modal + dashboard shell once
  let adminModal = document.getElementById("adminModal");
  if (!adminModal) {
    adminModal = document.createElement("div");
    adminModal.id = "adminModal";
    adminModal.className = "auth-modal";
    adminModal.innerHTML = `
      <div class="auth-box" style="width:520px;">
        <span class="close-admin" style="position:absolute; right:20px; top:15px; font-size:25px; cursor:pointer;">&times;</span>
        <h2>Admin Dashboard</h2>

        <form id="adminLoginForm">
          <input type="email" id="adminEmail" placeholder="Admin Email" required />
          <input type="password" id="adminPassword" placeholder="Admin Password" required />
          <button type="submit">Login as Admin</button>
        </form>

        <div id="adminPanel" style="display:none; margin-top:20px;">
          <div style="display:flex; gap:10px; margin-bottom:15px;">
            <button id="adminRefreshOrders" style="flex:1; padding:12px; border:none; background:#0f172a; color:#fff; border-radius:10px; cursor:pointer; font-weight:600;">Refresh Orders</button>
            <button id="adminLogout" style="width:120px; padding:12px; border:none; background:#dc3545; color:#fff; border-radius:10px; cursor:pointer; font-weight:600;">Logout</button>
          </div>

          <h3 style="margin-bottom:10px; color:#0f172a;">Orders</h3>
          <div id="adminOrders" style="max-height:320px; overflow:auto; background:#f1f5f9; padding:15px; border-radius:15px;"></div>
        </div>
      </div>
    `;
    document.body.appendChild(adminModal);
  }

  // Create an Admin entry point (hidden button) if missing
  if (!document.getElementById("openAdminBtn")) {
    const btn = document.createElement("button");
    btn.id = "openAdminBtn";
    btn.textContent = "Admin";
    btn.style.display = "none"; // keep it discreet; you can change to flex if you want visible.
    btn.addEventListener("click", () => adminModal.classList.add("active"));
    document.body.appendChild(btn);

    // Optionally allow opening admin with shift+a
    document.addEventListener("keydown", (ev) => {
      if (ev.shiftKey && (ev.key === "A" || ev.key === "a")) {
        adminModal.classList.add("active");
      }
    });
  }

  const closeBtn = adminModal.querySelector(".close-admin");
  const loginForm = adminModal.querySelector("#adminLoginForm");
  const emailInput = adminModal.querySelector("#adminEmail");
  const passwordInput = adminModal.querySelector("#adminPassword");
  const adminPanel = adminModal.querySelector("#adminPanel");
  const ordersBox = adminModal.querySelector("#adminOrders");
  const refreshBtn = adminModal.querySelector("#adminRefreshOrders");
  const logoutBtn = adminModal.querySelector("#adminLogout");

  function loadOrders() {
    const orders =
      JSON.parse(localStorage.getItem("slytechOrders")) || [];

    if (!ordersBox) return;

    if (orders.length === 0) {
      ordersBox.innerHTML = `<div style="color:#64748b;">No orders yet.</div>`;
      return;
    }

    ordersBox.innerHTML = orders
      .slice()
      .reverse()
      .map((o) => {
        const items = (o.products || [])
          .map((p) => `${p.name} x${p.quantity}`)
          .join(", ");
        return `
          <div style="background:#fff; padding:12px; border-radius:12px; margin-bottom:12px; border:1px solid #e2e8f0;">
            <div style="font-weight:700; color:#0f172a;">$${Number(o.total).toFixed(2)} - ${new Date(o.date).toLocaleString()}</div>
            <div style="color:#475569; margin-top:6px;">User: ${o.user || "unknown"}</div>
            <div style="color:#475569; margin-top:6px;">Items: ${items || "-"}</div>
          </div>
        `;
      })
      .join("");
  }

  function setAdminLoggedIn(isLoggedIn) {
    if (!adminPanel) return;

    if (isLoggedIn) {
      loginForm.style.display = "none";
      adminPanel.style.display = "block";
      loadOrders();
    } else {
      loginForm.style.display = "flex";
      adminPanel.style.display = "none";
    }
  }

  if (adminSession && adminSession.loggedIn) {
    setAdminLoggedIn(true);
  } else {
    setAdminLoggedIn(false);
  }

  closeBtn?.addEventListener("click", () => {
    adminModal.classList.remove("active");
  });

  loginForm?.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = emailInput.value;
    const password = passwordInput.value;

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      adminSession = { loggedIn: true, email };
      localStorage.setItem(
        "slytechAdminSession",
        JSON.stringify(adminSession)
      );
      showNotification("Admin login successful");
      setAdminLoggedIn(true);
      return;
    }

    showNotification("Invalid admin credentials");
  });

  refreshBtn?.addEventListener("click", () => {
    loadOrders();
  });

  logoutBtn?.addEventListener("click", () => {
    adminSession = null;
    localStorage.removeItem("slytechAdminSession");
    showNotification("Admin logged out");
    setAdminLoggedIn(false);
  });
}

ensureAdminUI();

// Open admin modal if already logged in and admin wants it (keyboard shortcut is set)

