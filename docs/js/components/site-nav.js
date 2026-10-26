class SiteNav extends HTMLElement {
  connectedCallback() {
    if (this.dataset.ready) return;

    const currentPage = this.getAttribute("current-page");
    const mobileLabels = {
      home: "HOME",
      collection: "COLLECTIONS",
      about: "ABOUT US",
      contact: "CONTACT US",
    };
    const links = [
      ["home", "Home", "index.html"],
      ["collection", "Collection", "collections.html"],
      ["about", "About us", "about.html"],
      ["contact", "Contact us", "contact.html"],
    ];

    this.dataset.ready = "true";
    this.innerHTML = `
      <header class="site-header">
        <a class="wordmark" href="index.html#home" aria-label="LOOO home">LOOO<span>.</span></a>
        <nav class="main-nav" aria-label="Main navigation">
          ${links.map(([page, label, href]) => `<a href="${href}"${page === currentPage ? ' aria-current="page"' : ""}>${label}</a>`).join("")}
        </nav>
        <div class="header-actions">
          <button class="icon-button site-cart-toggle" type="button" aria-label="Open cart" aria-expanded="false" aria-controls="site-cart-overlay">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8.5h14l-.8 12H5.8L5 8.5Z"></path><path d="M9 9V6.5a3 3 0 0 1 6 0V9"></path></svg>
            <span class="collection-cart-count site-cart-count" hidden>0</span>
          </button>
          ${currentPage === "collection" ? `
            <button class="icon-button collection-search-toggle" type="button" aria-label="Search collection">
              <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.6"></circle><path d="m16 16 4.5 4.5"></path></svg>
            </button>
          ` : ""}
          <span class="mobile-page-label">${mobileLabels[currentPage] || ""}</span>
          <button class="icon-button menu-toggle" type="button" aria-label="Open navigation" aria-expanded="false">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"></path></svg>
          </button>
        </div>
      </header>
    `;

    const menuToggle = this.querySelector(".menu-toggle");
    const mainNav = this.querySelector(".main-nav");
    const searchToggle = this.querySelector(".collection-search-toggle");
    const closeMenu = () => {
      mainNav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
    };

    menuToggle.addEventListener("click", () => {
      const opening = !mainNav.classList.contains("is-open");
      mainNav.classList.toggle("is-open", opening);
      menuToggle.setAttribute("aria-expanded", String(opening));
      menuToggle.setAttribute("aria-label", opening ? "Close navigation" : "Open navigation");
    });
    searchToggle?.addEventListener("click", () => {
      const searchInput = document.querySelector("#collection-search-input");
      searchInput?.scrollIntoView({ behavior: "smooth", block: "center" });
      searchInput?.focus({ preventScroll: true });
    });
    const renderCart = (cartItems = window.LoooCart?.getItems() || []) => {
      const count = cartItems.reduce((total, item) => total + item.quantity, 0);
      const countLabel = `${count} ${count === 1 ? "item" : "items"}`;
      const badge = this.querySelector(".site-cart-count");

      badge.textContent = String(count);
      badge.hidden = count === 0;
      this.querySelector(".site-cart-toggle").setAttribute("aria-label", `Open cart, ${countLabel}`);
    };
    window.addEventListener("store-cart-change", (event) => renderCart(event.detail.items));
    window.addEventListener("storage", (event) => {
      if (event.key === "looo-cart-v1") renderCart();
    });
    renderCart();
    mainNav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
  }
}

if (!customElements.get("site-nav")) {
  customElements.define("site-nav", SiteNav);
}