const reducedMotionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
const supportsScrollReveal = "IntersectionObserver" in window && !reducedMotionPreference.matches;

if (supportsScrollReveal) {
  const revealSelector = [
    ".product-copy",
    ".featured-header",
    ".featured-card",
    ".who-section",
    ".about-stat",
    ".how-section",
    ".team-card",
    ".page-intro",
    ".collection-search",
    ".collection-results-toolbar",
    ".collection-product",
    ".contact-hero",
    ".contact-form",
    ".contact-detail",
    ".contact-map-wrap",
    ".contact-cta",
    ".testimonials-section",
  ].join(",");

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-revealed");
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.12,
    rootMargin: "0px 0px -32px 0px",
  });

  function observeRevealElements(root) {
    const elements = [];
    if (root instanceof Element && root.matches(revealSelector)) elements.push(root);
    if (root.querySelectorAll) elements.push(...root.querySelectorAll(revealSelector));

    elements.forEach((element) => {
      if (element.classList.contains("reveal-on-scroll")) return;
      const siblings = [...element.parentElement.children].filter((sibling) => sibling.matches(revealSelector));
      const delay = Math.min(siblings.indexOf(element), 4) * 75;
      element.style.setProperty("--reveal-delay", `${Math.max(delay, 0)}ms`);
      element.classList.add("reveal-on-scroll");
      revealObserver.observe(element);
    });
  }

  document.documentElement.classList.add("scroll-reveal-enabled");
  observeRevealElements(document);

  const collectionGrid = document.querySelector("#collection-grid");
  if (collectionGrid) {
    new MutationObserver((records) => {
      records.forEach((record) => record.addedNodes.forEach((node) => observeRevealElements(node)));
    }).observe(collectionGrid, { childList: true });
  }
}