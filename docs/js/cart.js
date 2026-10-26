const cartCatalog = window.collectionCatalog || [];

function getProduct(productId) {
  return cartCatalog.find((product) => product.id === productId);
}

function getProductPrice(product) {
  return Number(product.price.replace(/[^\d.]/g, ""));
}

function formatPrice(amount) {
  return `P ${amount.toLocaleString("en-BW")}`;
}

function getProductImage(product, color) {
  const variant = product.images.find((image) => image.color === color) || product.images[0];
  return variant.src || `assets/Collections/${encodeURIComponent(variant.file)}`;
}

function createSelect(labelText, value, options, onChange) {
  const label = document.createElement("label");
  label.className = "cart-option";
  const labelTextNode = document.createElement("span");
  labelTextNode.textContent = labelText;
  const select = document.createElement("select");
  select.setAttribute("aria-label", labelText);

  for (const option of options) {
    const element = document.createElement("option");
    element.value = option.value;
    element.textContent = option.label;
    element.selected = option.value === value;
    select.append(element);
  }

  select.addEventListener("change", () => onChange(select.value));
  label.append(labelTextNode, select);
  return label;
}

class SiteCartOverlay extends HTMLElement {
  connectedCallback() {
    if (this.dataset.ready) return;
    this.dataset.ready = "true";
    this.innerHTML = `
      <div class="cart-overlay" id="site-cart-overlay" hidden>
        <button class="cart-overlay-backdrop" type="button" aria-label="Close cart"></button>
        <section class="cart-overlay-dialog" role="dialog" aria-modal="true" aria-labelledby="cart-title">
          <div class="cart-overlay-topbar">
            <span class="cart-overlay-brand">LOOO<span>.</span> / YOUR BAG</span>
            <button class="cart-overlay-close" type="button" aria-label="Close cart">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"></path></svg>
              <span>Close</span>
            </button>
          </div>
          <section class="cart-intro" aria-labelledby="cart-title">
            <p class="page-eyebrow">Your picks, your pace</p>
            <h1 id="cart-title">Your cart<span>.</span></h1>
            <p>Take one last look at your pairs before sending your order our way.</p>
          </section>
          <section class="cart-layout" aria-label="Shopping cart and checkout">
            <div class="cart-items-column">
              <div class="cart-list-heading">
                <h2>Your selection</h2>
                <span class="cart-item-count">0 items</span>
              </div>
              <div class="cart-items" aria-live="polite"></div>
              <div class="cart-empty" hidden>
                <div class="cart-empty-icon" aria-hidden="true">＋</div>
                <p class="page-eyebrow">A good pair is waiting</p>
                <h2>Your cart is taking a breather.</h2>
                <p>Explore the collection and add a pair you love.</p>
                <a class="cart-continue-link" href="collections.html">Explore collection</a>
              </div>
              <button class="cart-continue-shopping" type="button">Continue shopping</button>
            </div>
            <aside class="cart-summary" aria-labelledby="summary-title">
              <div class="cart-summary-heading">
                <div>
                  <p class="page-eyebrow">Almost yours</p>
                  <h2 id="summary-title">Order summary</h2>
                </div>
                <span class="cart-summary-mark" aria-hidden="true">L.</span>
              </div>
              <div class="cart-total-lines">
                <div><span>Subtotal</span><strong class="cart-subtotal">P 0</strong></div>
                <div><span>Delivery</span><span class="cart-delivery-note">Confirmed with you</span></div>
              </div>
              <div class="cart-grand-total"><span>Total</span><strong class="cart-total">P 0</strong></div>
              <form class="checkout-form">
                <label for="customer-phone">Your phone number</label>
                <div class="checkout-phone-wrap">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"></path><path d="M10 18h4"></path></svg>
                  <input id="customer-phone" class="customer-phone" name="customerPhone" type="tel" autocomplete="tel" placeholder="+267 7X XXX XXX" required />
                </div>
                <p class="checkout-help">We’ll use this to confirm your order and delivery details.</p>
                <button class="checkout-button" type="submit" disabled>
                  <span>Send order</span>
                </button>
                <p class="checkout-status" role="status" aria-live="polite"></p>
              </form>
              <div class="cart-summary-footnote">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 5 6v5c0 4.4 2.8 8.2 7 10 4.2-1.8 7-5.6 7-10V6l-7-3Z"></path><path d="m9 12 2 2 4-4"></path></svg>
                <p>Your order goes straight to our team. We’ll message you to confirm the details.</p>
              </div>
            </aside>
          </section>
        </section>
      </div>
    `;

    this.overlay = this.querySelector(".cart-overlay");
    this.dialog = this.querySelector(".cart-overlay-dialog");
    this.itemsContainer = this.querySelector(".cart-items");
    this.emptyState = this.querySelector(".cart-empty");
    this.itemCount = this.querySelector(".cart-item-count");
    this.subtotal = this.querySelector(".cart-subtotal");
    this.total = this.querySelector(".cart-total");
    this.form = this.querySelector(".checkout-form");
    this.checkoutButton = this.querySelector(".checkout-button");
    this.checkoutStatus = this.querySelector(".checkout-status");
    this.customerPhone = this.querySelector(".customer-phone");

    this.querySelectorAll(".cart-overlay-close, .cart-overlay-backdrop, .cart-continue-shopping")
      .forEach((button) => button.addEventListener("click", () => this.close()));
    this.querySelector(".cart-continue-link").addEventListener("click", () => this.close());
    this.form.addEventListener("submit", (event) => this.submitOrder(event));
    this.renderCart();
    window.addEventListener("store-cart-change", (event) => {
      this.checkoutStatus.textContent = "";
      this.checkoutStatus.classList.remove("is-error", "is-success");
      this.renderCart(event.detail.items);
    });
    window.addEventListener("storage", (event) => {
      if (event.key === "looo-cart-v1") this.renderCart();
    });

    document.addEventListener("click", (event) => {
      const trigger = event.target.closest(".site-cart-toggle, #bag-toggle");
      if (!trigger) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      this.open(trigger);
    }, true);
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !this.overlay.hidden) this.close();
      if (event.key === "Tab" && !this.overlay.hidden) this.trapFocus(event);
    });
  }

  open(trigger) {
    this.previousFocus = trigger;
    this.overlay.hidden = false;
    document.body.classList.add("cart-overlay-open");
    trigger.setAttribute("aria-expanded", "true");
    this.querySelector(".cart-overlay-close").focus();
  }

  close() {
    if (this.overlay.hidden) return;
    this.overlay.hidden = true;
    document.body.classList.remove("cart-overlay-open");
    this.previousFocus?.setAttribute("aria-expanded", "false");
    this.previousFocus?.focus();
  }

  trapFocus(event) {
    const focusable = [...this.dialog.querySelectorAll(
      'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled)'
    )].filter((element) => !element.closest("[hidden]"));
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  updateSummary(items) {
    const validItems = items.filter((item) => getProduct(item.productId));
    const itemCount = window.LoooCart.count(validItems);
    const subtotal = validItems.reduce((sum, item) => {
      return sum + getProductPrice(getProduct(item.productId)) * item.quantity;
    }, 0);

    this.itemCount.textContent = `${itemCount} ${itemCount === 1 ? "item" : "items"}`;
    this.subtotal.textContent = formatPrice(subtotal);
    this.total.textContent = formatPrice(subtotal);
    this.checkoutButton.disabled = itemCount === 0;
  }

  createCartItem(item) {
    const product = getProduct(item.productId);
    if (!product) return null;

    const card = document.createElement("article");
    card.className = "cart-item";
    card.dataset.productId = product.id;
    const itemImage = document.createElement("div");
    itemImage.className = "cart-item-image";
    const image = document.createElement("img");
    image.src = getProductImage(product, item.color);
    image.alt = `${product.brand} ${product.name} in ${item.color}`;
    itemImage.append(image);

    const details = document.createElement("div");
    details.className = "cart-item-details";
    const brand = document.createElement("p");
    brand.className = "cart-item-brand";
    brand.textContent = product.brand;
    const title = document.createElement("h3");
    title.textContent = product.name;
    const price = document.createElement("p");
    price.className = "cart-item-price";
    const each = document.createElement("span");
    each.textContent = " each";
    price.append(document.createTextNode(formatPrice(getProductPrice(product))), each);
    details.append(brand, title, price);

    const options = document.createElement("div");
    options.className = "cart-item-options";
    options.append(
      createSelect(
        "Color",
        item.color,
        [...new Set(product.images.map((variant) => variant.color))]
          .map((color) => ({ value: color, label: color })),
        (color) => window.LoooCart.update(product.id, { color })
      ),
      createSelect(
        "Shoe size",
        item.size,
        [
          { value: "", label: "Choose size" },
          ...Array.from({ length: 11 }, (_, index) => {
            const size = String(index + 36);
            return { value: size, label: size };
          }),
        ],
        (size) => window.LoooCart.update(product.id, { size })
      )
    );

    const controls = document.createElement("div");
    controls.className = "cart-item-controls";
    const quantity = document.createElement("div");
    quantity.className = "quantity-control";
    const decrease = document.createElement("button");
    decrease.type = "button";
    decrease.textContent = "−";
    decrease.setAttribute("aria-label", `Decrease ${product.name} quantity`);
    decrease.disabled = item.quantity <= 1;
    decrease.addEventListener("click", () => {
      window.LoooCart.update(product.id, { quantity: Math.max(1, item.quantity - 1) });
    });
    const quantityValue = document.createElement("span");
    quantityValue.textContent = String(item.quantity);
    quantityValue.setAttribute("aria-live", "polite");
    const increase = document.createElement("button");
    increase.type = "button";
    increase.textContent = "+";
    increase.setAttribute("aria-label", `Increase ${product.name} quantity`);
    increase.addEventListener("click", () => {
      window.LoooCart.update(product.id, { quantity: item.quantity + 1 });
    });
    quantity.append(decrease, quantityValue, increase);
    const linePrice = document.createElement("strong");
    linePrice.className = "cart-item-line-price";
    linePrice.textContent = formatPrice(getProductPrice(product) * item.quantity);
    controls.append(quantity, linePrice);

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "cart-item-remove";
    remove.textContent = "Remove";
    remove.setAttribute("aria-label", `Remove ${product.brand} ${product.name} from cart`);
    remove.addEventListener("click", () => window.LoooCart.remove(product.id));

    const main = document.createElement("div");
    main.className = "cart-item-main";
    main.append(details, options, controls, remove);
    card.append(itemImage, main);
    return card;
  }

  renderCart(items = window.LoooCart.getItems()) {
    const validItems = items.filter((item) => getProduct(item.productId));
    const hasItems = validItems.length > 0;
    this.itemsContainer.replaceChildren(...validItems.map((item) => this.createCartItem(item)).filter(Boolean));
    this.emptyState.hidden = hasItems;
    this.itemsContainer.hidden = !hasItems;
    this.updateSummary(validItems);
  }

  async submitOrder(event) {
    event.preventDefault();
    this.checkoutStatus.textContent = "";
    this.checkoutStatus.classList.remove("is-error", "is-success");

    const items = window.LoooCart.getItems();
    const productLines = items.map((item) => {
      const product = getProduct(item.productId);
      return product ? { item, product } : null;
    }).filter(Boolean);
    const missingSize = productLines.find(({ item }) => !item.size);

    if (missingSize) {
      this.checkoutStatus.textContent = `Choose a shoe size for ${missingSize.product.name} before continuing.`;
      this.checkoutStatus.classList.add("is-error");
      this.itemsContainer.querySelector(
        `[data-product-id="${missingSize.product.id}"] select[aria-label="Shoe size"]`
      )?.focus();
      return;
    }

    if (!this.form.reportValidity()) return;

    const totalPrice = productLines.reduce((sum, { item, product }) => {
      return sum + getProductPrice(product) * item.quantity;
    }, 0);
    const order = {
      customerPhone: this.customerPhone.value.trim(),
      items: productLines.map(({ item, product }) => ({
        name: product.name,
        brand: product.brand,
        color: item.color,
        size: item.size,
        quantity: item.quantity,
        unitPrice: getProductPrice(product),
      })),
      totalPrice,
      currency: "BWP",
    };

    this.checkoutButton.disabled = true;
    this.checkoutButton.classList.add("is-loading");
    this.checkoutButton.querySelector("span").textContent = "Sending order…";

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        const errorMessage = result.error || "We couldn’t send your order. Please try again.";
        throw new Error(
          result.twilioCode ? `${errorMessage} (Twilio error ${result.twilioCode})` : errorMessage
        );
      }

      window.LoooCart.clear();
      this.checkoutStatus.textContent = "Your order has been sent. We’ll be in touch shortly.";
      this.checkoutStatus.classList.add("is-success");
    } catch (error) {
      console.error("Checkout request failed:", error);
      this.checkoutStatus.textContent = error.message || "We couldn’t send your order. Please try again.";
      this.checkoutStatus.classList.add("is-error");
    } finally {
      this.checkoutButton.classList.remove("is-loading");
      this.checkoutButton.querySelector("span").textContent = "Send order";
      this.renderCart();
    }
  }
}

if (!customElements.get("site-cart-overlay")) {
  customElements.define("site-cart-overlay", SiteCartOverlay);
}
