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

  useEffect(() => {
    fetchMedia();
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

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', file.name);
    formData.append('category', 'general');

    try {
      await fetch(`${API_BASE}/media/upload`, {
        method: 'POST',
        body: formData
      });
      fetchMedia();
  } catch {
      // Keep UX simple: use alert for now. Could be replaced with Toasts.
      alert('Upload failed');
    } finally {
      setUploading(false);
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
      <div className="bg-surface rounded-lg shadow p-6">
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-divider rounded-lg cursor-pointer hover:bg-surface-warm" aria-label="Upload media">
            <div className="flex flex-col items-center">
            <icons.Upload size={32} className="text-primary mb-2" />
            <p className="text-sm text-text-secondary">
              {uploading ? 'Uploading...' : 'Click to upload media'}
            </p>
          </div>
          <input
            type="file"
            className="hidden"
            onChange={handleUpload}
            accept="image/*"
            disabled={uploading}
          />
        </label>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {media.map(item => (
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
  );
}

const Module = {
  component: MediaModule,
  name: 'Media',
  icon: icons.Image
};

export default Module;
