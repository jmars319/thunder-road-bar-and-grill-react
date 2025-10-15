import React, { useState, useEffect } from 'react';
import { Image, Upload, Trash2, Copy, CheckCircle } from 'lucide-react';

const API_BASE = 'http://localhost:5001/api';

function MediaModule() {
  const [media, setMedia] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = () => {
    fetch(`${API_BASE}/media`)
      .then(res => res.json())
      .then(data => setMedia(data));
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
    } catch (err) {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const deleteMedia = (id) => {
    if (window.confirm('Delete this media file?')) {
      fetch(`${API_BASE}/media/${id}`, { method: 'DELETE' })
        .then(() => fetchMedia());
    }
  };

  const copyUrl = (url) => {
    navigator.clipboard.writeText(`http://localhost:5001${url}`);
    setCopiedId(url);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-surface rounded-lg shadow p-6">
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-divider rounded-lg cursor-pointer hover:bg-surface-warm">
          <div className="flex flex-col items-center">
            <Upload size={32} className="text-primary mb-2" />
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
                  src={`http://localhost:5001${item.file_url}`}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Image size={48} className="text-primary" />
              )}
            </div>
            <div className="p-3">
              <p className="text-sm font-medium text-text-primary truncate">{item.title}</p>
              <p className="text-xs text-text-secondary truncate">{item.file_name}</p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => copyUrl(item.file_url)}
                  className="flex-1 bg-surface-warm text-primary py-1 px-2 rounded text-xs hover:bg-surface transition flex items-center justify-center gap-1"
                >
                  {copiedId === item.file_url ? (
                    <>
                      <CheckCircle size={12} />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      Copy URL
                    </>
                  )}
                </button>
                <button
                  onClick={() => deleteMedia(item.id)}
                  className="bg-surface-warm text-error py-1 px-2 rounded text-xs hover:bg-surface transition"
                >
                  <Trash2 size={12} />
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
  icon: Image
};

export default Module;
