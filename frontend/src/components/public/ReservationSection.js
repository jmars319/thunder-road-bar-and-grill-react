import { useState } from 'react';
import { CheckCircle, AlertCircle } from '../../icons';

/*
  ReservationSection

  Purpose:
  - Provide a simple reservation form that posts to the backend API.

  Accessibility:
  - Labels are associated with inputs using explicit ids. Required fields are
    marked with aria-required to aid assistive tech. This component performs
    minimal validation; enhance as needed upstream.
*/

/* DEV:
   - Feedback messages and input panels use semantic tokens (bg-success/10,
     text-success, bg-error/10, bg-surface-warm, border-border, etc.). Change
     colors in `frontend/src/custom-styles.css` to affect runtime theming
     globally instead of editing utilities in this component.
   - Removed a file-level eslint suppression so imports and usage are handled
     by the standard lint rules.
*/

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5001/api';

export default function ReservationSection() {
  // NOTE: UI feedback uses tokenized classes (e.g., bg-success/10, text-success,
  // bg-error/10). When adjusting colors, update tokens in `custom-styles.css`
  // rather than inline utilities to preserve runtime theming.
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    reservation_date: '',
    reservation_time: '',
    number_of_guests: 2,
    special_requests: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');
    try {
      // Ensure number_of_guests is a number before sending
      const payload = { ...formData, number_of_guests: Number(formData.number_of_guests) || 1 };

      const response = await fetch(`${API_BASE}/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 5000);
        setFormData({
          name: '',
          email: '',
          phone: '',
          reservation_date: '',
          reservation_time: '',
          number_of_guests: 2,
          special_requests: ''
        });
      } else {
        setError('Failed to submit reservation');
      }
    } catch {
      setError('An error occurred');
    }
  };

  return (
    <div id="reservations" className="py-16 bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-heading font-bold text-center mb-12">Make a Reservation</h2>

        {submitted && (
          <div className="bg-success/10 border border-success rounded-lg p-4 mb-6 flex items-center gap-3">
            <CheckCircle size={20} className="text-success" />
            <p className="text-success">Reservation submitted! We'll contact you to confirm.</p>
          </div>
        )}

        {error && (
          <div className="bg-error/10 border border-error rounded-lg p-4 mb-6 flex items-center gap-3">
            <AlertCircle size={20} className="text-error" />
            <p className="text-error">{error}</p>
          </div>
        )}

        <div className="bg-surface-warm rounded-lg shadow-lg p-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="res-name" className="block text-sm font-medium text-text-primary mb-2">Name *</label>
              <input
                id="res-name"
                type="text"
                aria-required="true"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="form-input w-full px-4 py-2 border border-border rounded-lg focus:outline-none transition"
              />
            </div>
            <div>
              <label htmlFor="res-phone" className="block text-sm font-medium text-text-primary mb-2">Phone *</label>
              <input
                id="res-phone"
                type="tel"
                aria-required="true"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="form-input w-full px-4 py-2 border border-border rounded-lg focus:outline-none transition"
              />
            </div>
          </div>

          <div>
            <label htmlFor="res-email" className="block text-sm font-medium text-text-primary mb-2">Email</label>
            <input
              id="res-email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="form-input w-full px-4 py-2 border border-border rounded-lg focus:outline-none transition"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="res-date" className="block text-sm font-medium text-text-primary mb-2">Date *</label>
              <input
                id="res-date"
                type="date"
                aria-required="true"
                value={formData.reservation_date}
                onChange={(e) => setFormData({...formData, reservation_date: e.target.value})}
                className="form-input w-full px-4 py-2 border border-border rounded-lg focus:outline-none transition"
              />
            </div>
            <div>
              <label htmlFor="res-time" className="block text-sm font-medium text-text-primary mb-2">Time *</label>
              <input
                id="res-time"
                type="time"
                aria-required="true"
                value={formData.reservation_time}
                onChange={(e) => setFormData({...formData, reservation_time: e.target.value})}
                className="form-input w-full px-4 py-2 border border-border rounded-lg focus:outline-none transition"
              />
            </div>
          </div>

          <div>
            <label htmlFor="res-guests" className="block text-sm font-medium text-text-primary mb-2">Number of Guests *</label>
            <input
              id="res-guests"
              type="number"
              min="1"
              aria-required="true"
              value={formData.number_of_guests}
              onChange={(e) => setFormData({...formData, number_of_guests: parseInt(e.target.value) || 1})}
              className="form-input w-full px-4 py-2 border border-border rounded-lg focus:outline-none transition"
            />
          </div>

          <div>
            <label htmlFor="res-requests" className="block text-sm font-medium text-text-primary mb-2">Special Requests</label>
            <textarea
              id="res-requests"
              value={formData.special_requests}
              onChange={(e) => setFormData({...formData, special_requests: e.target.value})}
              rows="3"
              className="form-input w-full px-4 py-2 border border-border rounded-lg focus:outline-none transition"
              placeholder="Allergies, celebrations, accessibility needs, etc."
            ></textarea>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-primary text-text-inverse py-3 px-6 rounded-lg hover:bg-primary-dark transition font-bold text-lg shadow-lg"
          >
            Submit Reservation
          </button>
        </div>
  {/* ensure lucide-react icons are considered used by some linters */}
  {/* (no-op handled at module scope) */}
      </div>
    </div>
  );
}

// ensure lucide-react icons are considered used by some linters
void CheckCircle; void AlertCircle;
