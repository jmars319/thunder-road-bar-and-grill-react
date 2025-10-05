import React, { useState } from 'react';

type Props = { endpoint?: string };

export default function ReservationForm({ endpoint = '/.netlify/functions/submit' }: Props) {
  const [status, setStatus] = useState<'idle'|'sending'|'success'|'error'>('idle');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
  const fd = new FormData(e.currentTarget);
  const payload: Record<string, any> = Object.fromEntries((fd as any).entries());
    try {
      const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'reservation', data: payload }) });
      const json = await res.json();
      if (res.ok && json.ok) {
        setStatus('success');
        // emulate legacy behavior by updating hash so existing scripts show confirmation
        window.location.hash = `success=1&guests=${payload.guests || ''}`;
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  }

  return (
    <form id="reservation-form" onSubmit={onSubmit} className="card">
      <div className="grid grid-2">
        <div>
          <label className="form-label">Name *</label>
          <input name="name" required className="form-input" />
        </div>
        <div>
          <label className="form-label">Phone *</label>
          <input name="phone" required className="form-input" />
        </div>
      </div>
      <div className="grid grid-2">
        <div>
          <label className="form-label">Date *</label>
          <input name="date" type="date" required className="form-input" />
        </div>
        <div>
          <label className="form-label">Time *</label>
          <input name="time" type="time" required className="form-input" />
        </div>
      </div>
      <div>
        <label className="form-label">Event type (optional)</label>
        <input name="event_type" className="form-input" />
      </div>
      <div>
        <label className="form-label">Number of Guests *</label>
        <input name="guests" type="number" min={1} defaultValue={1} required className="form-input" />
      </div>
      <div style={{ marginTop: '1rem' }}>
        <button type="submit" className="btn btn-primary">Request Reservation</button>
      </div>
      {status === 'sending' && <div className="form-message">Sending…</div>}
      {status === 'success' && <div className="form-success">Reservation request sent</div>}
      {status === 'error' && <div className="form-error">Submission failed</div>}
    </form>
  );
}
