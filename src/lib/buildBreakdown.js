/* ============================================================================
 *  SELECTION BREAKDOWN
 * ----------------------------------------------------------------------------
 *  Turns the user's internal selections into a readable line-item summary,
 *  using the labels from pricingConfig (single source of truth). Used on the
 *  results page and in the PDF. Returns plain { label, value } rows.
 * ========================================================================== */

import {
  locationMultipliers,
  storiesMultiplier,
  foundationAdders,
  garageAdders,
  finishMultiplier,
  addOns,
} from '../config/pricingConfig.js';

/**
 * @param {Object} selections - full selections object
 * @returns {Array<{ label:string, value:string }>}
 */
export function buildBreakdown(selections) {
  const addOnLabels = selections.selectedAddOns
    .map((key) => addOns[key]?.label)
    .filter(Boolean);

  return [
    { label: 'Square Footage', value: `${selections.squareFootage.toLocaleString()} sqft` },
    { label: 'Location', value: locationMultipliers[selections.location]?.label ?? '—' },
    { label: 'Storeys', value: storiesMultiplier[selections.stories]?.label ?? '—' },
    { label: 'Foundation', value: foundationAdders[selections.foundation]?.label ?? '—' },
    { label: 'Garage', value: garageAdders[selections.garage]?.label ?? '—' },
    { label: 'Finish Level', value: finishMultiplier[selections.finish]?.label ?? '—' },
    {
      label: 'Add-Ons',
      value: addOnLabels.length ? addOnLabels.join(', ') : 'None',
    },
  ];
}
