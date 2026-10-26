const bagCount = document.querySelector("#bag-count");
const bagToggle = document.querySelector("#bag-toggle");
const bagPanel = document.querySelector("#bag-panel");
const bagPanelCount = document.querySelector("#bag-panel-count");
const bagMessage = document.querySelector("#bag-message");
const clearBag = document.querySelector("#clear-bag");
const menuToggle = document.querySelector("#menu-toggle");
const mainNav = document.querySelector("#main-nav");
const searchControl = document.querySelector("#search-control");
const searchToggle = document.querySelector("#search-toggle");
const searchInput = document.querySelector("#product-search");
const searchFeedback = document.querySelector("#search-feedback");
const purchaseFeedback = document.querySelector("#purchase-feedback");
const productHero = document.querySelector(".product-hero");
const shoeImage = document.querySelector("#shoe-image");
const colorName = document.querySelector("#color-name");
const productVisual = document.querySelector("#product-visual");
const productName = document.querySelector("#product-name");
const productSubtitle = document.querySelector("#product-subtitle");
const heroPrice = document.querySelector("#hero-price");
const heroDescription = document.querySelector(".description");
const heroBrandName = document.querySelector("#hero-brand-name");
const heroBrandPosition = document.querySelector("#hero-brand-position");
const heroVariantPosition = document.querySelector("#hero-variant-position");
const heroSwatches = document.querySelector("#hero-swatches");
const previousBrand = document.querySelector("#previous-brand");
const nextBrand = document.querySelector("#next-brand");
const addToBagButton = document.querySelector("#add-to-bag");

const heroBrands = [
  {
    name: "NIKE",
    products: [
      {
        name: "AIR FORCE 1",
        subtitle: "Nike Air Force 1 '07",
        color: "White / White",
        image: "assets/hero-img/Nike__1.png",
        price: "P 1,575",
        swatch: "#f4f4f1",
        accent: "#f4f4f1",
        glow: "rgba(255, 255, 255, 0.14)",
        description: "An icon since 1982. Crisp leather, classic proportions, and that unmistakable Air cushioning. Built to move with you.",
      },
      {
        name: "AIR FORCE 1",
        subtitle: "Nike Air Force 1 '07",
        color: "Black / Black",
        image: "assets/hero-img/Nike__2.png",
        price: "P 1,575",
        swatch: "#151515",
        accent: "#f4f4f1",
        glow: "rgba(196, 205, 214, 0.13)",
        description: "A tonal take on the court original. Smooth black leather, all-black details, and the same unmistakable Air cushioning.",
      },
      {
        name: "AIR FORCE 1",
        subtitle: "Nike Air Force 1 '07",
        color: "Black / University Red",
        image: "assets/hero-img/Nike__3.png",
        price: "P 1,575",
        swatch: "#d8434d",
        accent: "#f0787e",
        glow: "rgba(204, 45, 58, 0.2)",
        description: "Black leather gets a sharp red finish. A court classic with a bolder edge and the comfort of Nike Air.",
      },
    ],
  },
  {
    name: "ADIDAS",
    products: [
      {
        name: "CAMPUS 00S",
        subtitle: "adidas Campus 00s",
        color: "Grey / White / Gum",
        image: "assets/hero-img/Campus_00s__1.png",
        price: "P 1,550",
        swatch: "linear-gradient(135deg, #85898a 0 48%, #f3f3ef 49% 76%, #b58a5b 77%)",
        accent: "#d2d7d8",
        glow: "rgba(207, 214, 218, 0.15)",
        description: "Soft grey suede, signature three stripes, and a gum sole bring an easy, lived-in finish to the Campus 00s.",
      },
      {
        name: "CAMPUS 00S",
        subtitle: "adidas Campus 00s",
        color: "Black / White / Gum",
        image: "assets/hero-img/Campus_00s__2.png",
        price: "P 1,550",
        swatch: "linear-gradient(135deg, #171717 0 48%, #f3f3ef 49% 76%, #c08b54 77%)",
        accent: "#f2eee8",
        glow: "rgba(235, 224, 208, 0.13)",
        description: "Black suede and crisp white stripes set against the warm gum sole. A relaxed terrace classic with a modern shape.",
      },
      {
        name: "CAMPUS 00S",
        subtitle: "adidas Campus 00s",
        color: "Royal Blue / White",
        image: "assets/hero-img/Campus_00s__3.png",
        price: "P 1,550",
        swatch: "linear-gradient(135deg, #183d8e 0 48%, #f3f3ef 49% 100%)",
        accent: "#9ab9ff",
        glow: "rgba(47, 91, 190, 0.2)",
        description: "Rich blue suede, white three stripes, and a low-profile sole give this Campus 00s pair a confident pop of color.",
      },
      {
        name: "SUPERSTAR",
        subtitle: "adidas Superstar",
        color: "White / Royal Blue",
        image: "assets/hero-img/Adidas__2.png",
        price: "P 1,650",
        swatch: "linear-gradient(135deg, #f4f4ef 0 48%, #2357c6 49% 100%)",
        accent: "#9ab9ff",
        glow: "rgba(57, 104, 203, 0.18)",
        description: "A white leather Superstar with vivid blue stripes and heel detail, finished with the classic shell toe.",
      },
      {
        name: "SAMBA OG",
        subtitle: "adidas Samba OG",
        color: "White / Black / Gum",
        image: "assets/hero-img/Adidas__3.png",
        price: "P 1,700",
        swatch: "linear-gradient(135deg, #f4f4ef 0 45%, #171717 46% 76%, #a77b50 77% 100%)",
        accent: "#f4f4ef",
        glow: "rgba(222, 215, 203, 0.15)",
        description: "The terrace-born Samba OG in white leather, black stripes, and a gum sole. A streamlined classic with unmistakable detail.",
      },
      {
        name: "SUPERSTAR",
        subtitle: "adidas Superstar",
        color: "Black / White",
        image: "assets/hero-img/superstar__1.png",
        price: "P 1,650",
        swatch: "linear-gradient(135deg, #171717 0 48%, #f4f4ef 49% 100%)",
        accent: "#f4f4ef",
        glow: "rgba(240, 240, 231, 0.13)",
        description: "Black leather, crisp white three stripes, and the instantly recognizable shell toe make this Superstar a sharp everyday pair.",
      },
      {
        name: "SUPERSTAR",
        subtitle: "adidas Superstar",
        color: "White / Black",
        image: "assets/hero-img/superstar__3.png",
        price: "P 1,650",
        swatch: "linear-gradient(135deg, #f4f4ef 0 48%, #171717 49% 100%)",
        accent: "#f4f4ef",
        glow: "rgba(240, 240, 231, 0.15)",
        description: "A clean white Superstar with black stripes and shell toe, pairing a bright upper with adidas' court classic details.",
      },
    ],
  },
  {
    name: "PUMA",
    products: [
      {
        name: "SUEDE CLASSIC",
        subtitle: "Puma Suede Classic",
        color: "Olive / White",
        image: "assets/hero-img/Puma__1.png",
        price: "P 1,350",
        swatch: "linear-gradient(135deg, #465337 0 54%, #f2f2ed 55% 100%)",
        accent: "#c3d49b",
        glow: "rgba(135, 163, 93, 0.2)",
        description: "Olive suede, a clean white formstrip, and a textured sole give this Suede Classic its unmistakable terrace feel.",
      },
      {
        name: "SUEDE CLASSIC",
        subtitle: "Puma Suede Classic",
        color: "Burgundy / White",
        image: "assets/hero-img/Puma__2.png",
        price: "P 1,350",
        swatch: "linear-gradient(135deg, #70263b 0 54%, #f2f2ed 55% 100%)",
        accent: "#eda0b3",
        glow: "rgba(174, 55, 86, 0.2)",
        description: "Deep burgundy suede and a bright white formstrip give the timeless Suede Classic a richer, more expressive look.",
      },
    ],
  },
];

