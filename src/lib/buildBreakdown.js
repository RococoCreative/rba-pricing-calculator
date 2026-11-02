/* ============================================================================
 *  SELECTION BREAKDOWN
 * ----------------------------------------------------------------------------
 *  Turns the user's internal selections into a readable summary, using the
 *  labels from the config files (single source of truth). Used on the results
 *  page, in the PDF, and for the CRM payload. Returns plain { label, value }.
 * ========================================================================== */

import {
  styles,
  sizeTiers,
  finishMultiplier,
  addOns,
  locationMultipliers,
} from '../config/pricingConfig.js';
import { lotStatus, timeline } from '../config/questions.js';

/** Readable labels for every answer, keyed by field. Missing answers are ''. */
export function selectionLabels(selections) {
  const size = sizeTiers[selections.size];
  return {
    style: styles[selections.style]?.label ?? '',
    size: size ? `${size.label} (${size.range})` : '',
    finish: finishMultiplier[selections.finish]?.label ?? '',
    addOns: (selections.addOns ?? [])
      .map((key) => addOns[key]?.label)
      .filter(Boolean)
      .join(', '),
    location: locationMultipliers[selections.location]?.label ?? '',
    lot: lotStatus[selections.lot]?.label ?? '',
    timeline: timeline[selections.timeline]?.label ?? '',
  };
}

/**
 * @param {Object} selections - full selections object
 * @returns {Array<{ label:string, value:string }>}
 */
export function buildBreakdown(selections) {
  const l = selectionLabels(selections);
  return [
    { label: 'Home Style', value: l.style || '—' },
    { label: 'Size', value: l.size || '—' },
    { label: 'Finish Level', value: l.finish || '—' },
    { label: 'Must-Haves', value: l.addOns || 'None selected' },
    { label: 'Location', value: l.location || '—' },
    { label: 'Lot', value: l.lot || '—' },
    { label: 'Timeline', value: l.timeline || '—' },
  ];
}
