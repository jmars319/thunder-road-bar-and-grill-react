import React, { useState, useEffect } from 'react';
import { Settings, Save } from 'lucide-react';

const API_BASE = 'http://localhost:5001/api';

function SettingsModule() {
  const [siteSettings, setSiteSettings] = useState({});
  const [aboutContent, setAboutContent] = useState({});
  const [businessHours, setBusinessHours] = useState([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/site-settings`).then(r => r.json()).then(data => setSiteSettings(data));
    fetch(`${API_BASE}/about`).then(r => r.json()).then(data => setAboutContent(data));
    fetch(`${API_BASE}/business-hours`).then(r => r.json()).then(data => setBusinessHours(data));
  }, []);

  const saveSiteSettings = () => {
    fetch(`${API_BASE}/site-settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(siteSettings)
    }).then(() => {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  };

  const saveAboutContent = () => {
    fetch(`${API_BASE}/about`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(aboutContent)
    }).then(() => {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  };

  const saveBusinessHours = (id, data) => {
    fetch(`${API_BASE}/business-hours/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(() => {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  };

  return (
    <div className="space-y-6">
      {saved && (
    <div className="bg-success text-text-inverse px-4 py-3 rounded-lg flex items-center gap-2">
          <Save size={18} />
          Settings saved successfully!
        </div>
      )}

      {/* Site Settings */}
      <div className="bg-surface rounded-lg shadow p-6">
  <h3 className="text-xl font-bold mb-4 text-text-primary">Site Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Business Name</label>
            <input
              type="text"
              value={siteSettings.business_name || ''}
              onChange={(e) => setSiteSettings({...siteSettings, business_name: e.target.value})}
              className="w-full form-input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Tagline</label>
            <input
              type="text"
              value={siteSettings.tagline || ''}
              onChange={(e) => setSiteSettings({...siteSettings, tagline: e.target.value})}
              className="w-full form-input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Phone</label>
            <input
              type="text"
              value={siteSettings.phone || ''}
              onChange={(e) => setSiteSettings({...siteSettings, phone: e.target.value})}
              className="w-full form-input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Email</label>
            <input
              type="email"
              value={siteSettings.email || ''}
              onChange={(e) => setSiteSettings({...siteSettings, email: e.target.value})}
              className="w-full form-input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Address</label>
            <textarea
              value={siteSettings.address || ''}
              onChange={(e) => setSiteSettings({...siteSettings, address: e.target.value})}
              className="w-full form-input"
              rows="2"
            />
          </div>
          <button
            onClick={saveSiteSettings}
            className="bg-primary text-text-inverse px-4 py-2 rounded-lg hover:bg-primary-dark flex items-center gap-2"
          >
            <Save size={18} />
            Save Site Settings
          </button>
        </div>
      </div>

      {/* About Content */}
      <div className="bg-surface rounded-lg shadow p-6">
  <h3 className="text-xl font-bold mb-4 text-text-primary">About Section</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Header</label>
            <input
              type="text"
              value={aboutContent.header || ''}
              onChange={(e) => setAboutContent({...aboutContent, header: e.target.value})}
              className="w-full form-input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Paragraph</label>
            <textarea
              value={aboutContent.paragraph || ''}
              onChange={(e) => setAboutContent({...aboutContent, paragraph: e.target.value})}
              className="w-full form-input"
              rows="4"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Map Embed URL</label>
            <input
              type="text"
              value={aboutContent.map_embed_url || ''}
              onChange={(e) => setAboutContent({...aboutContent, map_embed_url: e.target.value})}
              className="w-full form-input"
              placeholder="Google Maps embed URL"
            />
          </div>
          <button
            onClick={saveAboutContent}
            className="bg-primary text-text-inverse px-4 py-2 rounded-lg hover:bg-primary-dark flex items-center gap-2"
          >
            <Save size={18} />
            Save About Content
          </button>
        </div>
      </div>

      {/* Business Hours */}
      <div className="bg-surface rounded-lg shadow p-6">
  <h3 className="text-xl font-bold mb-4 text-text-primary">Business Hours</h3>
        <div className="space-y-3">
          {businessHours.map(day => (
            <div key={day.id} className="flex items-center gap-4">
              <div className="w-32 font-medium text-text-primary">{day.day_of_week}</div>
              <input
                type="time"
                value={day.opening_time || ''}
                onChange={(e) => {
                  const updated = businessHours.map(d => 
                    d.id === day.id ? {...d, opening_time: e.target.value} : d
                  );
                  setBusinessHours(updated);
                }}
                disabled={day.is_closed}
                className="form-input"
              />
              <span className="text-text-secondary">to</span>
              <input
                type="time"
                value={day.closing_time || ''}
                onChange={(e) => {
                  const updated = businessHours.map(d => 
                    d.id === day.id ? {...d, closing_time: e.target.value} : d
                  );
                  setBusinessHours(updated);
                }}
                disabled={day.is_closed}
                className="form-input"
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={day.is_closed}
                  onChange={(e) => {
                    const updated = businessHours.map(d => 
                      d.id === day.id ? {...d, is_closed: e.target.checked} : d
                    );
                    setBusinessHours(updated);
                  }}
                />
                <span className="text-sm text-text-secondary">Closed</span>
              </label>
              <button
                onClick={() => saveBusinessHours(day.id, day)}
                className="bg-primary text-text-inverse px-3 py-2 rounded-lg hover:bg-primary-dark text-sm"
              >
                Save
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const Module = {
  component: SettingsModule,
  name: 'Settings',
  icon: Settings
};

export default Module;