let itemCount = 0;
let lastAddedProduct = "";
let activeBrandIndex = 0;
let activeProductIndex = 0;
let currentHeroProduct = heroBrands[0].products[0];

function closePanels(except) {
  if (bagPanel !== except) {
    bagPanel.hidden = true;
    bagToggle.setAttribute("aria-expanded", "false");
  }
}

function closeSearch() {
  searchControl.classList.remove("is-open");
  searchInput.setAttribute("tabindex", "-1");
  searchInput.blur();
  searchToggle.setAttribute("aria-expanded", "false");
  searchToggle.setAttribute("aria-label", "Open search");
}

function closeMenu() {
  mainNav.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
}

function setBagCount(count) {
  itemCount = count;
  bagCount.textContent = String(count);
  bagCount.style.display = count ? "grid" : "none";
  bagToggle.setAttribute("aria-label", `Open shopping bag, ${count} ${count === 1 ? "item" : "items"}`);
  bagPanelCount.textContent = `${count} ${count === 1 ? "item" : "items"}`;
  bagMessage.textContent = count
    ? `${lastAddedProduct ? `${lastAddedProduct} added · ` : ""}${count} item${count === 1 ? "" : "s"} in your bag.`
    : "Your next favourite pair goes here.";
  clearBag.hidden = count === 0;
}

function addToBag(product = currentHeroProduct.subtitle) {
  lastAddedProduct = product;
  window.LoooCart.add("nike-air-force-1", currentHeroProduct.color);
  purchaseFeedback.textContent = "Added to your bag.";
}

bagToggle.addEventListener("click", () => {
  const opening = bagPanel.hidden;
  closePanels(opening ? bagPanel : null);
  closeSearch();
  closeMenu();
  bagPanel.hidden = !opening;
  bagToggle.setAttribute("aria-expanded", String(opening));
});

