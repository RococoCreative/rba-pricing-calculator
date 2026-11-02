/* ============================================================================
 *  PRICING CONFIG  —  THE ONE FILE YOU EDIT TO CHANGE PRICING
 * ============================================================================
 *
 *  👋  NON-TECHNICAL EDITOR? START HERE.
 *
 *  Every dollar value, multiplier, label, and photo that drives the estimate
 *  lives in THIS file. You do NOT need to touch any other file to change prices.
 *
 *  HOW TO EDIT SAFELY:
 *    • Only change the numbers and the text inside 'quotes'.
 *    • Do NOT remove commas, colons, curly braces { } or square brackets [ ].
 *    • Keep the internal "key" (the word before the colon, e.g. `modern:`) the
 *      same — code looks those up by name. Change the `label` text freely; that
 *      is what the user and your CRM actually see.
 *    • `image` is a path inside the /public folder. To swap a photo, drop a new
 *      file in public/images/... and update the path (landscape, ~900px wide).
 *    • Save the file. The estimate recalculates automatically.
 *
 *  UNITS:
 *    • "$/sqft"  = dollars per square foot
 *    • "$"        = a flat dollar amount added once
 *    • "×N"       = a multiplier applied to the running subtotal
 *                   (1.0 = no change, 1.25 = +25%, 0.9 = −10%)
 *
 *  THE FORMULA (for reference — implemented in src/lib/calculateEstimate.js):
 *
 *    subtotal = (baseCostPerSqft × size.sqft)
 *             + standardAllowance
 *             + sum(selected must-have prices)
 *
 *    figure   = subtotal × style × finish × location
 *
 *    low  = figure × (1 − rangeSpread)
 *    high = figure × (1 + rangeSpread)
 *
 * ========================================================================== */

/* ----------------------------------------------------------------------------
 *  1. BASE COST PER SQUARE FOOT
 *  The starting build cost for every project, before allowances or multipliers.
 *  UNIT: $/sqft
 * -------------------------------------------------------------------------- */
export const baseCostPerSqft = 285; // $/sqft

/* ----------------------------------------------------------------------------
 *  2. STANDARD ALLOWANCE
 *  The calculator no longer asks about foundations or garages (too granular
 *  for a lead-gen tool). Instead every estimate includes this flat allowance
 *  for a typical full basement and attached 2-car garage.
 *  Default = old "Unfinished Basement" ($90k) + "Attached 2-Car" ($65k).
 *  UNIT: $ (flat, added one time)
 * -------------------------------------------------------------------------- */
export const standardAllowance = 155000; // $

/* ----------------------------------------------------------------------------
 *  3. HOME STYLE
 *  The first, most visual question. `multiplier` UNIT: ×N.
 *  Default 1.08 on every style = the old "Two Storey" multiplier, since the
 *  storeys question was removed. Set styles apart only if RBA prices them
 *  differently (e.g. modern glazing or masonry-heavy classic homes).
 * -------------------------------------------------------------------------- */
export const styles = {
  modern: {
    label: 'Modern',
    description: 'Clean lines, big glass, warm light',
    image: 'images/styles/modern.webp',
    multiplier: 1.08, // ×N
  },
  transitional: {
    label: 'Transitional',
    description: 'Modern comfort, classic proportions',
    image: 'images/styles/transitional.webp',
    multiplier: 1.08, // ×N
  },
  classic: {
    label: 'Classic',
    description: 'Stone, brick, and timeless detail',
    image: 'images/styles/classic.webp',
    multiplier: 1.08, // ×N
  },
  cottage: {
    label: 'Cottage & Lakeside',
    description: 'Cedar, steel, and water views',
    image: 'images/styles/cottage.webp',
    multiplier: 1.08, // ×N
  },
};

/* ----------------------------------------------------------------------------
 *  4. HOME SIZE
 *  Users pick a size band instead of a slider. `sqft` is the representative
 *  square footage used in the math (roughly the middle of the band).
 *  UNIT: square feet
 * -------------------------------------------------------------------------- */
export const sizeTiers = {
  comfortable: { label: 'Comfortable', range: 'Under 3,500 sq ft', hint: '3–4 bedrooms', sqft: 3000 },
  spacious:    { label: 'Spacious',    range: '3,500–5,000 sq ft', hint: '4–5 bedrooms', sqft: 4250 },
  estate:      { label: 'Estate',      range: '5,000–7,500 sq ft', hint: '5–6 bedrooms', sqft: 6250 },
  grand:       { label: 'Grand Estate', range: '7,500+ sq ft',     hint: 'Room for everything', sqft: 8500 },
};

/* ----------------------------------------------------------------------------
 *  5. FINISH LEVEL (3 tiers)
 *  The level of interior/exterior finish. UNIT: ×N applied to the subtotal.
 * -------------------------------------------------------------------------- */
