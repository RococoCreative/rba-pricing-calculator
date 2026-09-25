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

// Same Adobe Fonts kit as index.html. If it can't load (domain not allowed,
// offline), the stacks fall back to Helvetica/Arial.
const BRAND_FONTS_CSS = 'https://use.typekit.net/nsv4wzr.css';
const BODY_FONT = "'helvetica-neue-lt-pro', 'Helvetica Neue', Arial, sans-serif";
const DISPLAY_FONT = "'proxima-nova', 'Helvetica Neue', Arial, sans-serif";

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
<link rel="stylesheet" href="${BRAND_FONTS_CSS}" />
<style>
  /* RBA brand, print edition: light page, brand dark ink, CTA-blue accent.
     Keep in sync with the tokens in src/index.css. */
  * { box-sizing: border-box; }
  body { font-family: ${BODY_FONT}; color: #1b1b1b; margin: 48px; }
  .eyebrow { letter-spacing: .2em; text-transform: uppercase; font-size: 11px; font-weight: 700; color: #1558c8; }
  h1 { font-family: ${DISPLAY_FONT}; font-weight: 700; font-size: 30px; margin: 6px 0 4px; }
  .meta { color: #5c5b58; font-size: 13px; margin-bottom: 28px; }
  .range-box { border: 1px solid #1c6ef4; border-top-width: 4px; background: #f3f7fe; border-radius: 8px; padding: 28px; text-align: center; margin-bottom: 32px; }
  .range-box .cap { font-size: 12px; letter-spacing: .15em; text-transform: uppercase; color: #5c5b58; }
  .range-box .range { font-family: ${DISPLAY_FONT}; font-size: 34px; font-weight: 700; color: #1b1b1b; margin-top: 8px; }
  table { width: 100%; border-collapse: collapse; font-size: 14px; }
  td { padding: 11px 0; border-bottom: 1px solid #e6e5e1; vertical-align: top; }
  td.lbl { color: #5c5b58; width: 40%; }
  td.val { text-align: right; font-weight: 700; }
  .disclaimer { margin-top: 32px; font-size: 11px; color: #6b6a66; line-height: 1.6; border-top: 1px solid #e6e5e1; padding-top: 16px; }
  @media print { body { margin: 24px; } .range-box { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
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
  <script>
    window.onload = function () {
      // Give the brand fonts a moment to arrive, but never hang the print.
      var go = function () { window.print(); };
      var fonts = document.fonts && document.fonts.ready;
      if (!fonts) return go();
      Promise.race([fonts, new Promise(function (r) { setTimeout(r, 1500); })]).then(go);
    };
  </script>
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
