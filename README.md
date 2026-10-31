# CraveFlow — prompt-led food delivery demo

CraveFlow is a standalone, responsive food-delivery experience built as an interactive product demo. It lives in its own repository and does not modify the Chintan data & AI portfolio.

## What you can try

- Compare sample restaurant cards with star ratings, review counts, delivery estimates, delivery fees, distance and offer labels directly in the assistant chat.
- Browse sample restaurant menus, including burgers, sides, drinks, desserts, ramen, bowls, salads, and pasta.
- Filter for vegetarian meals, high-protein dishes, spice level, and per-dish budget.
- See matching food recommendations directly inside the assistant conversation, with an **Add** button on each dish — no need to scroll down to a separate menu section to choose it.
- Ask for restaurants, drinks or desserts; choose a restaurant from the chat and browse its matching menu items without leaving the conversation.
- Get a contextual drink/dessert suggestion after adding food, with one-tap add-on buttons.
- Rate food/restaurant and delivery separately after the simulated order reaches Delivered, add quick feedback tags and leave a comment.
- Type a full natural-language order such as “Order me a chicken burger, fries and a Coke.”
- Add multiple items and quantities in one prompt.
- Edit a bag by saying “Make that two chicken burgers and two fries” or “Remove the Coke and add onion rings.”
- Change between delivery and pickup, set a requested time, choose a payment preference, and open checkout from chat.
- Review the order summary and enter a name and delivery address before confirming.
- Complete a simulated checkout with card, Apple Pay, PayPal, or cash-on-delivery selections.
- Watch a simulated order-tracking journey with a moving courier marker, ETA, and status timeline.
- Follow the workflow map: understand → discover → validate → build → confirm.

## Try these assistant prompts

### Build an order
- “Order me a chicken burger, fries and a Coke.”
- “Add two chicken burgers and two Cokes.”
- “I would like a chicken ramen and miso soup.”
- “Order two chicken burrito bowls.”

### Edit the bag
- “Make that two chicken burgers and two fries.”
- “Remove the Coke and add onion rings.”
- “Remove the fries.”
- “Make it vegetarian.”

### Delivery and checkout
- “Change this to pickup.”
- “Deliver it to 12 Rue Paradis, Marseille.”
- “Schedule it for 19:30.”
- “I need the food before 19:00.”
- “Pay by PayPal.”
- “Checkout.”

### Discover
- “Find me a vegetarian dinner under €15.”
- “I want something high in protein.”
- “Something spicy, but not too spicy.”
- “Find dinner for two under €40.”
- “I'm allergic to peanuts. What can I order?”
- “Surprise me.”
- “Show me restaurants.”
- “Show me drinks.”
- “Show me desserts.”
- “Add a vanilla milkshake.”
- “Can I see the desserts at Pasta Social?”

The browser-side assistant interprets supported natural-language patterns and performs local cart/filter/checkout actions. It is not connected to a hosted LLM or restaurant inventory API, so it is a deterministic prompt-driven demo rather than a live ChatGPT integration. It supports one restaurant per order and asks for clarification when a prompt combines dishes from different restaurants.

## Run locally

No build step or package installation is required. Open `index.html` in a browser, or serve this folder with any static web server.

## Publish with GitHub Pages

1. Open this repository's **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Select branch **main** and folder **/(root)**, then save.
4. After GitHub finishes publishing, the site should be available at:

   https://sanchin007.github.io/craveflow-ai-food-delivery/

## Demo boundaries

This is a front-end product demo with sample restaurants, menu items, prices, fees, and delivery estimates.

- No real restaurant search, inventory, booking, courier dispatch, or map-routing API is connected.
- Checkout is simulated. No real payment is processed and no card credentials are requested or stored.
- Restaurant ratings, review counts, offers, distances, menu prices, fees and delivery estimates are illustrative sample data, not live marketplace data.
- Delivery and pickup status, courier movement, ETA, and scheduled times are simulated.
- Feedback is captured only in the current browser session; it is not sent to a restaurant or saved to a server.
- The assistant uses deterministic browser-side intent matching and local actions, not a production ChatGPT integration.
- Delivery checkout requires a name and address to be entered; the demo does not contain a real saved address.
- Allergen information is illustrative and must not be used to make food-safety decisions. Customers must confirm allergens and cross-contact directly with the restaurant.

## Suggested production architecture

A production implementation could replace the local demo logic with a backend-for-frontend API, a hosted LLM using controlled tool/function calling, authoritative restaurant/menu and order services, a payment provider in test/live mode, and a delivery provider or routing service. The backend must validate price, stock, delivery eligibility, payment state, and order status; the language model should never be the source of truth for those values.

## Tech

- Semantic HTML, CSS, and vanilla JavaScript
- Responsive layouts and CSS motion
- Sample imagery from Unsplash
- No runtime framework or build dependency
