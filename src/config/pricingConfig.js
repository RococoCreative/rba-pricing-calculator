/* ============================================================================
 *  PRICING CONFIG  —  THE ONE FILE YOU EDIT TO CHANGE PRICING
 * ============================================================================
 *
 *  👋  NON-TECHNICAL EDITOR? START HERE.
 *
 *  Every dollar value, multiplier, and label that drives the estimate lives in
 *  THIS file. You do NOT need to touch any other file to change prices.
 *
 *  HOW TO EDIT SAFELY:
 *    • Only change the numbers and the text inside "quotes".
 *    • Do NOT remove commas, colons, curly braces { } or square brackets [ ].
 *    • Keep the internal "key" (the word before the colon, e.g. `slab:`) the
 *      same — code looks those up by name. Change the `label` text freely; that
 *      is what the user and your CRM actually see.
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
 *    subtotal = (baseCostPerSqft × squareFootage)
 *             + foundationAdder
 *             + garageAdder
 *             + sum(selected add-on prices)
 *
 *    figure   = subtotal × storiesMultiplier × finishMultiplier × locationMultiplier
 *
 *    low  = figure × (1 − rangeSpread)
 *    high = figure × (1 + rangeSpread)
 *
 * ========================================================================== */

/* ----------------------------------------------------------------------------
 *  1. BASE COST PER SQUARE FOOT
 *  The starting build cost for every project, before any adders or multipliers.
 *  UNIT: $/sqft
 * -------------------------------------------------------------------------- */
export const baseCostPerSqft = 285; // $/sqft

/* ----------------------------------------------------------------------------
 *  2. LOCATION MULTIPLIERS
 *  Adjusts the whole estimate up or down for regional market differences.
 *  `label` is the human-readable name shown in the dropdown AND sent to the CRM.
 *  `multiplier` UNIT: ×N applied to the running subtotal.
 * -------------------------------------------------------------------------- */
export const locationMultipliers = {
  gtaCore:    { label: 'GTA Core',          multiplier: 1.25 }, // ×N
  gtaSuburbs: { label: 'GTA Suburbs',       multiplier: 1.10 }, // ×N
  goldenHorseshoe: { label: 'Golden Horseshoe', multiplier: 1.05 }, // ×N
  cottageCountry: { label: 'Cottage Country', multiplier: 1.15 }, // ×N
  ottawa:     { label: 'Ottawa Region',     multiplier: 1.00 }, // ×N (baseline)
  otherOntario: { label: 'Other Ontario',   multiplier: 0.92 }, // ×N
};

/* ----------------------------------------------------------------------------
 *  3. FOUNDATION ADDERS
 *  A flat dollar amount added once based on foundation type.
 *  UNIT: $ (flat, added one time)
 * -------------------------------------------------------------------------- */
export const foundationAdders = {
  slab:              { label: 'Slab-on-Grade',       adder: 0 },       // $
  crawlspace:        { label: 'Crawlspace',          adder: 35000 },   // $
  unfinishedBasement:{ label: 'Unfinished Basement', adder: 90000 },   // $
  finishedBasement:  { label: 'Finished Basement',   adder: 175000 },  // $
};

/* ----------------------------------------------------------------------------
 *  4. STORIES MULTIPLIER
 *  Adjusts cost based on the number of storeys (taller = more structure/cost).
 *  UNIT: ×N applied to the running subtotal.
 * -------------------------------------------------------------------------- */
export const storiesMultiplier = {
  one:      { label: 'Single Storey',  multiplier: 1.00 }, // ×N
  two:      { label: 'Two Storey',     multiplier: 1.08 }, // ×N
  threePlus:{ label: 'Three+ Storey',  multiplier: 1.18 }, // ×N
};

/* ----------------------------------------------------------------------------
 *  5. GARAGE ADDERS
 *  A flat dollar amount added once based on garage configuration.
 *  UNIT: $ (flat, added one time)
 * -------------------------------------------------------------------------- */
export const garageAdders = {
  none:      { label: 'No Garage',          adder: 0 },      // $
  attached2: { label: 'Attached 2-Car',     adder: 65000 },  // $
  attached3: { label: 'Attached 3-Car',     adder: 95000 },  // $
  detached2: { label: 'Detached 2-Car',     adder: 85000 },  // $
};

