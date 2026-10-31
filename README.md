# CraveFlow — AI food delivery demo

CraveFlow is a standalone, responsive food-delivery experience built as an interactive product demo. It lives in its own repository and does not modify the Chintan data & AI portfolio.

## What you can try

- Browse sample restaurants and menus.
- Filter for vegetarian meals, high-protein dishes, comfort food, and quick delivery.
- Ask the food assistant for recommendations using natural-language prompts.
- Add dishes, change quantities, switch between delivery and pickup, and review a cart.
- Complete a simulated checkout with card, Apple Pay, PayPal, or cash-on-delivery selections.
- Watch a simulated order-tracking journey with a moving courier marker, ETA, and status timeline.
- Follow the workflow map: understand → discover → validate → build → confirm.

## Try these assistant prompts

- “Find me a vegetarian dinner under €15.”
- “I want something high in protein.”
- “Something spicy, but not too spicy.”
- “Find dinner for two under €40.”
- “I'm allergic to peanuts. What can I order?”
- “Surprise me.”
- “Add chicken ramen and miso soup.”
- “Remove the fries and add a salad.”
- “Can you make that vegetarian?”
- “I need the food before 19:00.”
- “Change this to pickup.”
- “Schedule it for 19:30.”
- “Why is my order taking so long?”

The assistant uses local intent-matching logic in the browser. It is not connected to a hosted LLM or restaurant inventory API.

## Run locally

No build step or package installation is required. Open `index.html` in a browser, or serve this folder with any static web server.

## Publish with GitHub Pages

1. Open this repository's **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Select branch **main** and folder **/(root)**, then save.
4. After GitHub finishes publishing, the site should be available at:

   https://sanchin007.github.io/craveflow-ai-food-delivery/

## Demo boundaries

This is a front-end portfolio demo with sample restaurants, menu items, prices, fees, and delivery estimates.

- No real restaurant search, inventory, booking, courier dispatch, or map-routing API is connected.
- Checkout is simulated. No real payment is processed and no card credentials are requested or stored.
- Delivery and pickup status, courier movement, ETA, and scheduled times are simulated.
- The assistant uses deterministic browser-side intent matching and local actions, not a production ChatGPT integration.
- Allergen information is illustrative and must not be used to make food-safety decisions. Customers must confirm allergens and cross-contact directly with the restaurant.

## Suggested production architecture

A production implementation could replace the local demo logic with a backend-for-frontend API, a hosted LLM using controlled tool/function calling, authoritative restaurant/menu and order services, a payment provider in test/live mode, and a delivery provider or routing service. The backend must validate price, stock, delivery eligibility, payment state, and order status; the language model should never be the source of truth for those values.

## Tech

- Semantic HTML, CSS, and vanilla JavaScript
- Responsive layouts and CSS motion
- Sample imagery from Unsplash
- No runtime framework or build dependency
