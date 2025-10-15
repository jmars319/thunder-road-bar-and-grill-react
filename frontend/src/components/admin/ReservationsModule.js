import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';

const API_BASE = 'http://localhost:5001/api';

function ReservationsModule() {
  const [reservations, setReservations] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = () => {
    fetch(`${API_BASE}/reservations`)
      .then(res => res.json())
      .then(data => setReservations(data));
  };

  const updateStatus = (id, status) => {
    fetch(`${API_BASE}/reservations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    }).then(() => fetchReservations());
  };

  // deleteReservation is intentionally omitted — use status updates to manage reservations

  const filteredReservations = filter === 'all' 
    ? reservations 
    : reservations.filter(r => r.status === filter);

  const getStatusColor = (status) => {
    switch(status) {
  case 'pending': return 'bg-warning text-text-inverse';
      case 'confirmed': return 'bg-success text-text-inverse';
      case 'cancelled': return 'bg-error text-text-inverse';
      case 'completed': return 'bg-surface text-text-inverse';
      default: return 'bg-surface text-text-inverse';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {['all', 'pending', 'confirmed', 'cancelled', 'completed'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium ${
              filter === status 
                ? 'bg-primary text-text-inverse' 
                : 'bg-surface text-text-inverse hover:bg-surface-warm'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      <div className="bg-surface rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-warm border-b border-divider">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-primary uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-primary uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-primary uppercase">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-primary uppercase">Guests</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-primary uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-primary uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredReservations.map(res => (
                <tr key={res.id} className="hover:bg-surface-warm">
                  <td className="px-6 py-4">
                    <div className="font-medium text-text-primary">{res.name}</div>
                      {res.special_requests && (
                        <div className="text-sm text-text-secondary mt-1">{res.special_requests}</div>
                      )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-text-secondary">{res.phone}</div>
                    {res.email && <div className="text-sm text-text-secondary">{res.email}</div>}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-text-secondary">{new Date(res.reservation_date).toLocaleDateString()}</div>
                    <div className="text-sm text-text-secondary">{res.reservation_time}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-secondary">{res.number_of_guests}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(res.status)}`}>
                      {res.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {res.status === 'pending' && (
                        <button
                          onClick={() => updateStatus(res.id, 'confirmed')}
                          className="text-success hover:bg-surface-warm p-2 rounded"
                          title="Confirm"
                        >
                          <CheckCircle size={18} />
                        </button>
                      )}
                      {res.status !== 'cancelled' && (
                        <button
                          onClick={() => updateStatus(res.id, 'cancelled')}
                          className="text-error hover:bg-surface-warm p-2 rounded"
                          title="Cancel"
                        >
                          <XCircle size={18} />
                        </button>
                      )}
                      {res.status === 'confirmed' && (
                        <button
                          onClick={() => updateStatus(res.id, 'completed')}
                          className="text-primary hover:bg-surface-warm p-2 rounded"
                          title="Mark Complete"
                        >
                          <Clock size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const Module = {
  component: ReservationsModule,
  name: 'Reservations',
  icon: Calendar
};

export default Module;
