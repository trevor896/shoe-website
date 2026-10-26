(function () {
  const storageKey = "looo-cart-v1";

  function read() {
    try {
      const items = JSON.parse(localStorage.getItem(storageKey) || "[]");
      if (!Array.isArray(items)) return [];

      return items.filter((item) =>
        item &&
        typeof item.productId === "string" &&
        typeof item.color === "string" &&
        typeof item.size === "string" &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0
      );
    } catch (error) {
      console.error("Unable to read the saved cart:", error);
      return [];
    }
  }

  function publish(items) {
    localStorage.setItem(storageKey, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent("store-cart-change", {
      detail: { items },
    }));
  }

  function getItems() {
    return read();
  }

  function add(productId, color) {
    const items = read();
    const existing = items.find((item) => item.productId === productId);

    if (existing) {
      existing.quantity += 1;
    } else {
      items.push({ productId, color, size: "", quantity: 1 });
    }

    publish(items);
  }

  function toggle(productId, color) {
    const items = read();
    const existing = items.find((item) => item.productId === productId);

    if (existing) {
      items.splice(items.indexOf(existing), 1);
    } else {
      items.push({ productId, color, size: "", quantity: 1 });
    }

    publish(items);
  }

  function update(productId, updates) {
    const items = read();
    const item = items.find((entry) => entry.productId === productId);
    if (!item) return;

    Object.assign(item, updates);
    publish(items);
  }

  function remove(productId) {
    publish(read().filter((item) => item.productId !== productId));
  }

  function clear() {
    publish([]);
  }

  function count(items = read()) {
    return items.reduce((total, item) => total + item.quantity, 0);
  }

  window.LoooCart = { getItems, add, toggle, update, remove, clear, count };
})();
