// Netlify function to accept submissions (reservations, contact, applications)
// Persists to Airtable when AIRTABLE_API_KEY + AIRTABLE_BASE present, otherwise just sends email via SendGrid

const fetch = require('node-fetch');

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: JSON.stringify({ ok: false, error: 'Method not allowed' }) };
  let body = {};
  try { body = JSON.parse(event.body || '{}'); } catch (e) { return { statusCode: 400, body: JSON.stringify({ ok: false, error: 'Invalid JSON' }) }; }
  const { type, data } = body;
  if (!type || !data) return { statusCode: 400, body: JSON.stringify({ ok: false, error: 'Missing type or data' }) };

  // Basic rate-limiting could be added here (e.g., using a small KV store), but omitted for brevity.

  // Persist to Airtable if configured
  const AIRTABLE_KEY = process.env.AIRTABLE_API_KEY;
  const AIRTABLE_BASE = process.env.AIRTABLE_BASE_ID;
  const AIRTABLE_TABLE = process.env.AIRTABLE_TABLE || (type === 'reservation' ? 'Reservations' : 'Submissions');
  let saved = false;
  if (AIRTABLE_KEY && AIRTABLE_BASE) {
    try {
      const r = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE}/${encodeURIComponent(AIRTABLE_TABLE)}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${AIRTABLE_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields: data })
      });
      if (r.ok) saved = true;
    } catch (e) { console.error('Airtable save failed', e); }
  }

  // Send notification email via SendGrid if configured
  const SENDGRID_KEY = process.env.SENDGRID_API_KEY;
  const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL;
  if (SENDGRID_KEY && NOTIFY_EMAIL) {
    try {
      const msg = {
        personalizations: [{ to: [{ email: NOTIFY_EMAIL }] }],
        from: { email: process.env.SEND_FROM_EMAIL || NOTIFY_EMAIL },
        subject: `[Website] New ${type}`,
        content: [{ type: 'text/plain', value: JSON.stringify(data, null, 2) }]
      };
      await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${SENDGRID_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(msg)
      });
    } catch (e) { console.error('SendGrid send failed', e); }
  }

  return { statusCode: 200, body: JSON.stringify({ ok: true, saved }) };
};
