import { useState, useEffect } from 'react';
import { Briefcase, Trash2 } from '../../icons';

// Developer notes:
// - Admin components use semantic Tailwind tokens (bg-surface, bg-surface-warm,
//   text-text-primary, text-text-secondary, text-error, etc.). Adjust colors
//   in `frontend/src/custom-styles.css` to change the site's token palette.
// - Icons are centralized in `src/icons` for easier refactors and consistent
//   import paths across the codebase.
// Keep module-scope references so linters don't complain about conditional usage.
void Briefcase; void Trash2;

/*
  JobsModule

  Purpose:
  - Admin interface for reviewing job applications. Allows status updates and deletion.

  API expectations:
  - GET    /api/jobs -> [ { id, name, email, position, submitted_at, status, ... }, ... ]
  - PUT    /api/jobs/:id { status }
  - DELETE /api/jobs/:id

  Developer notes:
  - Status-to-color mapping is defined in getStatusColor. If new statuses are added
    server-side, update the mapping here for consistent UI.
  - The component performs best-effort network calls and refetches after updates.
    For an improved UX consider optimistic updates or per-item loading states.
  Accessibility:
  - Interactive list items are rendered as buttons; ensure they have type="button"
    to avoid accidental form submissions. The applications list uses role="list"
    and each item uses role="listitem" for better screen reader semantics.
*/

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5001/api';

function JobsModule() {
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = () => {
    fetch(`${API_BASE}/jobs`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch applications');
        return res.json();
      })
      .then(data => setApplications(Array.isArray(data) ? data : []))
      .catch(() => setApplications([]));
  };

  const updateStatus = (id, status) => {
    fetch(`${API_BASE}/jobs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    }).then(res => {
      if (res.ok) fetchApplications();
      else fetchApplications();
    }).catch(() => fetchApplications());
  };

  const deleteApplication = (id) => {
    if (window.confirm('Delete this application?')) {
      fetch(`${API_BASE}/jobs/${id}`, { method: 'DELETE' })
        .then(() => {
          fetchApplications();
          setSelectedApp(null);
        }).catch(() => {});
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
          <h3 className="font-bold text-lg text-text-primary">Applications</h3>
        </div>
        <div className="divide-y max-h-[600px] overflow-y-auto" role="list" aria-label="Job applications list">
          {applications.map(app => (
            <button
              key={app.id}
              type="button"
              role="listitem"
              aria-label={`View application from ${app.name}`}
              aria-current={selectedApp?.id === app.id ? 'true' : undefined}
              onClick={() => setSelectedApp(app)}
              className={`w-full p-4 text-left hover:bg-surface-warm transition ${
                selectedApp?.id === app.id ? 'bg-surface-warm' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-text-primary">{app.name}</p>
                  <p className="text-sm text-text-secondary">{app.position}</p>
                  <p className="text-xs text-text-secondary mt-1">
                    {app.submitted_at ? new Date(app.submitted_at).toLocaleDateString() : ''}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(app.status)}`} aria-hidden>
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
                <h3 className="text-xl font-bold text-text-primary">{selectedApp.name}</h3>
                <p className="text-sm text-text-secondary mt-1">
                  Position: {selectedApp.position}
                </p>
                <p className="text-sm text-text-secondary">Email: {selectedApp.email}</p>
                {selectedApp.phone && <p className="text-sm text-text-secondary">Phone: {selectedApp.phone}</p>}
                <p className="text-xs text-text-secondary mt-2">
                  {selectedApp.submitted_at ? new Date(selectedApp.submitted_at).toLocaleString() : ''}
                </p>
              </div>
              <button
                type="button"
                onClick={() => deleteApplication(selectedApp.id)}
                className="text-error p-2 rounded hover:bg-surface-warm"
                aria-label={`Delete application from ${selectedApp.name}`}
              >
                <Trash2 size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Status</label>
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
                  <label className="block text-sm font-medium text-text-primary mb-2">Experience</label>
                  <p className="text-text-primary whitespace-pre-wrap p-3 bg-surface-warm rounded-lg">
                    {selectedApp.experience}
                  </p>
                </div>
              )}

              {selectedApp.cover_letter && (
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Cover Letter</label>
                  <p className="text-text-primary whitespace-pre-wrap p-3 bg-surface-warm rounded-lg">
                    {selectedApp.cover_letter}
                  </p>
                </div>
              )}

              {selectedApp.resume_url && (
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Resume</label>
                  <a
                      href={selectedApp.resume_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-text-primary hover:underline"
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