/* ----------------------------------------------------------------------------
 *  6. FINISH MULTIPLIER (3 tiers)
 *  The level of interior/exterior finish. Each tier has a short descriptor
 *  shown on the visual selector. UNIT: ×N applied to the running subtotal.
 * -------------------------------------------------------------------------- */
export const finishMultiplier = {
  luxury: {
    label: 'Luxury',
    description: 'Premium finishes, custom millwork, and designer fixtures throughout.',
    multiplier: 1.00, // ×N (baseline luxury)
  },
  ultraLuxury: {
    label: 'Ultra-Luxury',
    description: 'Imported stone, integrated smart systems, and bespoke cabinetry.',
    multiplier: 1.22, // ×N
  },
  bespoke: {
    label: 'Bespoke',
    description: 'Fully custom, architect-led, no-compromise materials and detailing.',
    multiplier: 1.5, // ×N
  },
};

/* ----------------------------------------------------------------------------
 *  7. ADD-ONS
 *  Optional features the user can toggle on. Each adds a flat dollar amount.
 *  `label` is shown on the checkbox card AND sent to the CRM.
 *  UNIT: $ (flat, added one time per selected add-on)
 * -------------------------------------------------------------------------- */
export const addOns = {
  outdoorLiving:   { label: 'Outdoor Living',   price: 85000,  description: 'Covered patio, outdoor kitchen, and fireplace.' },   // $
  poolRoughin:     { label: 'Pool Rough-In',    price: 25000,  description: 'Plumbing and electrical prepped for a future pool.' }, // $
  poolFull:        { label: 'Full Pool',        price: 150000, description: 'In-ground pool with full installation and decking.' }, // $
  homeAutomation:  { label: 'Home Automation',  price: 60000,  description: 'Whole-home lighting, climate, security, and AV.' },    // $
  generator:       { label: 'Standby Generator',price: 30000,  description: 'Automatic whole-home backup power.' },                 // $
  inLawSuite:      { label: 'In-Law Suite',     price: 120000, description: 'Self-contained secondary living quarters.' },         // $
  finishedBasement:{ label: 'Finished Basement',price: 110000, description: 'Fully finished lower level living space.' },          // $
  elevator:        { label: 'Elevator',         price: 95000,  description: 'Residential multi-floor elevator.' },                 // $
};

/* ----------------------------------------------------------------------------
 *  8. RANGE SPREAD
 *  How wide the displayed estimate range is, as a +/- fraction of the figure.
 *  0.13 means the range is from −13% to +13% of the calculated figure.
 *  UNIT: fraction (0.13 = 13%)
 * -------------------------------------------------------------------------- */
export const rangeSpread = 0.13;

/* ----------------------------------------------------------------------------
 *  9. SQUARE FOOTAGE SLIDER BOUNDS
 *  The min/max/step for the square footage slider on step 1.
 *  UNIT: square feet
 * -------------------------------------------------------------------------- */
export const squareFootageRange = {
  min: 1500,    // sqft
  max: 10000,   // sqft
  step: 100,    // sqft
  default: 4000,// sqft
};

/* ============================================================================
 *  DERIVED LISTS  —  the UI reads these so there is ONE source of truth.
 *  You normally do NOT need to edit anything below this line; it is generated
 *  from the data you set above.
 * ========================================================================== */

// Generic helper: turn a keyed object into an array of { key, ...fields }.
const toOptions = (obj) =>
  Object.entries(obj).map(([key, value]) => ({ key, ...value }));

// Region dropdown options: [{ key, label, multiplier }, ...]
export const locationOptions = toOptions(locationMultipliers);

// Foundation dropdown options: [{ key, label, adder }, ...]
export const foundationOptions = toOptions(foundationAdders);

// Stories toggle options: [{ key, label, multiplier }, ...]
export const storiesOptions = toOptions(storiesMultiplier);

// Garage toggle options: [{ key, label, adder }, ...]
export const garageOptions = toOptions(garageAdders);

// Finish-tier selector options: [{ key, label, description, multiplier }, ...]
export const finishOptions = toOptions(finishMultiplier);

// Add-on checkbox card options: [{ key, label, price, description }, ...]
export const addOnOptions = toOptions(addOns);
