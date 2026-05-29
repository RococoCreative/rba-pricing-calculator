/* ============================================================================
 *  ESTIMATE PDF (print-to-PDF)
 * ----------------------------------------------------------------------------
 *  Dependency-free approach: open a clean, print-styled HTML document in a new
 *  window and trigger the browser's print dialog, where the user can "Save as
 *  PDF". Avoids bundling a heavy PDF library while still producing a tidy,
 *  branded one-page estimate.
 * ========================================================================== */

import { formatRange } from './calculateEstimate.js';

const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[c]);

const DISCLAIMER =
  'This estimate is based on current regional market averages and your selected specifications. Final pricing requires a full scope review and site assessment.';

/**
 * @param {Object} args
 * @param {Object} args.contact   - { firstName, lastName, ... }
 * @param {Object} args.estimate  - { low, high }
 * @param {Array}  args.breakdown - [{ label, value }, ...]
 */
export function generateEstimatePdf({ contact, estimate, breakdown }) {
  const rows = breakdown
    .map(
      (r) =>
        `<tr><td class="lbl">${escapeHtml(r.label)}</td><td class="val">${escapeHtml(
          r.value
        )}</td></tr>`
    )
    .join('');

  const dateStr = new Date().toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const html = `<!doctype html>
<html><head><meta charset="utf-8" />
<title>Custom Home Build Estimate</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: Georgia, 'Times New Roman', serif; color: #1a1a1a; margin: 48px; }
  .eyebrow { letter-spacing: .2em; text-transform: uppercase; font-size: 11px; color: #8a7a4f; font-family: Arial, sans-serif; }
  h1 { font-size: 30px; margin: 6px 0 4px; }
  .meta { color: #666; font-size: 13px; font-family: Arial, sans-serif; margin-bottom: 28px; }
  .range-box { border: 1px solid #d8cba8; background: #faf7ef; border-radius: 12px; padding: 28px; text-align: center; margin-bottom: 32px; }
  .range-box .cap { font-family: Arial, sans-serif; font-size: 12px; letter-spacing: .15em; text-transform: uppercase; color: #8a7a4f; }
  .range-box .range { font-size: 34px; font-weight: bold; color: #1a1a1a; margin-top: 8px; }
  table { width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 14px; }
  td { padding: 11px 0; border-bottom: 1px solid #eee; vertical-align: top; }
  td.lbl { color: #666; width: 40%; }
  td.val { text-align: right; font-weight: 600; }
  .disclaimer { margin-top: 32px; font-family: Arial, sans-serif; font-size: 11px; color: #888; line-height: 1.6; border-top: 1px solid #eee; padding-top: 16px; }
  @media print { body { margin: 24px; } }
</style></head>
<body>
  <div class="eyebrow">Custom Home Build</div>
  <h1>Your Estimated Cost Range</h1>
  <div class="meta">Prepared for ${escapeHtml(
    `${contact.firstName} ${contact.lastName}`.trim()
  )} &middot; ${escapeHtml(dateStr)}</div>

  <div class="range-box">
    <div class="cap">Estimated Cost Range</div>
    <div class="range">${escapeHtml(formatRange(estimate.low, estimate.high))}</div>
  </div>

  <table>${rows}</table>

  <div class="disclaimer">${escapeHtml(DISCLAIMER)}</div>
  <script>window.onload = function () { window.print(); };</script>
</body></html>`;

  const win = window.open('', '_blank');
  if (!win) {
    // Pop-up blocked — let the caller decide how to message this.
    throw new Error('Unable to open the print window. Please allow pop-ups.');
  }
  win.document.open();
  win.document.write(html);
  win.document.close();
}
