# Custom Home Build — Pricing Calculator

An embeddable, multi-step pricing calculator and **lead-generation tool** for a
luxury custom-home builder. Visitors tweak project inputs, watch a live
(blurred) estimate update, then enter their contact details to unlock the full
estimated cost range. Submitting the form POSTs the lead to a single
configurable webhook (a Make scenario that routes into Mailchimp).

Built with **Vite + React + Tailwind CSS**. No backend required.

---

## 1. Running locally

```bash
npm install
npm run dev      # start the dev server (Vite prints the local URL)
npm run build    # production build → dist/
npm run preview  # preview the production build
npm run calc:test# run the pricing-math sanity checks
```

Requires Node 18+ (works on Node 22).

---

## 2. Editing pricing  ⭐ (no coding needed)

**All prices live in one file:** [`src/config/pricingConfig.js`](src/config/pricingConfig.js)

Open it and change the numbers and labels. You do **not** need to touch any
other file. The file is heavily commented and explains the units. In short:

| Section | What it controls | Unit |
|---|---|---|
| `baseCostPerSqft` | Starting build cost | $/sqft |
| `locationMultipliers` | Regional price adjustment | ×N |
| `foundationAdders` | Flat cost by foundation type | $ |
| `storiesMultiplier` | Adjustment by number of storeys | ×N |
| `garageAdders` | Flat cost by garage type | $ |
| `finishMultiplier` | Luxury / Ultra-Luxury / Bespoke | ×N |
| `addOns` | Optional features and their price | $ |
| `rangeSpread` | Width of the ± range (0.13 = ±13%) | fraction |
| `squareFootageRange` | Slider min/max/step/default | sqft |

**Editing rules:** only change numbers and the text inside `"quotes"`. Keep the
internal *key* (the word before the colon, e.g. `slab:`) the same — change the
`label` text freely, since that is what the user and your CRM actually see.

### The formula

```
subtotal = (baseCostPerSqft × squareFootage)
         + foundationAdder + garageAdder + sum(selected add-ons)

figure   = subtotal × storiesMultiplier × finishMultiplier × locationMultiplier

low  = figure × (1 − rangeSpread)
high = figure × (1 + rangeSpread)
```

The math lives in [`src/lib/calculateEstimate.js`](src/lib/calculateEstimate.js)
and is verified by `npm run calc:test`.

---

## 3. Setting the webhook (lead destination)

The lead form POSTs JSON to the URL in the `VITE_LEAD_WEBHOOK_URL` environment
variable. The frontend is destination-agnostic — it only knows this URL.

1. In **Make**, create a scenario starting with a **Custom Webhook** trigger and
   copy its URL.
2. Point that scenario at **Mailchimp** (add/update subscriber, etc.).
3. Set the env var:

   **Local:** copy `.env.example` to `.env` and set the value:
   ```bash
   VITE_LEAD_WEBHOOK_URL=https://hook.eu1.make.com/your-webhook-id
   ```
   **Vercel:** Project → Settings → Environment Variables → add
   `VITE_LEAD_WEBHOOK_URL`.

   _(Optional)_ `VITE_DISCOVERY_CALL_URL` — link for the "Schedule a Discovery
   Call" button on the results page (e.g. a Calendly URL). Defaults to no-op.

### Lead payload shape

On submit the app POSTs this JSON:

```json
{
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane@example.com",
  "phone": "(555) 123-4567",
  "squareFootage": 6000,
  "location": "GTA Core",
  "finishTier": "Ultra-Luxury",
  "addOns": "Outdoor Living, Full Pool, Home Automation",
  "estimateLow": 3259825,
  "estimateHigh": 4234025
}
```

> **Important:** `addOns` is a **comma-separated string** (not an array), and
> `location` / `finishTier` are sent as **human-readable labels** (not internal
> keys). The Make scenario expects these formats. All of this mapping lives in
> one place — [`src/lib/buildLeadPayload.js`](src/lib/buildLeadPayload.js) —
> so it's easy to adjust if the CRM field format changes.

If the webhook fails, the user still sees their estimate (the experience is
never blocked) and a soft notice is shown.

---

## 4. Deploying on Vercel

1. Push this repo to GitHub and import it into Vercel.
2. Framework preset: **Vite**. Build command `npm run build`, output `dist`.
3. Add the `VITE_LEAD_WEBHOOK_URL` environment variable (see above).
4. Deploy.

---

## 5. Embedding on a website

The build uses a relative `base`, so it works from any path.

**Iframe (simplest):**

```html
<iframe
  src="https://your-deployment.vercel.app/"
  style="width:100%;min-height:760px;border:0;"
  title="Custom Home Build Estimate"
  loading="lazy"
></iframe>
```

**Script/div mount:** host the built `dist/` and include the generated JS/CSS
from `dist/index.html` into a page that contains a `<div id="root"></div>`.

For most builder websites (Webflow, WordPress, Squarespace) the iframe embed is
recommended.

---

## 6. Project structure

```
src/
  config/
    pricingConfig.js        ← ⭐ all prices + labels (edit this)
  lib/
    calculateEstimate.js    ← pricing formula
    calculateEstimate.test.mjs
    buildLeadPayload.js     ← key→label mapping + webhook POST
    buildBreakdown.js       ← readable selection summary
    generateEstimatePdf.js  ← print-to-PDF of the estimate
  components/
    Stepper.jsx
    ui.jsx                  ← shared primitives
    steps/
      Step1Basics.jsx … Step7Results.jsx
  App.jsx                   ← flow + state orchestration
  main.jsx
```

## 7. Theming

Brand colors are CSS variables in [`src/index.css`](src/index.css)
(`--color-base`, `--color-accent`, etc.) and mapped to Tailwind tokens in
`tailwind.config.js`. Swap the RGB values to re-skin the whole calculator.
