/* ============================================================================
 *  ESTIMATE CALCULATION
 * ----------------------------------------------------------------------------
 *  Pure pricing math. Reads ALL numbers from src/config/pricingConfig.js so
 *  this file never needs editing to change prices.
 *
 *  FORMULA:
 *    subtotal = (baseCostPerSqft × squareFootage)
 *             + foundationAdder
 *             + garageAdder
 *             + sum(selected add-on prices)
 *
 *    figure   = subtotal × storiesMultiplier × finishMultiplier × locationMultiplier
 *
 *    low  = figure × (1 − rangeSpread)
 *    high = figure × (1 + rangeSpread)
 * ========================================================================== */

import {
  baseCostPerSqft,
  locationMultipliers,
  foundationAdders,
  storiesMultiplier,
  garageAdders,
  finishMultiplier,
  addOns,
  rangeSpread,
} from '../config/pricingConfig.js';

/**
 * Calculate the estimate from a set of user selections.
 *
 * @param {Object} selections
 * @param {number} selections.squareFootage  - chosen square footage (sqft)
 * @param {string} selections.location        - location key (e.g. "gtaCore")
 * @param {string} selections.stories         - stories key (e.g. "two")
 * @param {string} selections.foundation      - foundation key (e.g. "slab")
 * @param {string} selections.garage          - garage key (e.g. "attached2")
 * @param {string} selections.finish          - finish key (e.g. "ultraLuxury")
 * @param {string[]} selections.selectedAddOns - array of add-on keys
 * @returns {{ low:number, high:number, figure:number, subtotal:number }}
 */
export function calculateEstimate({
  squareFootage,
  location,
  stories,
  foundation,
  garage,
  finish,
  selectedAddOns = [],
}) {
  // --- Look up each selected value from the config (default safely to 0/1) ---
  const foundationAdder = foundationAdders[foundation]?.adder ?? 0; // $
  const garageAdder = garageAdders[garage]?.adder ?? 0; // $

  // Sum the flat price of every add-on the user toggled on.
  const addOnsTotal = selectedAddOns.reduce(
    (sum, key) => sum + (addOns[key]?.price ?? 0),
    0
  ); // $

  // --- Step 1: additive subtotal (everything in flat dollars) ---
  const subtotal =
    baseCostPerSqft * squareFootage + // base build cost
    foundationAdder + // foundation flat adder
    garageAdder + // garage flat adder
    addOnsTotal; // selected add-ons

  // --- Step 2: apply the three multipliers in sequence ---
  const storiesMult = storiesMultiplier[stories]?.multiplier ?? 1; // ×N
  const finishMult = finishMultiplier[finish]?.multiplier ?? 1; // ×N
  const locationMult = locationMultipliers[location]?.multiplier ?? 1; // ×N

  const figure = subtotal * storiesMult * finishMult * locationMult;

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
