/* Quick math verification for calculateEstimate.
 * Run with:  npm run calc:test
 * This is a manual sanity check (no test framework needed). */

import { calculateEstimate, formatRange } from './calculateEstimate.js';
import {
  baseCostPerSqft,
  standardAllowance,
  styles,
  sizeTiers,
  finishMultiplier,
  addOns,
  locationMultipliers,
  rangeSpread,
  estimateDefaults,
} from '../config/pricingConfig.js';
import { buildLeadPayload } from './buildLeadPayload.js';
import { questions } from '../config/questions.js';

let failures = 0;
const approx = (a, b, eps = 1) => Math.abs(a - b) <= eps;
function check(name, condition, detail = '') {
  const status = condition ? 'PASS' : 'FAIL';
  if (!condition) failures++;
  console.log(`[${status}] ${name}${detail ? '  — ' + detail : ''}`);
}

console.log('\n=== calculateEstimate math verification ===\n');

// ---------------------------------------------------------------------------
// Case 1: baseline answers, no must-haves
// ---------------------------------------------------------------------------
const c1 = calculateEstimate({
  style: 'modern',
  size: 'spacious',
  finish: 'luxury', // ×1.00
  addOns: [],
  location: 'ottawa', // ×1.00
});
const subtotal1 = baseCostPerSqft * sizeTiers.spacious.sqft + standardAllowance;
const figure1 = subtotal1 * styles.modern.multiplier;
console.log('Case 1 (baseline):', c1, '→', formatRange(c1.low, c1.high));
check('Case 1 subtotal = base × sqft + allowance', approx(c1.subtotal, subtotal1), `${c1.subtotal} vs ${subtotal1}`);
check('Case 1 figure = subtotal × style', approx(c1.figure, Math.round(figure1)));
check('Case 1 low = figure × (1 - spread)', approx(c1.low, Math.round(figure1 * (1 - rangeSpread))));
check('Case 1 high = figure × (1 + spread)', approx(c1.high, Math.round(figure1 * (1 + rangeSpread))));

// ---------------------------------------------------------------------------
// Case 2: full hand-computed build with must-haves and all multipliers
// ---------------------------------------------------------------------------
const sel2 = {
  style: 'cottage',
  size: 'estate',
  finish: 'ultraLuxury',
  addOns: ['outdoorLiving', 'poolCabana', 'boathouse'],
  location: 'cottageCountry',
};
const c2 = calculateEstimate(sel2);
const subtotal2 =
  baseCostPerSqft * sizeTiers.estate.sqft +
  standardAllowance +
  addOns.outdoorLiving.price +
  addOns.poolCabana.price +
  addOns.boathouse.price;
const figure2 =
  subtotal2 *
  styles.cottage.multiplier *
  finishMultiplier.ultraLuxury.multiplier *
  locationMultipliers.cottageCountry.multiplier;
console.log('\nCase 2 (full build):', c2, '→', formatRange(c2.low, c2.high));
check('Case 2 subtotal matches hand math', approx(c2.subtotal, subtotal2), `${c2.subtotal} vs ${subtotal2}`);
check('Case 2 figure matches hand math', approx(c2.figure, Math.round(figure2)), `${c2.figure} vs ${Math.round(figure2)}`);
check('Case 2 low < figure < high', c2.low < c2.figure && c2.figure < c2.high);
check('Case 2 spread symmetric', approx(c2.figure - c2.low, c2.high - c2.figure, 2));

// ---------------------------------------------------------------------------
// Case 3: unanswered questions use estimateDefaults (live estimate)
// ---------------------------------------------------------------------------
const c3 = calculateEstimate({ style: null, size: null, finish: null, addOns: [], location: null });
const c3expected = calculateEstimate({ ...estimateDefaults, addOns: [] });
console.log('\nCase 3 (unanswered):', c3);
check('Case 3 nulls fall back to estimateDefaults', c3.figure === c3expected.figure);

// ---------------------------------------------------------------------------
// Case 4: unknown keys fall back safely (×1, $0) — no crash
// ---------------------------------------------------------------------------
const c4 = calculateEstimate({
  style: 'NOPE', size: 'NOPE', finish: 'NOPE', addOns: ['NOPE'], location: 'NOPE',
});
const c4expected = baseCostPerSqft * sizeTiers[estimateDefaults.size].sqft + standardAllowance;
console.log('\nCase 4 (unknown keys):', c4);
check('Case 4 figure = base × default sqft + allowance', approx(c4.figure, c4expected));

// ---------------------------------------------------------------------------
// Case 5: config integrity — defaults exist, every question has options
// ---------------------------------------------------------------------------
check('estimateDefaults keys all exist',
  !!styles[estimateDefaults.style] && !!sizeTiers[estimateDefaults.size] &&
  !!finishMultiplier[estimateDefaults.finish] && !!locationMultipliers[estimateDefaults.location]);
check('every question has options', questions.every((q) => q.options.length > 0));

// ---------------------------------------------------------------------------
// Case 6: CRM payload uses labels and a comma-joined add-ons string
// ---------------------------------------------------------------------------
const payload = buildLeadPayload({
  contact: { firstName: ' Jane ', lastName: 'Doe', email: 'jane@example.com', phone: '' },
  selections: { ...sel2, lot: 'knockdown', timeline: 'soon' },
  estimate: c2,
});
console.log('\nCase 6 payload:', payload);
check('payload addOns is a string', typeof payload.addOns === 'string' && payload.addOns.includes(', '));
check('payload uses labels', payload.homeStyle === 'Cottage & Lakeside' && payload.lotStatus === 'Knockdown & rebuild');
check('payload trims names', payload.firstName === 'Jane');

console.log(`\n=== ${failures === 0 ? 'ALL CHECKS PASSED' : failures + ' CHECK(S) FAILED'} ===\n`);
process.exit(failures === 0 ? 0 : 1);
