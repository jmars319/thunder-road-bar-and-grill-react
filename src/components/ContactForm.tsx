import React, { useState } from 'react';

type Props = { endpoint?: string };

export default function ContactForm({ endpoint = '/.netlify/functions/submit' }: Props) {
  const [status, setStatus] = useState<'idle'|'sending'|'success'|'error'>('idle');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
  const fd = new FormData(e.currentTarget);
  const entries = Array.from((fd as any).entries());
  const payload = Object.fromEntries(entries as any);
    try {
      const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'contact', data: payload }) });
      const json = await res.json();
      if (res.ok && json.ok) {
        setStatus('success');
        e.currentTarget.reset();
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  }

  return (
    <form onSubmit={onSubmit} className="card">
      <input name="hp_field" style={{ position: 'absolute', left: -9999 }} tabIndex={-1} autoComplete="off" />
      <div className="grid grid-2">
        <input name="first_name" required className="form-input" placeholder="First name" />
        <input name="last_name" required className="form-input" placeholder="Last name" />
      </div>
      <div className="grid grid-2">
        <input name="email" type="email" required className="form-input" placeholder="Email" />
        <input name="phone" type="tel" className="form-input" placeholder="Phone" />
      </div>
      <textarea name="message" required className="form-input" placeholder="Message" />
      <div style={{ marginTop: '1rem' }}>
        <button type="submit" className="btn btn-primary">Send Message</button>
      </div>
      {status === 'sending' && <div className="form-message">Sending…</div>}
      {status === 'success' && <div className="form-success">Thanks — message sent.</div>}
      {status === 'error' && <div className="form-error">Submission failed</div>}
    </form>
  );
}
