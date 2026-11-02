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
 *        • Every answer (`homeStyle`, `homeSize`, `finishTier`, `location`,
 *          `lotStatus`, `timeline`) as its readable LABEL, not the key.
 *      If the CRM field format ever changes, adjust it HERE only.
 * ========================================================================== */

import { sizeTiers } from '../config/pricingConfig.js';
import { formatRange } from './calculateEstimate.js';
import { selectionLabels } from './buildBreakdown.js';

/**
 * Build the exact JSON body to POST to the webhook from the user's selections,
 * contact info, and computed estimate. Converts internal keys to the readable
 * labels the CRM expects.
 *
 * @param {Object} args
 * @param {Object} args.contact    - { firstName, lastName, email, phone }
 * @param {Object} args.selections - { style, size, finish, addOns, location, lot, timeline }
 * @param {Object} args.estimate   - { low, high }
 * @returns {Object} payload ready to JSON.stringify
 */
export function buildLeadPayload({ contact, selections, estimate }) {
  const labels = selectionLabels(selections);

  return {
    firstName: contact.firstName.trim(),
    lastName: contact.lastName.trim(),
    email: contact.email.trim(),
    phone: (contact.phone ?? '').trim(), // optional
    homeStyle: labels.style, // e.g. "Modern"
    homeSize: labels.size, // e.g. "Spacious (3,500–5,000 sq ft)"
    squareFootage: sizeTiers[selections.size]?.sqft ?? null, // number used in the math
    finishTier: labels.finish, // readable label, e.g. "Ultra-Luxury"
    addOns: labels.addOns, // comma-joined STRING (never an array)
    location: labels.location, // readable label, e.g. "GTA Core"
    lotStatus: labels.lot, // e.g. "Knockdown & rebuild"
    timeline: labels.timeline, // e.g. "Within 6 months"
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