searchToggle.addEventListener("click", () => {
  const opening = !searchControl.classList.contains("is-open");
  closePanels(null);
  closeMenu();
  searchControl.classList.toggle("is-open", opening);
  searchInput.setAttribute("tabindex", opening ? "0" : "-1");
  searchToggle.setAttribute("aria-label", opening ? "Close search" : "Open search");
  searchToggle.setAttribute("aria-expanded", String(opening));
  if (opening) searchInput.focus();
  else searchInput.blur();
});

menuToggle.addEventListener("click", () => {
  const opening = !mainNav.classList.contains("is-open");
  closePanels(null);
  closeSearch();
  mainNav.classList.toggle("is-open", opening);
  menuToggle.setAttribute("aria-expanded", String(opening));
  menuToggle.setAttribute("aria-label", opening ? "Close navigation" : "Open navigation");
});

mainNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim().toLowerCase();
  searchFeedback.textContent = !query || "air force 1".includes(query) || query.includes("air force")
    ? "Nike Air Force 1 '07 · P 1,575"
    : "No products found. Try “Air Force 1”.";
});

addToBagButton.addEventListener("click", () => addToBag(currentHeroProduct.subtitle));

document.querySelectorAll(".featured-buy-button").forEach((button) => {
  button.addEventListener("click", () => addToBag(button.dataset.buyProduct));
});

clearBag.addEventListener("click", () => {
  window.LoooCart.clear();
  purchaseFeedback.textContent = "Your bag is clear.";
});

function renderHeroProduct() {
  const brand = heroBrands[activeBrandIndex];
  currentHeroProduct = brand.products[activeProductIndex];
  const product = currentHeroProduct;
  const brandPosition = `${String(activeBrandIndex + 1).padStart(2, "0")} / ${String(heroBrands.length).padStart(2, "0")}`;
  const variantPosition = `${String(activeProductIndex + 1).padStart(2, "0")} / ${String(brand.products.length).padStart(2, "0")}`;

  productHero.style.setProperty("--hero-accent", product.accent);
  productHero.style.setProperty("--hero-glow", product.glow);
  productName.textContent = product.name;
  productSubtitle.textContent = product.subtitle;
  heroPrice.textContent = product.price;
  heroDescription.textContent = product.description;
  heroBrandName.textContent = brand.name;
  heroBrandPosition.textContent = brandPosition;
  heroVariantPosition.textContent = variantPosition;
  colorName.textContent = product.color;
  productVisual.setAttribute("aria-label", `${product.subtitle} in ${product.color}`);
  shoeImage.alt = `${product.subtitle} in ${product.color}`;
  shoeImage.src = product.image;
  shoeImage.classList.remove("is-changing");
  void shoeImage.offsetWidth;
  shoeImage.classList.add("is-changing");
  addToBagButton.setAttribute("aria-label", `Add ${product.subtitle} to bag`);
  previousBrand.setAttribute("aria-label", `Previous brand: ${heroBrands[(activeBrandIndex - 1 + heroBrands.length) % heroBrands.length].name}`);
  nextBrand.setAttribute("aria-label", `Next brand: ${heroBrands[(activeBrandIndex + 1) % heroBrands.length].name}`);
  heroSwatches.setAttribute("aria-label", `${brand.name} colorways and styles`);
  heroSwatches.replaceChildren(...brand.products.map((variant, index) => {
    const swatch = document.createElement("button");
    swatch.className = `color-swatch${index === activeProductIndex ? " is-selected" : ""}`;
    swatch.type = "button";
    swatch.dataset.variantIndex = String(index);
    swatch.title = `${variant.subtitle} - ${variant.color}`;
    swatch.setAttribute("aria-label", `${variant.subtitle}, ${variant.color}`);
    swatch.setAttribute("aria-pressed", String(index === activeProductIndex));
    swatch.style.setProperty("--swatch-color", variant.swatch);
    swatch.append(document.createElement("span"));
    return swatch;
  }));
}

heroSwatches.addEventListener("click", (event) => {
  const swatch = event.target.closest(".color-swatch");
  if (!swatch) return;
  activeProductIndex = Number(swatch.dataset.variantIndex);
  renderHeroProduct();
});

function changeBrand(direction) {
  activeBrandIndex = (activeBrandIndex + direction + heroBrands.length) % heroBrands.length;
  activeProductIndex = 0;
  renderHeroProduct();
}

previousBrand.addEventListener("click", () => changeBrand(-1));
nextBrand.addEventListener("click", () => changeBrand(1));

document.addEventListener("click", (event) => {
  if (!event.target.closest(".site-header")) {
    closePanels(null);
    closeSearch();
    closeMenu();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closePanels(null);
    closeSearch();
    closeMenu();
  }
});

renderHeroProduct();
window.addEventListener("store-cart-change", (event) => {
  setBagCount(window.LoooCart.count(event.detail.items));
});
setBagCount(window.LoooCart.count());