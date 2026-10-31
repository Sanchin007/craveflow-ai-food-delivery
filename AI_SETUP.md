# CraveFlow 2.0 — AI setup

The storefront is hosted as a static GitHub Pages site. The OpenAI key must never be placed in browser JavaScript or committed to this repository.

## 1. Deploy the AI Worker

This repository includes a Cloudflare Worker in worker/index.js.

1. Create a Cloudflare account and install Wrangler: npm install -g wrangler.
2. From the repository root, run wrangler login.
3. Set the model key as a secret: wrangler secret put OPENAI_API_KEY.
4. Deploy: wrangler deploy.
5. Keep ALLOWED_ORIGIN set to https://sanchin007.github.io. OPENAI_MODEL is optional (default: gpt-4.1-mini).

The Worker keeps the provider key server-side, applies origin and request-size checks, and uses controlled tool calls over the sample catalogue. Basket changes are returned as typed actions and validated again in the browser.

## 2. Connect the website

Open config.js and set window.CRAVEFLOW_AI_API_URL to the deployed Worker URL, for example https://craveflow-ai.<your-account>.workers.dev. Commit that URL to main. The URL is public; the API key is not.

Until the Worker is deployed and configured, the website uses its local deterministic demo assistant. Voice input uses browser Speech Recognition where supported.

## 3. Product boundaries

- Restaurants, menus, prices, fees, ratings and delivery times remain sample data.
- AI can reason over the sample catalogue and request controlled browser actions; it does not query live restaurant inventory or submit real orders.
- Checkout, payment selection, delivery tracking and group ordering remain simulations.
- Allergen labels are illustrative and cannot guarantee food safety. Confirm ingredients and cross-contact with the restaurant.
- Add production rate limiting, monitoring and abuse protection before public promotion. Set a model usage budget.

## 4. Local preview

Open index.html through a local static server. No frontend build step is required. Leave config.js blank for the offline demo or set the deployed Worker URL to test hosted AI.
