import React, { useState, useEffect } from 'react';
import { Mail, Trash2, Download } from 'lucide-react';

const API_BASE = 'http://localhost:5001/api';

function NewsletterModule() {
  const [subscribers, setSubscribers] = useState([]);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = () => {
    fetch(`${API_BASE}/newsletter/subscribers`)
      .then(res => res.json())
      .then(data => setSubscribers(data));
  };

  const deleteSubscriber = (id) => {
    if (window.confirm('Delete this subscriber?')) {
      fetch(`${API_BASE}/newsletter/subscribers/${id}`, { method: 'DELETE' })
        .then(() => fetchSubscribers());
    }
  };

  const exportSubscribers = () => {
    const csv = [
      ['Email', 'Name', 'Subscribed Date', 'Status'].join(','),
      ...subscribers.map(sub => [
        sub.email,
        sub.name || '',
        new Date(sub.subscribed_at).toLocaleDateString(),
        sub.is_active ? 'Active' : 'Inactive'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'newsletter-subscribers.csv';
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-text-inverse">Newsletter Subscribers</h3>
          <p className="text-sm text-text-inverse">
            {subscribers.filter(s => s.is_active).length} active subscribers
          </p>
        </div>
        <button
          onClick={exportSubscribers}
          className="bg-primary text-text-inverse px-4 py-2 rounded-lg hover:bg-primary-dark flex items-center gap-2"
        >
          <Download size={18} />
          Export CSV
        </button>
      </div>

      <div className="bg-surface rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-warm border-b border-divider">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-inverse uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-inverse uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-inverse uppercase">Subscribed</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-inverse uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-inverse uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {subscribers.map(sub => (
                <tr key={sub.id} className="hover:bg-surface-warm">
                  <td className="px-6 py-4 text-sm text-text-inverse">{sub.email}</td>
                  <td className="px-6 py-4 text-sm text-text-inverse">{sub.name || '-'}</td>
                  <td className="px-6 py-4 text-sm text-text-inverse">
                    {new Date(sub.subscribed_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      sub.is_active 
                        ? 'bg-success text-text-inverse' 
                        : 'bg-surface text-text-inverse'
                    }`}>
                      {sub.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => deleteSubscriber(sub.id)}
                      className="text-error hover:bg-surface-warm p-2 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
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
  component: NewsletterModule,
  name: 'Newsletter',
  icon: Mail
};

export default Module;
