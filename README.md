# Custom Home Build — Pricing Calculator

An embeddable, photo-driven pricing calculator and **lead-generation tool** for
a luxury custom-home builder. Visitors answer 7 quick, mostly one-tap questions
(style, size, finish, must-haves, location, lot, timeline) on cards that show
real RBA projects, then enter their contact details to unlock their estimated
cost range. Submitting the form POSTs the lead to a single
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

## 2. Editing the calculator  ⭐ (no coding needed)

Two files control everything a visitor sees:

| File | What it controls |
|---|---|
| [`src/config/pricingConfig.js`](src/config/pricingConfig.js) | Every price, multiplier, label, and photo |
| [`src/config/questions.js`](src/config/questions.js) | Question order and wording, plus the lot and timeline answers |

### The flow

| # | Question | Type | Affects price |
|---|---|---|---|
| 1 | Which home feels like yours? (style) | Photo cards, one tap | Yes (×N) |
| 2 | How much room do you need? (size band) | Size cards, one tap | Yes (sqft) |
| 3 | How should it feel inside? (finish) | Photo cards, one tap | Yes (×N) |
| 4 | What would make it unforgettable? (must-haves) | Photo cards, pick any or skip | Yes ($) |
| 5 | Where are you building? | Cards, one tap | Yes (×N) |
| 6 | Where are you with land? | Cards, one tap | No (sales qualifier) |
| 7 | When would you like to break ground? | Cards, one tap | No (sales qualifier) |

One-tap questions advance automatically. Then comes the lead form (with the
blurred estimate) and the results page.

### Pricing sections

| Section | What it controls | Unit |
|---|---|---|
| `baseCostPerSqft` | Starting build cost | $/sqft |
| `standardAllowance` | Typical basement + 2-car garage, included in every estimate | $ |
| `styles` | Home style cards (label, photo, multiplier) | ×N |
| `sizeTiers` | Size bands and the representative sqft used in the math | sqft |
| `finishMultiplier` | Luxury / Ultra-Luxury / Bespoke | ×N |
| `addOns` | Must-have cards and their price (prices are never shown to visitors) | $ |
| `locationMultipliers` | Regional price adjustment | ×N |
| `rangeSpread` | Width of the ± range (0.13 = ±13%) | fraction |
| `estimateDefaults` | Answers assumed for the live estimate before questions are answered | keys |

**Editing rules:** only change numbers and the text inside `'quotes'`. Keep the
internal *key* (the word before the colon, e.g. `modern:`) the same. Change the
`label` text freely, since that is what visitors and your CRM see.

### Photos

Every card photo is a real RBA project, exported from the RBA Webflow site and
stored in [`public/images/`](public/images). To swap one, drop a landscape
image (about 900px wide, `.webp` or `.jpg`) into that folder and update its
`image` path in `pricingConfig.js`. The welcome photo is
`public/images/hero.webp`.

### The formula

```
subtotal = (baseCostPerSqft × size.sqft)
         + standardAllowance + sum(selected must-haves)

figure   = subtotal × style × finish × location

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
2. **Action:** Create/Update Contact, mapping the payload fields below to
   contact fields (create custom fields for `homeStyle`, `homeSize`,
   `finishTier`, `addOns`, `location`, `lotStatus`, `timeline`, and
   `estimateRange`).
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
  "homeStyle": "Cottage & Lakeside",
  "homeSize": "Estate (5,000–7,500 sq ft)",
  "squareFootage": 6250,
  "finishTier": "Ultra-Luxury",
  "addOns": "Outdoor Living, Pool & Cabana, Boathouse & Dock",
  "location": "Cottage Country",
  "lotStatus": "Knockdown & rebuild",
  "timeline": "Within 6 months",
  "estimateLow": 3191834,
  "estimateHigh": 4145716,
  "estimateRange": "$3,191,834 – $4,145,716"
}
```

> `addOns` is a **comma-separated string** (not an array), every answer is sent
> as its **human-readable label**, and `estimateRange` is pre-formatted for use
> in emails. `lotStatus` and `timeline` are built for lead scoring (for
> example, tag "Within 6 months" + "I own a lot" as a hot lead). All of this
> mapping lives in [`src/lib/buildLeadPayload.js`](src/lib/buildLeadPayload.js).

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
public/images/              ← RBA project photos used on the cards
src/
  config/
    pricingConfig.js        ← ⭐ prices, labels, photos (edit this)
    questions.js            ← ⭐ question order + wording (edit this)
  lib/
    calculateEstimate.js    ← pricing formula
    calculateEstimate.test.mjs
    buildLeadPayload.js     ← key→label mapping + webhook POST
    buildBreakdown.js       ← readable selection summary
    generateEstimatePdf.js  ← print-to-PDF of the estimate
  components/
    QuestionStep.jsx        ← renders any question from questions.js
    Stepper.jsx
    ui.jsx                  ← buttons, photo/size/text option cards
    steps/
      Welcome.jsx  LeadGate.jsx  Results.jsx
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
