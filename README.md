# Western Rathi Boutique

Build a visually rich, mobile-first e-commerce website for "Western Rathi" — a kids western,casual and ethnic wear brand for girls (sizes 18–36, roughly age 0–12) that also sells designer sarees for women (standard 5.30 metre / Free Size). The brand currently sells via Instagram& WhatsApp and this website is their first storefront. I'm attaching their logo and few reference images- use them wherever relevant and needed. The WhatsApp business number for all orders and the floating WhatsApp button is 8778021169 Use Supabase (native integration) for the database, image/video storage, and a simple admin login — no separate backend service.

DESIGN DIRECTION

- Brand logo is at https://i.ibb.co/4R9q0x9G/IMG-20260820-121034.jpg — use this in the floating header, extract the actual brand colors from it, and use that as the real palette instead of any placeholder colors. Fall back to blush pink + warm cream/ivory + deep maroon/mustard-gold ONLY if the logo doesn't yield a usable palette.

- Warm, feminine, playful but premium — think boutique kidswear, not generic Shopify template.

- Palette: blush pink, warm cream/ivory background, deep maroon or mustard-gold as accent(swap once real logo is provided), soft shadows, rounded corners (12–16px).

- Typography: a soft rounded display font for headings (e.g. Fredoka / Poppins SemiBold) + a clean readable body font (e.g. Inter / Nunito Sans).

- Generous whitespace, large product imagery, subtle scroll animations (fade/slide-in),no jarring transitions.

- Fully responsive — most customers will be on mobile via Instagram/WhatsApp links.

GLOBAL ELEMENTS

- Floating logo at the top, semi-transparent sticky header on scroll, shrinks slightly on scroll.

- Floating WhatsApp button (bottom-right, all pages) that opens a chat with the business number and a friendly pre-filled greeting message.

- Every inner page (listing, product detail, cart) has a "Back" button that returns to the previous page/state, not just to the homepage.

- Cart icon in header with live item count badge.

HOME PAGE

1. Hero/banner section with rotating brand imagery and a tagline.

2. "Fresh Arrivals" carousel — auto-scrolling, swipeable on mobile, pulls the most recently added products across all categories.

3. Category tiles (Girls Western Wear, Girls Ethnic Wear, Girls Casual Wear, Girls Party/Designer Frocks, Designer Sarees) — each tile links to its listing page.

4. "About Us" section — short brand story (boutique kidswear + sarees, quality, trusted by Instagram community) with a warm editorial feel, not corporate.

5. Contact Us section — WhatsApp number (click-to-chat), Instagram handle (link to instagram.com/westernrathi), maybe a simple contact form that also sends via WhatsApp.

6. Terms & Conditions section (footer ) — see draft content below.

7. Footer with quick links, social icons, copyright.

CATEGORY / PRODUCT LISTING PAGE

- Grid layout, 2 products per row on mobile, 3–4 on desktop.

- Each card: product image,  product name (1 line), price, small "Add to Cart" quick-action.

- Filter/sort bar: by size, by price, by newest.

- Clicking the image or card opens the Product Detail Page.

PRODUCT DETAIL PAGE

- Pinch-to-zoom / click-to-zoom main image, thumbnail gallery if multiple images, and video playback if a video was uploaded for this product.

- Short description (client-written), price,available sizes (chip selector), available colours (swatch selector) — both must be selected before Add to Cart/Buy Now is enabled.

- "Add to Cart" and "Buy Now" buttons (Buy Now = direct-to-checkout flow, skips cart).

- Show a small "you might also like" row from the same category.

CART PAGE

- List of added items: image, product name , chosen size, chosen colour, editable quantity stepper, remove button.

- Clicking image/description navigates back to that product's detail page (with the previously chosen size/colour pre-selected, so the customer can adjust them).

- Order summary (subtotal, item count).

- "Order Now" button (equivalent of Buy Now but for the whole cart).

CHECKOUT / WHATSAPP HANDOFF FLOW (core feature — build carefully)

