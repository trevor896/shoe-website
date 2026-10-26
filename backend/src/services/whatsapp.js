const twilio = require("twilio");

async function sendOrderWhatsApp({ customerPhone, items, totalPrice, currency }) {
  const {
    TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN,
    TWILIO_API_KEY_SID,
    TWILIO_API_KEY_SECRET,
    TWILIO_WHATSAPP_FROM,
    SHOP_OWNER_WHATSAPP,
  } = process.env;
  const hasApiKey = TWILIO_API_KEY_SID && TWILIO_API_KEY_SECRET;

  if (
    !TWILIO_ACCOUNT_SID ||
    (!hasApiKey && !TWILIO_AUTH_TOKEN) ||
    !TWILIO_WHATSAPP_FROM ||
    !SHOP_OWNER_WHATSAPP
  ) {
    const error = new Error("Twilio WhatsApp environment variables are missing");
    error.code = "TWILIO_CONFIGURATION_ERROR";
    throw error;
  }

  const client = hasApiKey
    ? twilio(TWILIO_API_KEY_SID, TWILIO_API_KEY_SECRET, {
        accountSid: TWILIO_ACCOUNT_SID,
      })
    : twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
  const response = await client.messages.create({
    from: asWhatsAppAddress(TWILIO_WHATSAPP_FROM),
    to: asWhatsAppAddress(SHOP_OWNER_WHATSAPP),
    body: formatOrderMessage({ customerPhone, items, totalPrice, currency }),
  });

  return response.sid;
}

function asWhatsAppAddress(phoneNumber) {
  return phoneNumber.startsWith("whatsapp:")
    ? phoneNumber
    : `whatsapp:${phoneNumber}`;
}

function formatOrderMessage({ customerPhone, items, totalPrice, currency }) {
  const itemLines = items.map((item) => {
    const quantity = item.quantity || 1;
    const price =
      item.unitPrice === undefined
        ? ""
        : ` | Unit price: ${item.unitPrice}${currency ? ` ${currency}` : ""}`;
    return `- ${item.name} (${item.brand}) | Color: ${item.color} | Size: ${item.size} | Qty: ${quantity}${price}`;
  });
  const formattedTotal =
    currency === undefined ? String(totalPrice) : `${totalPrice} ${currency}`;

  return [
    "New shoe order",
    "",
    `Customer phone: ${customerPhone}`,
    "",
    ...itemLines,
    "",
    `Total: ${formattedTotal}`,
  ].join("\n");
}

module.exports = { sendOrderWhatsApp };
