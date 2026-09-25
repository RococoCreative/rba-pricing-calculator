/* ============================================================================
 *  LEAD RELAY  (Vercel serverless function, served at /api/lead)
 * ----------------------------------------------------------------------------
 *  The calculator POSTs the lead here (same origin, so no CORS issues), and
 *  this function forwards it server-side to the CRM webhook in GHL_WEBHOOK_URL
 *  (a GoHighLevel workflow "Inbound Webhook" trigger URL).
 *
 *  Keeping the webhook URL server-side also means it never ships in the
 *  public JS bundle.
 * ========================================================================== */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const target = process.env.GHL_WEBHOOK_URL;
  if (!target) {
    console.error('GHL_WEBHOOK_URL is not set.');
    return res.status(500).json({ error: 'Lead destination is not configured.' });
  }

  let lead = req.body;
  if (typeof lead === 'string') {
    try {
      lead = JSON.parse(lead);
    } catch {
      return res.status(400).json({ error: 'Invalid JSON.' });
    }
  }

  // Minimal sanity check: the CRM needs an email to create the contact.
  if (!lead || typeof lead.email !== 'string' || !lead.email.includes('@')) {
    return res.status(400).json({ error: 'A valid email is required.' });
  }

  try {
    const upstream = await fetch(target, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
    });
    if (!upstream.ok) {
      console.error(`CRM webhook responded with status ${upstream.status}`);
      return res.status(502).json({ error: 'CRM webhook rejected the lead.' });
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('CRM webhook request failed:', err);
    return res.status(502).json({ error: 'Could not reach the CRM webhook.' });
  }
}
