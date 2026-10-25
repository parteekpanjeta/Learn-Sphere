(() => {
  const cartStorageKey = "learnsphere-cart";
  const courses = {
    ai: { title: "Advanced Generative AI", price: 899 },
    design: { title: "Strategic Product Design", price: 749 },
    leadership: { title: "Emotional Intelligence", price: 599 },
    business: { title: "Venture Capital Foundations", price: 1200 },
    "narrative-design": { title: "Advanced Narrative Design", price: 499 },
    data: { title: "Leading with Data", price: 799 }
  };

  const site = document.querySelector(".site");
  if (!site) return;

  const readIds = (storageKey) => {
    try {
      const value = JSON.parse(window.localStorage.getItem(storageKey) || "[]");
      if (!Array.isArray(value)) return [];
      return [...new Set(value.filter((id) => Object.prototype.hasOwnProperty.call(courses, id)))];
    } catch {
      return [];
    }
  };

  let cartIds = readIds(cartStorageKey);
  const widget = document.createElement("div");
  widget.className = "learning-cart-widget";
  widget.innerHTML = `
    <section class="cart-panel" id="learning-cart-panel" aria-label="Your shopping cart" hidden>
      <header class="cart-panel-header">
        <div>
          <p class="cart-panel-eyebrow">LEARNSPHERE</p>
          <h2>Your Courses</h2>
        </div>
        <button class="cart-close" type="button" aria-label="Close cart">&times;</button>
      </header>
      <p class="cart-status" role="status" aria-live="polite" hidden></p>
      <div class="cart-items"></div>
      <div class="cart-empty" hidden>
        <span class="cart-empty-icon" aria-hidden="true">✦</span>
        <strong>Your cart is ready for a course.</strong>
        <p>Choose a course and it will appear here.</p>
        <a href="courses.html">Explore courses</a>
      </div>
      <footer class="cart-panel-footer" hidden>
        <div class="cart-total-row"><span>Total</span><strong class="cart-total"></strong></div>
        <button class="cart-buy-button" type="button">Buy now</button>
        <p class="cart-footer-note">Your courses will be saved to My Courses.</p>
      </footer>
    </section>
    <button class="cart-launcher" type="button" aria-expanded="false" aria-controls="learning-cart-panel" aria-label="Open cart">
      <svg class="cart-launcher-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M3 4h2l2.1 10.1a2 2 0 0 0 2 1.6h8.6a2 2 0 0 0 1.9-1.4L21 8H6" />
        <circle cx="10" cy="20" r="1.2" />
        <circle cx="18" cy="20" r="1.2" />
      </svg>
      <span>Cart</span>
      <span class="cart-count" aria-live="polite" aria-atomic="true">0</span>
    </button>`;
  site.append(widget);

  const launcher = widget.querySelector(".cart-launcher");
  const panel = widget.querySelector(".cart-panel");
  const closeButton = widget.querySelector(".cart-close");
  const itemList = widget.querySelector(".cart-items");
  const emptyState = widget.querySelector(".cart-empty");
  const footer = widget.querySelector(".cart-panel-footer");
  const total = widget.querySelector(".cart-total");
  const count = widget.querySelector(".cart-count");
  const status = widget.querySelector(".cart-status");
  const buyNowButton = widget.querySelector(".cart-buy-button");
  const money = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  });

  function setStatus(message) {
    status.textContent = message;
    status.hidden = !message;
  }

  function renderCart() {
    const validItems = cartIds.filter((id) => Object.prototype.hasOwnProperty.call(courses, id));
    const itemCount = validItems.length;
    const isEmpty = itemCount === 0;

    cartIds = validItems;
    count.textContent = String(itemCount);
    launcher.setAttribute("aria-label", `Open cart, ${itemCount} ${itemCount === 1 ? "course" : "courses"}`);
    itemList.replaceChildren();
    emptyState.hidden = !isEmpty;
    itemList.hidden = isEmpty;
    footer.hidden = isEmpty;

    validItems.forEach((id) => {
      const course = courses[id];
      const row = document.createElement("article");
      const info = document.createElement("div");
      const title = document.createElement("h3");
      const price = document.createElement("strong");
      const remove = document.createElement("button");

      row.className = "cart-item";
      info.className = "cart-item-info";
      title.className = "cart-item-title";
      title.textContent = course.title;
      price.className = "cart-item-price";
      price.textContent = money.format(course.price);
      remove.className = "cart-remove";
      remove.type = "button";
      remove.dataset.removeCourse = id;
      remove.setAttribute("aria-label", `Remove ${course.title} from cart`);
      remove.textContent = "×";

      info.append(title, price);
      row.append(info, remove);
      itemList.append(row);
    });

    total.textContent = money.format(validItems.reduce((sum, id) => sum + courses[id].price, 0));
  }

  function showCart() {
    panel.hidden = false;
    launcher.setAttribute("aria-expanded", "true");
  }

  function hideCart(returnFocus = false) {
    panel.hidden = true;
    launcher.setAttribute("aria-expanded", "false");
    if (returnFocus) launcher.focus();
  }

  launcher.addEventListener("click", () => {
    if (panel.hidden) showCart();
    else hideCart();
  });

  closeButton.addEventListener("click", () => hideCart(true));

  document.querySelectorAll("[data-cart-course]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.cartCourse;
      const course = courses[id];
      if (!course) return;

      if (cartIds.includes(id)) {
        setStatus(`${course.title} is already in your cart.`);
      } else {
        cartIds.push(id);
        try {
          window.localStorage.setItem(cartStorageKey, JSON.stringify(cartIds));
        } catch {
          // The cart remains available for this page when browser storage is unavailable.
        }
        renderCart();
        setStatus(`${course.title} added to your cart.`);
      }

      showCart();
    });
  });

  itemList.addEventListener("click", (event) => {
    const removeButton = event.target.closest("[data-remove-course]");
    if (!removeButton) return;

    const removedId = removeButton.dataset.removeCourse;
    cartIds = cartIds.filter((id) => id !== removedId);
    try {
      window.localStorage.setItem(cartStorageKey, JSON.stringify(cartIds));
    } catch {
      // Keep the change in this page's session when browser storage is unavailable.
    }
    renderCart();
    setStatus(`${courses[removedId].title} removed from your cart.`);
  });

  buyNowButton.addEventListener("click", () => {
    if (!cartIds.length) return;
    window.location.href = "checkout.html";
  });

  document.addEventListener("click", (event) => {
    if (panel.hidden || widget.contains(event.target) || event.target.closest("[data-cart-course]")) return;
    hideCart();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !panel.hidden) hideCart(true);
  });

  window.addEventListener("storage", (event) => {
    if (event.key !== cartStorageKey) return;
    cartIds = readIds(cartStorageKey);
    renderCart();
  });

  renderCart();
})();
