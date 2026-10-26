const collectionGrid = document.querySelector("#collection-grid");
const collectionPagination = document.querySelector("#collection-pagination");
const collectionSearch = document.querySelector("#collection-search-input");
const collectionSearchClear = document.querySelector("#collection-search-clear");
const collectionSearchStatus = document.querySelector("#collection-search-status");
const collectionAudienceFilter = document.querySelector("#collection-audience-filter");
const collectionCartFeedback = document.querySelector("#collection-cart-feedback");
const collectionCatalog = window.collectionCatalog || [];
const collectionCompactLayout = window.matchMedia("(max-width: 900px)");
const imageIndexes = new Map();
let currentPage = 1;

function getCartProductIds() {
  return new Set(window.LoooCart.getItems().map((item) => item.productId));
}

function getPageSize() {
  return collectionCompactLayout.matches ? 8 : 12;
}

function getFilteredProducts() {
  const query = collectionSearch.value.trim().toLowerCase();
  const audience = collectionAudienceFilter.value;

  return collectionCatalog.filter((product) => {
    const colors = product.images.map((image) => image.color).join(" ");
    const searchableText = `${product.brand} ${product.name} ${colors}`.toLowerCase();
    const matchesSearch = searchableText.includes(query);
    const matchesAudience = audience === "all" || product.audience.includes(audience);
    return matchesSearch && matchesAudience;
  });
}

function makeGallery(product) {
  const gallery = document.createElement("div");
  gallery.className = "collection-gallery";
  gallery.setAttribute("role", "group");
  gallery.setAttribute("aria-label", `${product.brand} ${product.name} images`);

  const image = document.createElement("img");
  image.className = "collection-product-image";
  image.draggable = false;
  gallery.append(image);

  const color = document.createElement("span");
  color.className = "collection-product-color";
  color.setAttribute("aria-live", "polite");

  const controls = document.createElement("div");
  controls.className = "collection-gallery-controls";
  const previous = document.createElement("button");
  previous.className = "collection-gallery-button collection-gallery-previous";
  previous.type = "button";
  previous.setAttribute("aria-label", `Previous ${product.brand} ${product.name} color`);
  previous.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"></path></svg>';
  const counter = document.createElement("span");
  counter.className = "collection-gallery-counter";
  const next = document.createElement("button");
  next.className = "collection-gallery-button collection-gallery-next";
  next.type = "button";
  next.setAttribute("aria-label", `Next ${product.brand} ${product.name} color`);
  next.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6"></path></svg>';
  controls.append(previous, counter, next);
  gallery.append(controls);

  const setImage = (nextIndex) => {
    const index = (nextIndex + product.images.length) % product.images.length;
    imageIndexes.set(product.id, index);
    const variant = product.images[index];
    image.src = variant.src || `assets/Collections/${encodeURIComponent(variant.file)}`;
    image.alt = `${product.brand} ${product.name} in ${variant.color}`;
    color.textContent = variant.color;
    counter.textContent = `${index + 1} / ${product.images.length}`;
    controls.hidden = product.images.length < 2;
  };

  gallery.append(color);
  previous.addEventListener("click", () => setImage((imageIndexes.get(product.id) || 0) - 1));
  next.addEventListener("click", () => setImage((imageIndexes.get(product.id) || 0) + 1));

  let pointerStartX = null;
  gallery.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" || event.target.closest("button")) return;
    pointerStartX = event.clientX;
  });
  gallery.addEventListener("pointerup", (event) => {
    if (pointerStartX === null) return;
    const distance = event.clientX - pointerStartX;
    pointerStartX = null;
    if (Math.abs(distance) < 36) return;
    setImage((imageIndexes.get(product.id) || 0) + (distance < 0 ? 1 : -1));
  });
  gallery.addEventListener("pointercancel", () => {
    pointerStartX = null;
  });

  setImage(imageIndexes.get(product.id) || 0);
  return gallery;
}

