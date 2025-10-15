import { useState, useEffect } from 'react';
import { icons } from '../../icons';

/*
  MediaModule

  Purpose:
  - Simple media manager for uploading images and copying/deleting existing media.

  API expectations:
  - GET  /api/media -> [ { id, title, file_name, file_url, file_type }, ... ]
  - POST /api/media/upload (multipart/form-data)
  - DELETE /api/media/:id

  Developer notes:
  - Uploads use a FormData multipart POST. The backend should return the new media
    list through GET /api/media; this component re-fetches after a successful upload.
  - Copying a URL uses the Clipboard API; it may be unavailable in insecure contexts.
    The code uses try/catch around navigator.clipboard to avoid runtime errors.
  - Consider returning the created media item from the upload endpoint to avoid
    a full re-fetch if performance becomes a concern.
  Accessibility:
  - The upload control uses a hidden file input — ensure label content clearly
    describes the action. Action buttons include explicit type="button" and
    accessible labels.
*/

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5001/api';

function MediaModule() {
  const [media, setMedia] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [sections, setSections] = useState({ logos: true, hero: true, gallery: true, all: false });
  const [siteSettings, setSiteSettings] = useState(null);
  const [selectedHeroIds, setSelectedHeroIds] = useState([]);

  useEffect(() => {
    fetchMedia();
    fetch(`${API_BASE}/site-settings`).then(r => r.ok ? r.json() : {}).then(s => {
      setSiteSettings(s || {});
      if (Array.isArray(s?.hero_images)) setSelectedHeroIds(s.hero_images.map(h => h.id).filter(Boolean));
    }).catch(() => {});
  }, []);

  const fetchMedia = () => {
    fetch(`${API_BASE}/media`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch media');
        return res.json();
      })
  .then(data => setMedia(Array.isArray(data) ? data : []))
  .catch(() => setMedia([]));
  };
  // generic upload used by section-specific handlers. category string is optional.
  const handleUpload = async (file, category = 'general') => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', file.name);
    formData.append('category', category);

    try {
      await fetch(`${API_BASE}/media/upload`, {
        method: 'POST',
        body: formData
      });
      await fetchMedia();
    } catch (err) {
      console.error('upload failed', err);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  // helper that returns an onChange handler bound to a category
  const makeUploadHandler = (category) => async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await handleUpload(file, category);
  };

  const toggleHeroSelection = (id) => {
    setSelectedHeroIds(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  };

  const saveHeroImages = async () => {
    // build hero_images array from selected ids
    const items = media.filter(m => selectedHeroIds.includes(m.id)).map(m => ({ id: m.id, file_url: m.file_url, title: m.title }));
    const payload = { ...(siteSettings || {}), hero_images: items };
    try {
      const res = await fetch(`${API_BASE}/site-settings`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error('Failed to save');
      const data = await res.json();
      // refresh settings
      setSiteSettings(payload);
      alert('Hero images saved');
    } catch (err) {
      alert('Failed to save hero images');
    }
  };

  const deleteMedia = (id) => {
    if (window.confirm('Delete this media file?')) {
      fetch(`${API_BASE}/media/${id}`, { method: 'DELETE' })
        .then(() => fetchMedia()).catch(() => {});
    }
  };

  const copyUrl = (url) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(`http://localhost:5001${url}`);
        setCopiedId(url);
        setTimeout(() => setCopiedId(null), 2000);
      } else {
        // Fallback: create a temporary textarea (rare, but more robust)
        const ta = document.createElement('textarea');
        ta.value = `http://localhost:5001${url}`;
        document.body.appendChild(ta);
        ta.select();
        try {
          document.execCommand('copy');
          setCopiedId(url);
          setTimeout(() => setCopiedId(null), 2000);
        } catch {
          // ignore
        }
        document.body.removeChild(ta);
      }
  } catch {
      // Clipboard API may be unavailable; silently ignore for now.
    }
  };

  return (
    <div className="space-y-6">
      {/* Section: Logos */}
      <div className="bg-surface rounded-lg shadow">
        <button type="button" className="w-full flex items-center justify-between p-4" onClick={() => setSections(s => ({ ...s, logos: !s.logos }))} aria-expanded={sections.logos}>
          <div className="flex items-center gap-3">
            <icons.Image size={20} />
            <h3 className="text-lg font-medium">Logos</h3>
          </div>
          <div>{sections.logos ? <icons.ChevronUp /> : <icons.ChevronDown />}</div>
        </button>
        {sections.logos && (
          <div className="p-4 border-t border-divider">
            <label className="flex items-center gap-4">
              <span className="text-sm text-text-secondary">Upload logo</span>
              <input type="file" className="hidden" accept="image/*" onChange={makeUploadHandler('logo')} disabled={uploading} />
              <label className={`px-3 py-2 rounded cursor-pointer text-sm ${uploading ? 'opacity-60 pointer-events-none' : 'bg-surface'}`}>
                <input type="file" accept="image/*" className="hidden" onChange={makeUploadHandler('logo')} />
                {uploading ? 'Uploading…' : 'Choose file'}
              </label>
            </label>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
              {media.filter(m => m.category === 'logo').map(item => (
                <div key={item.id} className="bg-surface rounded overflow-hidden">
                  <img src={`${API_BASE.replace(/\/api$/, '')}${item.file_url}`} alt={item.title} className="w-full h-24 object-cover" />
                  <div className="p-2 text-xs flex justify-between items-center">
                    <span className="truncate">{item.title}</span>
                    <div className="flex gap-2">
                      <button onClick={() => copyUrl(item.file_url)} className="text-xs">Copy</button>
                      <button onClick={() => deleteMedia(item.id)} className="text-xs text-error">Del</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Section: Hero */}
      <div className="bg-surface rounded-lg shadow">
        <button type="button" className="w-full flex items-center justify-between p-4" onClick={() => setSections(s => ({ ...s, hero: !s.hero }))} aria-expanded={sections.hero}>
          <div className="flex items-center gap-3">
            <icons.Image size={20} />
            <h3 className="text-lg font-medium">Hero</h3>
          </div>
          <div>{sections.hero ? <icons.ChevronUp /> : <icons.ChevronDown />}</div>
        </button>
        {sections.hero && (
          <div className="p-4 border-t border-divider">
            <p className="text-sm text-text-secondary mb-2">Upload large hero images</p>
            <label className={`px-3 py-2 rounded cursor-pointer text-sm ${uploading ? 'opacity-60 pointer-events-none' : 'bg-surface'}`}>
              <input type="file" accept="image/*" className="hidden" onChange={makeUploadHandler('hero')} />
              {uploading ? 'Uploading…' : 'Choose file'}
            </label>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
              {media.filter(m => m.category === 'hero').map(item => (
                <div key={item.id} className="bg-surface rounded overflow-hidden relative">
                  <img src={`${API_BASE.replace(/\/api$/, '')}${item.file_url}`} alt={item.title} className="w-full h-24 object-cover" />
                  <label className="absolute top-2 left-2 bg-white/80 rounded p-1 text-xs">
                    <input type="checkbox" checked={selectedHeroIds.includes(item.id)} onChange={() => toggleHeroSelection(item.id)} />
                  </label>
                  <div className="p-2 text-xs flex justify-between items-center">
                    <span className="truncate">{item.title}</span>
                    <div className="flex gap-2">
                      <button onClick={() => copyUrl(item.file_url)} className="text-xs">Copy</button>
                      <button onClick={() => deleteMedia(item.id)} className="text-xs text-error">Del</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex justify-end">
              <button type="button" onClick={saveHeroImages} className="bg-primary text-text-inverse px-3 py-2 rounded">Save hero images</button>
            </div>
          </div>
        )}
      </div>

      {/* Section: Gallery */}
      <div className="bg-surface rounded-lg shadow">
        <button type="button" className="w-full flex items-center justify-between p-4" onClick={() => setSections(s => ({ ...s, gallery: !s.gallery }))} aria-expanded={sections.gallery}>
          <div className="flex items-center gap-3">
            <icons.Image size={20} />
            <h3 className="text-lg font-medium">Gallery</h3>
          </div>
          <div>{sections.gallery ? <icons.ChevronUp /> : <icons.ChevronDown />}</div>
        </button>
        {sections.gallery && (
          <div className="p-4 border-t border-divider">
            <p className="text-sm text-text-secondary mb-2">Upload gallery images</p>
            <label className={`px-3 py-2 rounded cursor-pointer text-sm ${uploading ? 'opacity-60 pointer-events-none' : 'bg-surface'}`}>
              <input type="file" accept="image/*" className="hidden" onChange={makeUploadHandler('gallery')} />
              {uploading ? 'Uploading…' : 'Choose file'}
            </label>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
              {media.filter(m => m.category === 'gallery').map(item => (
                <div key={item.id} className="bg-surface rounded overflow-hidden">
                  <img src={`${API_BASE.replace(/\/api$/, '')}${item.file_url}`} alt={item.title} className="w-full h-24 object-cover" />
                  <div className="p-2 text-xs flex justify-between items-center">
                    <span className="truncate">{item.title}</span>
                    <div className="flex gap-2">
                      <button onClick={() => copyUrl(item.file_url)} className="text-xs">Copy</button>
                      <button onClick={() => deleteMedia(item.id)} className="text-xs text-error">Del</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Section: All uploads (optional) */}
      <div className="bg-surface rounded-lg shadow">
        <button type="button" className="w-full flex items-center justify-between p-4" onClick={() => setSections(s => ({ ...s, all: !s.all }))} aria-expanded={sections.all}>
          <div className="flex items-center gap-3">
            <icons.Folder size={20} />
            <h3 className="text-lg font-medium">All uploads</h3>
          </div>
          <div>{sections.all ? <icons.ChevronUp /> : <icons.ChevronDown />}</div>
        </button>
        {sections.all && (
          <div className="p-4 border-t border-divider">
            <p className="text-sm text-text-secondary mb-2">All uploaded media (latest first)</p>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {media.slice().reverse().map(item => (
                <div key={item.id} className="bg-surface rounded-lg shadow overflow-hidden card-hover">
                  <div className="aspect-square bg-surface-warm flex items-center justify-center">
                    {item.file_type?.startsWith('image/') ? (
                      <img
                        src={`${API_BASE.replace(/\/api$/, '')}${item.file_url}`}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <icons.Image size={48} className="text-primary" />
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium text-text-primary truncate">{item.title}</p>
                    <p className="text-xs text-text-secondary truncate">{item.file_name}</p>
                    <div className="flex gap-2 mt-3">
                      <button
                        type="button"
                        onClick={() => copyUrl(item.file_url)}
                        className="flex-1 bg-surface-warm text-text-primary py-1 px-2 rounded text-xs hover:bg-surface transition flex items-center justify-center gap-1"
                        aria-label={`Copy URL for ${item.title}`}
                      >
                        {copiedId === item.file_url ? (
                          <>
                            <icons.CheckCircle size={12} />
                            Copied
                          </>
                        ) : (
                          <>
                            <icons.Copy size={12} />
                            Copy URL
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteMedia(item.id)}
                        className="bg-surface-warm text-error py-1 px-2 rounded text-xs hover:bg-surface transition"
                        aria-label={`Delete media ${item.title}`}
                      >
                        <icons.Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const Module = {
  component: MediaModule,
  name: 'Media',
  icon: icons.Image
};

export default Module;