- Buy Now (single product) and Order Now (cart) both open a small form asking ONLY for Name and Delivery Address (phone number optional field too, since WhatsApp already identifies them, but include it for the client's records).

- On submit, generate a pre-filled WhatsApp message (via wa.me deep link) to the business number, containing:

  • Customer name & address

  • For EACH product ordered, a clearly separated block containing: product name, chosen size, chosen colour, quantity, price, and a direct link back to that product's detail page (with size/colour as URL query params so the link opens showing exactly what the customer picked).

  • Separate each product block with a clear divider (e.g. "———") so multiple items never visually merge into one paragraph.

  • A closing line with the order total.

- This message opens the customer's WhatsApp app pre-filled, they just hit send. No payment  is collected on-site — all payment/finalization happens manually in WhatsApp chat with the client, as this is an assisted-selling model, not full self-checkout.

ADMIN DASHBOARD (Supabase-authenticated, /admin route, not linked from public nav)

- Login (simple email/password via Supabase Auth).

- Visual style for all admin screens: cream/ivory background, deep purple/maroon serif heading font for page titles (e.g. "Edit product"), small uppercase label above each input field, thin-bordered white input boxes, gold/mustard solid-fill buttons for primary actions (e.g. "SAVE PRODUCT", "ADD PRODUCT") with a small checkmark or plus icon.

- "Products" overview page: grouped by category, each category shown as a card with a representative product thumbnail, category name, product count, and a "→" link into that category's product list (mirrors a standard catalog dashboard layout).

- Category product list page: "← All Categories" back link at top, an "+ Add Product" button, then each product listed with its thumbnail, name, price, stock status, an "Edit" button, and a delete (trash) icon.

- Add/Edit Product form — ONE instance of each field only (do not duplicate any field block), in this exact order:

  1. Name (text input)

  2. Price in ₹ (number input)

  3. Category (dropdown — Girls Western Wear / Girls Ethnic Wear / Girls Casual Wear / Girls Party & Designer Frocks / Designer Sarees)

  4. Fabric (dropdown, kids fabric list below)

  5. Stock Status (dropdown — In Stock / Out of Stock / Pre-Order)

  6. Media Upload — accepts multiple images AND video files, with a file picker and camera option (store in Supabase Storage)

  7. Sizes (multi-select box, kids size list below, or single "Free Size (5.30m)" for sarees — the dropdown/list should adapt automatically when Category = Designer Sarees)

  8. Colours (multi-select/tag box — Black, White, Cream, Pink, Red, Maroon, Peach, Blue,Navy Blue, Yellow, Green, Golden, Silver, Multicolour — editable/extendable list)

  9. Short Description (textarea — this is the only description shown on the product, client fills this manually)

  10. Instagram post/reel URL (optional text input — stored only as an outbound

    "View on Instagram" link, never rendered as embedded media)

  11. Featured Product (checkbox — controls whether it appears in the homepage carousel)

  - "SAVE PRODUCT" button at the bottom. Should add products to the live site.

  - Edit/Delete existing products — changes reflect on the live site immediately.

- "Orders" dashboard page:

  - Top stats bar: Total Orders, Finished, Dismissed — each a count.

  - Date range filter (From/To, with a "Today" quick button and a complete calendar with no start/end date range- where any date(s) can be chosen ) that filters BOTH the stats and the order list below.

  - Orders list: customer name, phone, address, ordered items, status toggle(Finished / Dismissed) that the client can change with one click.

  - Repeat customers (matched by phone number appearing more than once) are visually highlighted (e.g. a small badge or colored row).

SIZES LIST FOR KIDS (use in Add/Edit Product size selector)

0-6M, 6-12M, 1-2Y, 2-3Y, 3-4Y, 4-5Y, 5-6Y, 6-7Y, 7-8Y, 8-9Y, 9-10Y, 10-11Y, 10-11Y

(also show chest-size equivalents 18–36 inches where relevant for the size chart)

SIZE FOR SAREES: Free Size — 5.30 metres (single fixed option, no size selector needed on saree products beyond this).

FABRIC LIST FOR KIDS WEAR (use in Add/Edit Product fabric dropdown)

Cotton, Soft Cotton, Cotton Blend, Rayon, Georgette, Net, Organza, Satin, Chiffon,Velvet (for winter/party wear), Denim, Fleece, Pure Silk / Art Silk (for sarees),Kanchipuram Silk, Linen Blend,

TERMS & CONDITIONS — DRAFT CONTENT (edit before publishing)

1. All orders are confirmed only after final payment/confirmation via WhatsApp. No COD option available.

2. Product colours may vary slightly due to screen/lighting differences.

3. Sizes are approximate; please refer to the size chart before ordering.

4. No Exchange accepted unless only for product defect issues, within [3] days of delivery, unused with tags intact & a proper unboxing video.

5. No returns on customized, sale, or clearance items.

6. Delivery timelines are estimates and may vary due to courier delays.

7. Prices are subject to change without prior notice.

8. Orders once shipped cannot be cancelled.



TECHNICAL NOTES FOR LOVABLE

- Use Supabase tables: products, categories, orders, order_items — with product media

  in Supabase Storage.

- Instagram post/reel URL field is purely a reference link (opens Instagram in a new tab)

  — do not attempt to embed it as playable media; all playable media on the product page comes from the client's direct upload.

- Build mobile-first; test the WhatsApp deep link flow on an actual phone, since wa.me behavior differs slightly between mobile and desktop.

Use the images attached ( apart from the first image - use it for logo colour extraction) as sample products in relevant categories. If needed use own images of your own for now as sample for each product page ( strictly no human models - keep it in ghost mannequin type or table layered images or just the images of the dresses without any models- instead of humanic models wearing dresses). Make sure all category cards have a relevant image  and the products in he product listing page also have images ( all within the above mentioned rules).

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://western-rathi-boutique.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/e9745e15-ef0a-4354-a484-b7ccc1b4ffac).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
