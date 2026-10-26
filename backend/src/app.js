const express = require("express");
const { sendOrderWhatsApp } = require("./services/whatsapp");

const app = express();

app.use(express.json());
app.use((req, res, next) => {
  if (!Buffer.isBuffer(req.body)) {
    return next();
  }

  try {
    req.body = req.body.length ? JSON.parse(req.body.toString("utf8")) : {};
    return next();
  } catch {
    return res.status(400).json({ error: "Request body must be valid JSON" });
  }
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post(["/orders", "/api/orders"], async (req, res) => {
  const { customerPhone, items, totalPrice, currency } = req.body || {};
  const validationError = validateOrder({ customerPhone, items, totalPrice, currency });

  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    const messageSid = await sendOrderWhatsApp({
      customerPhone,
      items,
      totalPrice,
      currency,
    });
    return res.status(202).json({ status: "sent", messageSid });
  } catch (error) {
    console.error("Unable to send order to WhatsApp:", error);
    const statusCode = error.code === "TWILIO_CONFIGURATION_ERROR" ? 503 : 502;
    return res.status(statusCode).json({
      error:
        statusCode === 503
          ? "WhatsApp integration is not configured"
          : "Unable to send the order to WhatsApp",
      ...(Number.isInteger(error.code) ? { twilioCode: error.code } : {}),
    });
  }
});

function validateOrder({ customerPhone, items, totalPrice, currency }) {
  if (typeof customerPhone !== "string" || customerPhone.trim() === "") {
    return "customerPhone must be a non-empty string";
  }

  if (!Array.isArray(items) || items.length === 0) {
    return "items must be a non-empty array";
  }

  if (typeof totalPrice !== "number" || !Number.isFinite(totalPrice) || totalPrice < 0) {
    return "totalPrice must be a non-negative number";
  }

  if (currency !== undefined && (typeof currency !== "string" || currency.trim() === "")) {
    return "currency must be a non-empty string";
  }

  for (const [index, item] of items.entries()) {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      return `items[${index}] must be an object`;
    }

    for (const field of ["name", "brand", "color", "size"]) {
      if (typeof item[field] !== "string" || item[field].trim() === "") {
        return `items[${index}].${field} must be a non-empty string`;
      }
    }

    if (
      item.quantity !== undefined &&
      (!Number.isInteger(item.quantity) || item.quantity < 1)
    ) {
      return `items[${index}].quantity must be a positive integer`;
    }

    if (
      item.unitPrice !== undefined &&
      (typeof item.unitPrice !== "number" ||
        !Number.isFinite(item.unitPrice) ||
        item.unitPrice < 0)
    ) {
      return `items[${index}].unitPrice must be a non-negative number`;
    }
  }

  return null;
}

module.exports = app;
