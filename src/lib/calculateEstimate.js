/* ============================================================================
 *  ESTIMATE CALCULATION
 * ----------------------------------------------------------------------------
 *  Pure pricing math. Reads ALL numbers from src/config/pricingConfig.js so
 *  this file never needs editing to change prices.
 *
 *  FORMULA:
 *    subtotal = (baseCostPerSqft × size.sqft)
 *             + standardAllowance
 *             + sum(selected must-have prices)
 *
 *    figure   = subtotal × style × finish × location
 *
 *    low  = figure × (1 − rangeSpread)
 *    high = figure × (1 + rangeSpread)
 *
 *  Unanswered questions (null) fall back to `estimateDefaults`, so the live
 *  estimate always has a figure. Unknown keys fall back to ×1 / $0.
 * ========================================================================== */

import {
  baseCostPerSqft,
  standardAllowance,
  styles,
  sizeTiers,
  finishMultiplier,
  addOns as addOnPrices,
  locationMultipliers,
  rangeSpread,
  estimateDefaults,
} from '../config/pricingConfig.js';

/**
 * Calculate the estimate from a set of user selections.
 *
 * @param {Object} selections
 * @param {string|null} selections.style    - style key (e.g. "modern")
 * @param {string|null} selections.size     - size tier key (e.g. "spacious")
 * @param {string|null} selections.finish   - finish key (e.g. "ultraLuxury")
 * @param {string[]}    selections.addOns   - array of must-have keys
 * @param {string|null} selections.location - location key (e.g. "gtaCore")
 * @returns {{ low:number, high:number, figure:number, subtotal:number }}
 */
export function calculateEstimate({
  style = null,
  size = null,
  finish = null,
  addOns = [],
  location = null,
} = {}) {
  const pick = (value, field) => value ?? estimateDefaults[field];

  // --- Look up each selected value (unknown keys default safely) ---
  const sqft =
    sizeTiers[pick(size, 'size')]?.sqft ?? sizeTiers[estimateDefaults.size].sqft; // sqft
  const addOnsTotal = addOns.reduce(
    (sum, key) => sum + (addOnPrices[key]?.price ?? 0),
    0
  ); // $

  // --- Step 1: additive subtotal (everything in flat dollars) ---
  const subtotal = baseCostPerSqft * sqft + standardAllowance + addOnsTotal;

  // --- Step 2: apply the multipliers ---
  const styleMult = styles[pick(style, 'style')]?.multiplier ?? 1; // ×N
  const finishMult = finishMultiplier[pick(finish, 'finish')]?.multiplier ?? 1; // ×N
  const locationMult = locationMultipliers[pick(location, 'location')]?.multiplier ?? 1; // ×N

  const figure = subtotal * styleMult * finishMult * locationMult;

  // --- Step 3: spread into a ±rangeSpread range ---
  // Deliberately NOT rounded to clean numbers — slightly irregular figures
  // (e.g. $1,042,000) read as more credible than $1,000,000.
  const low = Math.round(figure * (1 - rangeSpread));
  const high = Math.round(figure * (1 + rangeSpread));

  return { low, high, figure: Math.round(figure), subtotal };
}

/**
 * Format a number as a whole-dollar string, e.g. 1042000 -> "$1,042,000".
 * @param {number} value
 * @returns {string}
 */
export function formatCurrency(value) {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format a low/high pair into a display range, e.g. "$1,042,000 – $1,198,000".
 * @param {number} low
 * @param {number} high
 * @returns {string}
 */
export function formatRange(low, high) {
  return `${formatCurrency(low)} – ${formatCurrency(high)}`;
}

/**
 * Decoy version of formatRange for the BLURRED (locked) estimate. Keeps the
 * same shape and digit count, but every digit is random, so the real figure
 * can't be read by un-blurring the DOM before the lead gate is passed.
 * Call it once per estimate change (e.g. inside useMemo) so the blur only
 * shifts when the user changes an input.
 */
export function formatMaskedRange(low, high) {
  return formatRange(low, high).replace(/\d/g, () =>
    String(Math.floor(Math.random() * 10))
  );
}
