# Custom Home Build — Pricing Calculator

An embeddable, multi-step pricing calculator and **lead-generation tool** for a
luxury custom-home builder. Visitors tweak project inputs, watch a live
(blurred) estimate update, then enter their contact details to unlock the full
estimated cost range. Submitting the form POSTs the lead to a single
serverless relay that forwards it to a GoHighLevel workflow, which creates the
contact and emails the estimate.

Built with **Vite + React + Tailwind CSS**, plus one Vercel function
(`api/lead.js`) for lead delivery.

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

## 3. Lead destination (GoHighLevel)

On submit, the calculator POSTs the lead to **`/api/lead`**, a Vercel function
in [`api/lead.js`](api/lead.js). The function forwards it server-side to the
GoHighLevel workflow URL in **`GHL_WEBHOOK_URL`**. GHL creates or updates the
contact and sends the estimate email.

Why the relay: the request stays same-origin (no browser CORS failures) and
the GHL webhook URL never ships in the public JavaScript.

| Env var | Where | Required | Purpose |
|---|---|---|---|
| `GHL_WEBHOOK_URL` | Vercel (server) | Yes | GHL workflow "Inbound Webhook" trigger URL |
| `VITE_DISCOVERY_CALL_URL` | Vercel (build) | No | Link for "Schedule a Discovery Call"; button hidden if unset |
| `VITE_LEAD_WEBHOOK_URL` | Vercel (build) | No | Bypass the relay and POST straight to another webhook (e.g. Make) |

`npm run dev` does not run `/api/lead`, so submissions in local dev show the
soft "couldn't save" notice. Test lead delivery on a Vercel deployment.

### GHL workflow (summary)

1. **Trigger:** Inbound Webhook. Copy its URL into `GHL_WEBHOOK_URL`.
2. **Action:** Create/Update Contact, mapping the fields below.
3. **Action:** Send Email to the contact, using the estimate fields.
4. **Settings:** allow re-entry, then Publish.

The Inbound Webhook is a GHL premium trigger: each sub-account gets 100 free
executions, then usage is billed to the account wallet.

### Lead payload shape

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
  "estimateHigh": 4234025,
  "estimateRange": "$3,259,825 – $4,234,025"
}
```

> `addOns` is a **comma-separated string** (not an array), `location` /
> `finishTier` are **human-readable labels**, and `estimateRange` is
> pre-formatted for use in emails. All of this mapping lives in
> [`src/lib/buildLeadPayload.js`](src/lib/buildLeadPayload.js).

If the relay or GHL fails, the user still sees their estimate and a soft notice
is shown. Failures are logged in Vercel → Project → Logs.

---

## 4. Deploying on Vercel

1. Push this repo to GitHub and import it into Vercel.
2. Framework preset: **Vite**. Build command `npm run build`, output `dist`.
3. Add the `GHL_WEBHOOK_URL` environment variable (see above), plus
   `VITE_DISCOVERY_CALL_URL` if you want the discovery-call button.
4. Add the deployment's domain to the Adobe Fonts project (see
   [Brand fonts](#8-brand-fonts-adobe-fonts)). Skip this and the site renders in
   Helvetica/Arial with no error.
5. Deploy.

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
Also copy the Adobe Fonts `<link>` tags from `index.html` into the host page's
`<head>`, and add the host site's domain to the Adobe Fonts project. Without
both, the calculator renders in Helvetica/Arial.

For most builder websites (Webflow, WordPress, Squarespace) the iframe embed is
recommended.

---

## 6. Project structure

```
api/
  lead.js                   ← Vercel function: relays leads to GoHighLevel
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

**Contrast rules (WCAG AA).** The brand blue is too dark for small text on the
dark background, so it is split into three tokens:

| Token | Hex | Use for |
|---|---|---|
| `accent` | `#1c6ef4` | Button fills, borders, progress bar, large figures (24px+ bold) |
| `accent-strong` | `#1558c8` | Button hover fill |
| `accent-ink` | `#6fa3f8` | Small accent text: eyebrows, prices, labels, hover text |

Button labels use `on-accent` (pure white, 4.6:1 on the blue).

**Radius.** Controls (buttons, inputs, selects) use `rounded` (4px). Cards and
panels use `rounded-xl2` (8px).

**PDF.** The downloadable estimate is a separate print document with its own
colors, set at the top of
[`src/lib/generateEstimatePdf.js`](src/lib/generateEstimatePdf.js). Update it
whenever the brand palette changes.

---

## 8. Brand fonts (Adobe Fonts)

Fonts load from Adobe Fonts kit `nsv4wzr` (linked in `index.html`):

- **Headings:** Proxima Nova (`font-display`), weights 400 and 700
- **Body:** Helvetica Neue LT Pro (`font-sans`), weights 300, 400, 500, 700

The kit has no 600 weight, so the code uses `font-medium` / `font-bold`, never
`font-semibold`. If you add weights to the kit, update the comment in
`tailwind.config.js`.

**Allowed domains.** Adobe only serves the fonts to domains listed in the web
project (fonts.adobe.com → Web Projects → this project → Domains). Add:

- the production Vercel URL (e.g. `rba-pricing-calculator.vercel.app`)
- any custom domain the calculator runs on
- the domain of any site that embeds it with the script/div mount (iframes only
  need the calculator's own domain)
- `localhost` if you want brand type during local development

Vercel preview URLs change per deploy and won't be listed, so previews show
Helvetica/Arial. Judge typography on production.

**Recommended kit setting:** set the project's font-display to **swap** in the
Adobe Fonts project settings. The default (`auto`) hides text until the fonts
arrive, which can mean a few blank seconds on slow mobile connections.