export const finishMultiplier = {
  luxury: {
    label: 'Luxury',
    description: 'Premium finishes, custom millwork, designer fixtures',
    image: 'images/finishes/luxury.webp',
    multiplier: 1.0, // ×N (baseline luxury)
  },
  ultraLuxury: {
    label: 'Ultra-Luxury',
    description: 'Natural stone, integrated smart systems, bespoke cabinetry',
    image: 'images/finishes/ultra-luxury.webp',
    multiplier: 1.22, // ×N
  },
  bespoke: {
    label: 'Bespoke',
    description: 'Fully custom, architect-led, no-compromise detailing',
    image: 'images/finishes/bespoke.webp',
    multiplier: 1.5, // ×N
  },
};

/* ----------------------------------------------------------------------------
 *  6. MUST-HAVES (optional, multi-select)
 *  Each adds a flat dollar amount. Prices are NOT shown to the user (the
 *  estimate is revealed after the lead form); they only feed the math.
 *  `label` is shown on the photo card AND sent to the CRM.
 *  UNIT: $ (flat, added one time per selection)
 *
 *  ⚠️  Prices marked PLACEHOLDER are new items. Confirm them with RBA.
 * -------------------------------------------------------------------------- */
export const addOns = {
  outdoorLiving:  { label: 'Outdoor Living',  image: 'images/features/outdoor-living.webp', price: 85000 },  // $
  poolCabana:     { label: 'Pool & Cabana',   image: 'images/features/pool-cabana.webp',    price: 150000 }, // $
  gardenSuite:    { label: 'Garden Suite',    image: 'images/features/garden-suite.webp',   price: 120000 }, // $
  smartHome:      { label: 'Smart Home',      image: 'images/features/smart-home.webp',     price: 60000 },  // $
  spaEnsuite:     { label: 'Spa Ensuite',     image: 'images/features/spa-ensuite.webp',    price: 55000 },  // $ PLACEHOLDER
  wineBar:        { label: 'Wine Wall & Bar', image: 'images/features/wine-bar.webp',       price: 40000 },  // $ PLACEHOLDER
  sauna:          { label: 'Sauna & Wellness', image: 'images/features/sauna.webp',         price: 35000 },  // $ PLACEHOLDER
  boathouse:      { label: 'Boathouse & Dock', image: 'images/features/boathouse.webp',     price: 250000 }, // $ PLACEHOLDER
};

/* ----------------------------------------------------------------------------
 *  7. LOCATION MULTIPLIERS
 *  Adjusts the whole estimate for regional market differences.
 *  `multiplier` UNIT: ×N applied to the running subtotal.
 * -------------------------------------------------------------------------- */
export const locationMultipliers = {
  gtaCore:         { label: 'GTA Core',         multiplier: 1.25 }, // ×N
  gtaSuburbs:      { label: 'GTA Suburbs',      multiplier: 1.10 }, // ×N
  goldenHorseshoe: { label: 'Golden Horseshoe', multiplier: 1.05 }, // ×N
  cottageCountry:  { label: 'Cottage Country',  multiplier: 1.15 }, // ×N
  ottawa:          { label: 'Ottawa Region',    multiplier: 1.00 }, // ×N (baseline)
  otherOntario:    { label: 'Other Ontario',    multiplier: 0.92 }, // ×N
};

/* ----------------------------------------------------------------------------
 *  8. RANGE SPREAD
 *  How wide the displayed estimate range is, as a +/- fraction of the figure.
 *  0.13 means the range is from −13% to +13% of the calculated figure.
 *  UNIT: fraction (0.13 = 13%)
 * -------------------------------------------------------------------------- */
export const rangeSpread = 0.13;

/* ----------------------------------------------------------------------------
 *  9. LIVE-ESTIMATE DEFAULTS
 *  Used for the blurred live estimate before the user has answered every
 *  question. Each value must be a key from the matching section above.
 * -------------------------------------------------------------------------- */
export const estimateDefaults = {
  style: 'transitional',
  size: 'spacious',
  finish: 'ultraLuxury',
  location: 'gtaCore',
};

/* ============================================================================
 *  DERIVED LISTS  —  the UI reads these so there is ONE source of truth.
 *  You normally do NOT need to edit anything below this line.
 * ========================================================================== */

// Turn a keyed object into an array of { key, ...fields }.
const toOptions = (obj) =>
  Object.entries(obj).map(([key, value]) => ({ key, ...value }));

export const styleOptions = toOptions(styles);
export const sizeOptions = toOptions(sizeTiers);
export const finishOptions = toOptions(finishMultiplier);
export const addOnOptions = toOptions(addOns);
export const locationOptions = toOptions(locationMultipliers);
