import React, { useState } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

/*
  ReservationSection

  Purpose:
  - Provide a simple reservation form that posts to the backend API.

  Expected API:
  - POST /api/reservations with body {
      name, email, phone, reservation_date, reservation_time, number_of_guests, special_requests
    }

  Notes and validation guidance:
  - This component contains minimal client-side validation. For a production app
    you should validate required fields and the date/time values before submission.
  - The UI shows simple success and error banners. Consider replacing these with
    the app's Toast system for consistent UX.
*/

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5001/api';

export default function ReservationSection() {
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
    } catch (err) {
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
              <label className="block text-sm font-medium text-text-primary mb-2">Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="form-input w-full px-4 py-2 border border-border rounded-lg focus:outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Phone *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="form-input w-full px-4 py-2 border border-border rounded-lg focus:outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="form-input w-full px-4 py-2 border border-border rounded-lg focus:outline-none transition"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Date *</label>
              <input
                type="date"
                value={formData.reservation_date}
                onChange={(e) => setFormData({...formData, reservation_date: e.target.value})}
                className="form-input w-full px-4 py-2 border border-border rounded-lg focus:outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Time *</label>
              <input
                type="time"
                value={formData.reservation_time}
                onChange={(e) => setFormData({...formData, reservation_time: e.target.value})}
                className="form-input w-full px-4 py-2 border border-border rounded-lg focus:outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Number of Guests *</label>
            <input
              type="number"
              min="1"
              value={formData.number_of_guests}
              onChange={(e) => setFormData({...formData, number_of_guests: parseInt(e.target.value) || 1})}
              className="form-input w-full px-4 py-2 border border-border rounded-lg focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Special Requests</label>
            <textarea
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
      </div>
    </div>
  );
}