function makeProductCard(product) {
  const card = document.createElement("article");
  card.className = "collection-product";
  card.dataset.audience = product.audience.join(" ");
  card.dataset.productId = product.id;
  card.append(makeGallery(product));

  const info = document.createElement("div");
  info.className = "collection-product-info";
  const brand = document.createElement("p");
  brand.className = "collection-product-brand";
  brand.textContent = product.brand;
  const title = document.createElement("h2");
  title.textContent = product.name;
  info.append(brand, title);
  card.append(info);

  const footer = document.createElement("div");
  footer.className = "collection-product-bottom";
  const price = document.createElement("strong");
  price.textContent = product.price;
  const cartButton = document.createElement("button");
  const cartProducts = getCartProductIds();
  cartButton.className = "collection-cart-button";
  cartButton.type = "button";
  cartButton.setAttribute("aria-pressed", String(cartProducts.has(product.id)));
  cartButton.innerHTML = '<svg class="collection-cart-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2l2.2 10.1a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 1.9-1.4L21 8H6"></path><circle cx="10" cy="20" r="1"></circle><circle cx="18" cy="20" r="1"></circle></svg><svg class="collection-cart-added-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6"></path></svg>';
  cartButton.classList.toggle("is-added", cartProducts.has(product.id));
  cartButton.setAttribute("aria-label", `${cartProducts.has(product.id) ? "Remove" : "Add"} ${product.brand} ${product.name} ${cartProducts.has(product.id) ? "from" : "to"} cart`);
  cartButton.addEventListener("click", () => {
    const variantIndex = imageIndexes.get(product.id) || 0;
    window.LoooCart.toggle(product.id, product.images[variantIndex].color);
    const added = getCartProductIds().has(product.id);
    cartButton.classList.toggle("is-added", added);
    cartButton.setAttribute("aria-pressed", String(added));
    cartButton.setAttribute("aria-label", `${added ? "Remove" : "Add"} ${product.brand} ${product.name} ${added ? "from" : "to"} cart`);
    collectionCartFeedback.textContent = `${product.brand} ${product.name} ${added ? "added to" : "removed from"} cart.`;
  });
  footer.append(price, cartButton);
  card.append(footer);
  return card;
}

function makePageButton(label, page, disabled = false, current = false) {
  const button = document.createElement("button");
  button.className = "collection-page-button";
  button.type = "button";
  button.textContent = label;
  button.disabled = disabled;
  if (current) button.setAttribute("aria-current", "page");
  button.addEventListener("click", () => {
    currentPage = page;
    renderCollection();
    collectionGrid.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  return button;
}

function renderPagination(totalPages) {
  collectionPagination.replaceChildren();
  collectionPagination.hidden = totalPages <= 1;
  if (totalPages <= 1) return;

  collectionPagination.append(makePageButton("Previous", currentPage - 1, currentPage === 1));
  const maxVisiblePages = collectionCompactLayout.matches ? 3 : 5;
  const firstPage = Math.max(1, Math.min(currentPage - Math.floor(maxVisiblePages / 2), totalPages - maxVisiblePages + 1));
  const lastPage = Math.min(totalPages, firstPage + maxVisiblePages - 1);

  for (let page = firstPage; page <= lastPage; page += 1) {
    collectionPagination.append(makePageButton(String(page), page, false, page === currentPage));
  }
  collectionPagination.append(makePageButton("Next", currentPage + 1, currentPage === totalPages));
}

function renderCollection() {
  const matchingProducts = getFilteredProducts();
  const pageSize = getPageSize();
  const totalPages = Math.ceil(matchingProducts.length / pageSize);
  currentPage = Math.min(currentPage, Math.max(totalPages, 1));
  const firstProduct = (currentPage - 1) * pageSize;
  const pageProducts = matchingProducts.slice(firstProduct, firstProduct + pageSize);

  collectionGrid.replaceChildren(...pageProducts.map(makeProductCard));
  collectionSearchClear.hidden = collectionSearch.value.trim() === "";
  collectionSearchStatus.textContent = matchingProducts.length === 0
    ? "No shoes found"
    : `${matchingProducts.length} ${matchingProducts.length === 1 ? "shoe" : "shoes"}`;
  renderPagination(totalPages);
}

collectionSearch.addEventListener("input", () => {
  currentPage = 1;
  renderCollection();
});
collectionAudienceFilter.addEventListener("change", () => {
  currentPage = 1;
  renderCollection();
});
collectionSearchClear.addEventListener("click", () => {
  collectionSearch.value = "";
  currentPage = 1;
  renderCollection();
  collectionSearch.focus();
});
collectionCompactLayout.addEventListener("change", () => {
  currentPage = 1;
  renderCollection();
});

renderCollection();