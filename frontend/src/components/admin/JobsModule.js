import React, { useState, useEffect } from 'react';
import { Briefcase, Trash2 } from 'lucide-react';

const API_BASE = 'http://localhost:5001/api';

function JobsModule() {
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = () => {
    fetch(`${API_BASE}/jobs`)
      .then(res => res.json())
      .then(data => setApplications(data));
  };

  const updateStatus = (id, status) => {
    fetch(`${API_BASE}/jobs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    }).then(() => fetchApplications());
  };

  const deleteApplication = (id) => {
    if (window.confirm('Delete this application?')) {
      fetch(`${API_BASE}/jobs/${id}`, { method: 'DELETE' })
        .then(() => {
          fetchApplications();
          setSelectedApp(null);
        });
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
  case 'new': return 'bg-surface text-text-inverse';
  case 'reviewing': return 'bg-warning text-text-inverse';
      case 'interviewed': return 'bg-accent text-text-inverse';
      case 'hired': return 'bg-success text-text-inverse';
      case 'rejected': return 'bg-error text-text-inverse';
  default: return 'bg-surface text-text-inverse';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-surface rounded-lg shadow">
        <div className="p-4 border-b">
          <h3 className="font-bold text-lg text-text-inverse">Applications</h3>
        </div>
        <div className="divide-y max-h-[600px] overflow-y-auto">
          {applications.map(app => (
            <button
              key={app.id}
              onClick={() => setSelectedApp(app)}
              className={`w-full p-4 text-left hover:bg-surface-warm transition ${
                selectedApp?.id === app.id ? 'bg-surface-warm' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-text-inverse">{app.name}</p>
                  <p className="text-sm text-text-inverse">{app.position}</p>
                  <p className="text-xs text-text-inverse mt-1">
                    {new Date(app.submitted_at).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(app.status)}`}>
                  {app.status}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-surface rounded-lg shadow">
        {selectedApp ? (
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-text-inverse">{selectedApp.name}</h3>
                <p className="text-sm text-text-inverse mt-1">
                  Position: {selectedApp.position}
                </p>
                <p className="text-sm text-text-inverse">Email: {selectedApp.email}</p>
                {selectedApp.phone && <p className="text-sm text-text-inverse">Phone: {selectedApp.phone}</p>}
                <p className="text-xs text-text-inverse mt-2">
                  {new Date(selectedApp.submitted_at).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => deleteApplication(selectedApp.id)}
                className="text-error p-2 rounded hover:bg-surface-warm"
              >
                <Trash2 size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-inverse mb-2">Status</label>
                <select
                  value={selectedApp.status}
                  onChange={(e) => updateStatus(selectedApp.id, e.target.value)}
                  className="w-full form-input"
                >
                  <option value="new">New</option>
                  <option value="reviewing">Reviewing</option>
                  <option value="interviewed">Interviewed</option>
                  <option value="hired">Hired</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              {selectedApp.experience && (
                <div>
                  <label className="block text-sm font-medium text-text-inverse mb-2">Experience</label>
                  <p className="text-text-inverse whitespace-pre-wrap p-3 bg-surface-warm rounded-lg">
                    {selectedApp.experience}
                  </p>
                </div>
              )}

              {selectedApp.cover_letter && (
                <div>
                  <label className="block text-sm font-medium text-text-inverse mb-2">Cover Letter</label>
                  <p className="text-text-inverse whitespace-pre-wrap p-3 bg-surface-warm rounded-lg">
                    {selectedApp.cover_letter}
                  </p>
                </div>
              )}

              {selectedApp.resume_url && (
                <div>
                  <label className="block text-sm font-medium text-text-inverse mb-2">Resume</label>
                  <a
                    href={selectedApp.resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    View Resume
                  </a>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full p-12 text-center text-text-inverse">
            <div>
              <Briefcase size={48} className="mx-auto mb-4" />
              <p>Select an application to view details</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const Module = {
  component: JobsModule,
  name: 'Jobs',
  icon: Briefcase
};

export default Module;
