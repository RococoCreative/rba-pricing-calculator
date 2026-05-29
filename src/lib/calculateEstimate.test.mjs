/* Quick math verification for calculateEstimate.
 * Run with:  npm run calc:test
 * This is a manual sanity check (no test framework needed). */

import { calculateEstimate, formatRange } from './calculateEstimate.js';
import {
  baseCostPerSqft,
  foundationAdders,
  garageAdders,
  addOns,
  storiesMultiplier,
  finishMultiplier,
  locationMultipliers,
  rangeSpread,
} from '../config/pricingConfig.js';

let failures = 0;
const approx = (a, b, eps = 1) => Math.abs(a - b) <= eps;
function check(name, condition, detail = '') {
  const status = condition ? 'PASS' : 'FAIL';
  if (!condition) failures++;
  console.log(`[${status}] ${name}${detail ? '  — ' + detail : ''}`);
}

console.log('\n=== calculateEstimate math verification ===\n');

// ---------------------------------------------------------------------------
// Case 1: minimal build, everything at baseline (all multipliers = 1.0, no adders)
// ---------------------------------------------------------------------------
const c1 = calculateEstimate({
  squareFootage: 4000,
  location: 'ottawa',        // ×1.00
  stories: 'one',            // ×1.00
  foundation: 'slab',        // $0
  garage: 'none',            // $0
  finish: 'luxury',          // ×1.00
  selectedAddOns: [],
});
const expected1 = baseCostPerSqft * 4000; // 285 * 4000 = 1,140,000
console.log('Case 1 (baseline 4000 sqft):', c1, '→', formatRange(c1.low, c1.high));
check('Case 1 subtotal = base × sqft', approx(c1.subtotal, expected1), `${c1.subtotal} vs ${expected1}`);
check('Case 1 figure = subtotal (all ×1.0)', approx(c1.figure, expected1));
check('Case 1 low = figure × (1 - spread)', approx(c1.low, Math.round(expected1 * (1 - rangeSpread))));
check('Case 1 high = figure × (1 + spread)', approx(c1.high, Math.round(expected1 * (1 + rangeSpread))));

// ---------------------------------------------------------------------------
// Case 2: full hand-computed build with adders, add-ons, and all multipliers
// ---------------------------------------------------------------------------
const sel2 = {
  squareFootage: 6000,
  location: 'gtaCore',                   // ×1.25
  stories: 'two',                        // ×1.08
  foundation: 'finishedBasement',        // +175,000
  garage: 'attached3',                   // +95,000
  finish: 'ultraLuxury',                 // ×1.22
  selectedAddOns: ['outdoorLiving', 'poolFull', 'homeAutomation'], // 85k + 150k + 60k
};
const c2 = calculateEstimate(sel2);
const subtotal2 =
  baseCostPerSqft * 6000 +               // 285 * 6000 = 1,710,000
  foundationAdders.finishedBasement.adder + // 175,000
  garageAdders.attached3.adder +         // 95,000
  addOns.outdoorLiving.price +           // 85,000
  addOns.poolFull.price +                // 150,000
  addOns.homeAutomation.price;           // 60,000
const figure2 =
  subtotal2 *
  storiesMultiplier.two.multiplier *
  finishMultiplier.ultraLuxury.multiplier *
  locationMultipliers.gtaCore.multiplier;
console.log('\nCase 2 (full build):', c2, '→', formatRange(c2.low, c2.high));
console.log('  hand-computed subtotal:', subtotal2, ' figure:', Math.round(figure2));
check('Case 2 subtotal matches hand math', approx(c2.subtotal, subtotal2), `${c2.subtotal} vs ${subtotal2}`);
check('Case 2 figure matches hand math', approx(c2.figure, Math.round(figure2)), `${c2.figure} vs ${Math.round(figure2)}`);
check('Case 2 low < figure < high', c2.low < c2.figure && c2.figure < c2.high);
check('Case 2 spread symmetric', approx(c2.figure - c2.low, c2.high - c2.figure, 2));

// ---------------------------------------------------------------------------
// Case 3: unknown keys fall back safely (multiplier 1, adder 0) — no crash
// ---------------------------------------------------------------------------
const c3 = calculateEstimate({
  squareFootage: 2000,
  location: 'NONEXISTENT',
  stories: 'NONEXISTENT',
  foundation: 'NONEXISTENT',
  garage: 'NONEXISTENT',
  finish: 'NONEXISTENT',
  selectedAddOns: ['NONEXISTENT'],
});
console.log('\nCase 3 (unknown keys):', c3);
check('Case 3 figure = base × sqft (safe fallback)', approx(c3.figure, baseCostPerSqft * 2000));

console.log(`\n=== ${failures === 0 ? 'ALL CHECKS PASSED' : failures + ' CHECK(S) FAILED'} ===\n`);
process.exit(failures === 0 ? 0 : 1);
