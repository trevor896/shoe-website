# Shoe Store Backend

Node.js and Express API with a Netlify Functions entry point and Twilio WhatsApp order messaging.

## Requirements

- Node.js
- npm
- A Twilio account with WhatsApp messaging enabled

## Setup

From this directory, install dependencies, copy `.env.example` to `.env`, then set your Twilio account SID, WhatsApp sender, and shop owner WhatsApp number. For authentication, provide either the account auth token or both an API key SID and API key secret; API key credentials are preferred:

```sh
npm install
npm start
```

The local server listens on port `3000` by default and serves the frontend from the same origin. Run `npm start` from `backend`, then open `http://localhost:3000`. Cart requests to `/api/orders` go to the backend on that same origin; no separate frontend proxy or CORS configuration is needed. Set `PORT` to use a different port. WhatsApp addresses may be entered with or without the `whatsapp:` prefix; phone numbers should include their country code. `TWILIO_WHATSAPP_FROM` must be a WhatsApp-enabled sender on your Twilio account (for Sandbox testing, use the Sandbox sender and join the Sandbox from the receiver number).

## Health check

Request `GET /health` to confirm that the server is running. It responds with:

```json
{ "status": "ok" }
```

## Submit an order

Send `POST /orders` or `POST /api/orders` to the local Express server, or `POST /api/orders` on Netlify, with JSON in this shape:

```json
{
  "customerPhone": "+267 78 349 748",
  "items": [
    {
      "name": "Campus 00s",
      "brand": "Adidas",
      "color": "Green",
      "size": "42",
      "quantity": 1,
      "unitPrice": 1550
    }
  ],
  "totalPrice": 1550,
  "currency": "BWP"
}
```

On success, the endpoint responds with HTTP `202` and the Twilio message SID. Invalid order details receive HTTP `400`. The customer phone, item details, quantities, unit prices, and total are included in the WhatsApp message. Configure `TWILIO_ACCOUNT_SID`, one supported authentication option, `TWILIO_WHATSAPP_FROM`, and `SHOP_OWNER_WHATSAPP` before calling this endpoint.

The cart overlay submits to `/api/orders`. For local cart testing, open the frontend served by the local Express server at `http://localhost:3000`; the local API accepts both `/orders` and `/api/orders`. In production, serve the frontend on the same origin as the API route, or configure the host to proxy `/api/*` to the backend.

## Deploy to Netlify

Set the Netlify site base directory to `backend` and deploy. The `netlify.toml` file configures the `api` function and routes `/api/*` requests to it. Add `TWILIO_ACCOUNT_SID`, either `TWILIO_AUTH_TOKEN` or both `TWILIO_API_KEY_SID` and `TWILIO_API_KEY_SECRET`, `TWILIO_WHATSAPP_FROM`, and `SHOP_OWNER_WHATSAPP` in the Netlify site's environment variables. Keep all credentials private; do not commit `.env`.
