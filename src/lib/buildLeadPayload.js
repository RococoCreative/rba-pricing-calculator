/* ============================================================================
 *  LEAD PAYLOAD ASSEMBLY  +  WEBHOOK POST
 * ----------------------------------------------------------------------------
 *  This is the ONE place that maps internal config keys -> human-readable
 *  labels and shapes the JSON we POST to the lead webhook.
 *
 *  Default destination: /api/lead (api/lead.js), a same-origin relay that
 *  forwards to the GoHighLevel Inbound Webhook in GHL_WEBHOOK_URL. Set
 *  VITE_LEAD_WEBHOOK_URL only to POST somewhere else directly (e.g. Make).
 *
 *  ⚠️  CRM FORMAT NOTE — read before changing:
 *      The downstream CRM mapping expects:
 *        • `addOns`     as a comma-separated STRING ("Outdoor Living, Pool"),
 *                       NOT an array. Sending an array breaks that field.
 *        • `location`   as the readable LABEL ("GTA Core"), not the key.
 *        • `finishTier` as the readable LABEL ("Ultra-Luxury"), not the key.
 *      If the CRM field format ever changes, adjust it HERE only.
 * ========================================================================== */

import {
  locationMultipliers,
  finishMultiplier,
  addOns,
} from '../config/pricingConfig.js';
import { formatRange } from './calculateEstimate.js';

/**
 * Build the exact JSON body to POST to the webhook from the user's selections,
 * contact info, and computed estimate. Converts internal keys to the readable
 * labels the CRM expects.
 *
 * @param {Object} args
 * @param {Object} args.contact   - { firstName, lastName, email, phone }
 * @param {Object} args.selections- { squareFootage, location, finish, selectedAddOns }
 * @param {Object} args.estimate  - { low, high }
 * @returns {Object} payload ready to JSON.stringify
 */
export function buildLeadPayload({ contact, selections, estimate }) {
  // Map internal keys -> readable labels (one source of truth: pricingConfig).
  const locationLabel = locationMultipliers[selections.location]?.label ?? '';
  const finishLabel = finishMultiplier[selections.finish]?.label ?? '';

  // Convert selected add-on KEYS into a single comma-separated STRING of
  // their readable labels, e.g. ["outdoorLiving","poolFull"] -> "Outdoor Living, Full Pool".
  const addOnsString = (selections.selectedAddOns ?? [])
    .map((key) => addOns[key]?.label)
    .filter(Boolean)
    .join(', ');

  return {
    firstName: contact.firstName.trim(),
    lastName: contact.lastName.trim(),
    email: contact.email.trim(),
    phone: (contact.phone ?? '').trim(), // optional
    squareFootage: selections.squareFootage, // number, for context
    location: locationLabel, // readable label, e.g. "GTA Core"
    finishTier: finishLabel, // readable label, e.g. "Ultra-Luxury"
    addOns: addOnsString, // comma-joined STRING (never an array)
    estimateLow: estimate.low, // number
    estimateHigh: estimate.high, // number
    estimateRange: formatRange(estimate.low, estimate.high), // "$1,977,388 – $2,568,332", ready for emails
  };
}

/**
 * POST the lead payload to the configured webhook.
 * Throws on network error or non-2xx so the caller can show an error state
 * (the caller still reveals the estimate so the user isn't blocked).
 *
 * @param {Object} payload - output of buildLeadPayload
 * @returns {Promise<void>}
 */
export async function postLead(payload) {
  // Relay by default; an explicit override POSTs straight to that URL.
  const url = import.meta.env.VITE_LEAD_WEBHOOK_URL || '/api/lead';

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Webhook responded with status ${res.status}`);
  }
}
