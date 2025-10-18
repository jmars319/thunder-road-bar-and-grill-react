import { useState, useEffect, useRef } from 'react';
import { icons } from '../../icons';
import Toast from '../ui/Toast';
import usePaginatedResource from '../../hooks/usePaginatedResource';
import Spinner from '../ui/Spinner';
// ensure imports are recognized by some linters when used only in JSX
const __usedSpinner = Spinner;
void __usedSpinner;

/* DEV:
   - Admin menu editor uses semantic tokens (bg-primary, bg-surface-warm,
     text-text-primary, text-primary, border-divider). Update
     `frontend/src/custom-styles.css` to adjust colors across the admin UI.
   - Removed the per-file eslint suppression so imports and usages are
     handled by the standard lint rules.
*/

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5001/api';

function MenuModule() {
  const [categories, setCategories] = useState([]);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [originalCategory, setOriginalCategory] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const uploadXhr = useRef(null);
  const [editingItem, setEditingItem] = useState(null);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const MEDIA_LIMIT_MENU = 24;

  // paginated gallery media hook (infinite scroll sentinel provided by hook)
  const { items: pagedMedia, loading: pagedLoading, total: pagedTotal, sentinelRef, fetchPage, reset } = usePaginatedResource(`${API_BASE}/media?category=gallery`, { limit: MEDIA_LIMIT_MENU });
  const [selectedMediaId, setSelectedMediaId] = useState(null);
  const [toast, setToast] = useState(null);

    /*
      MenuModule

      Purpose:
      - Admin UI to manage menu categories and items. Supports CRUD operations
        for categories and menu items via the backend API.

      Expected API endpoints:
      - GET /api/menu -> categories with items
      - POST/PUT /api/menu/categories and /api/menu/categories/:id
      - DELETE /api/menu/categories/:id
      - POST/PUT /api/menu/items and /api/menu/items/:id
      - DELETE /api/menu/items/:id

      Notes:
      - The component uses simple modal editors for categories and items. Validation
        is minimal; consider adding required-field checks before saving.
      - Prices are handled as numbers (parseFloat) when editing — guard against NaN where necessary.
    */

  useEffect(() => {
    fetchCategories();
  }, []);

  const apiOrigin = API_BASE.replace(/\/api$/, '');
  const normalizeUrl = (u) => {
    if (!u) return '';
    if (u.startsWith('http://') || u.startsWith('https://')) return u;
    if (u.startsWith('/')) return `${apiOrigin}${u}`;
    return `${apiOrigin}/${u}`;
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE}/menu/admin`, {
        headers: { 'X-Admin-Auth': 'admin' }
      });
      if (!res.ok) { setCategories([]); return; }
      const data = await res.json();
      // server returns categories already ordered by display_order and items ordered by display_order
      setCategories(Array.isArray(data) ? data : []);
    } catch (e) {
      setCategories([]);
    }
  };

  const saveCategory = () => {
    // client-side validation: name required
    if (!editingCategory.name || !editingCategory.name.trim()) {
    setUploadError(null);
    try { window.dispatchEvent(new window.CustomEvent('snackbar', { detail: 'Category name is required' })); } catch (e) {}
    return;
    }
    const method = editingCategory.id ? 'PUT' : 'POST';
    const url = editingCategory.id 
      ? `${API_BASE}/menu/categories/${editingCategory.id}`
      : `${API_BASE}/menu/categories`;

  // Preserve image fields if the admin didn't modify them
  const payload = { ...editingCategory };
    if (originalCategory && editingCategory.id) {
      // For image fields: prefer explicit editingCategory values; if undefined, fall back to originalCategory.
      payload.image_url = typeof editingCategory.image_url !== 'undefined' ? editingCategory.image_url : (originalCategory.image_url || null);
      payload.gallery_image_url = typeof editingCategory.gallery_image_url !== 'undefined' ? editingCategory.gallery_image_url : (originalCategory.gallery_image_url || null);
      // gallery_image_id should also be preserved unless explicitly changed
      payload.gallery_image_id = typeof editingCategory.gallery_image_id !== 'undefined' ? editingCategory.gallery_image_id : (originalCategory.gallery_image_id || null);
    }

    // clean save path (no debug helpers)

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(() => {
      fetchCategories();
      setEditingCategory(null);
      setOriginalCategory(null);
      setToast({ type: 'success', message: 'Category saved' });
      setTimeout(() => setToast(null), 3000);
    }).catch(() => {
      setToast({ type: 'error', message: 'Failed to save category' });
      setTimeout(() => setToast(null), 3000);
    });
  };

  // Upload helper: XMLHttpRequest-based so we can track progress and cancel
  const uploadFile = (file) => {
    if (!file) return Promise.resolve(null);
    return new Promise((resolve, reject) => {
      setUploading(true);
      setUploadProgress(0);
      setUploadError(null);
      const xhr = new window.XMLHttpRequest();
      uploadXhr.current = xhr;
      const fd = new FormData();
      fd.append('file', file);

      xhr.open('POST', `${API_BASE}/media/upload`);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const pct = Math.round((e.loaded / e.total) * 100);
          setUploadProgress(pct);
        }
      };

      xhr.onload = () => {
        uploadXhr.current = null;
        setUploading(false);
        setUploadProgress(100);
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            resolve(data.file_url || null);
          } catch (err) {
            setUploadError('Invalid server response');
            reject(new Error('Invalid response'));
          }
        } else {
          setUploadError('Upload failed');
          reject(new Error('Upload failed'));
        }
      };

      xhr.onerror = () => {
        uploadXhr.current = null;
        setUploading(false);
        setUploadError('Network error');
        reject(new Error('Network error'));
      };

      xhr.send(fd);
    });
  };

  const cancelUpload = () => {
    if (uploadXhr.current) {
      try { uploadXhr.current.abort(); } catch (e) {}
      uploadXhr.current = null;
    }
    setUploading(false);
    setUploadProgress(0);
    setUploadError('Upload cancelled');
  };

  const deleteCategory = (id) => {
    if (window.confirm('Delete this category and all its items?')) {
      fetch(`${API_BASE}/menu/categories/${id}`, { method: 'DELETE' })
        .then(() => fetchCategories());
    }
  };

  const saveItem = () => {
    const method = editingItem.id ? 'PUT' : 'POST';
    const url = editingItem.id
      ? `${API_BASE}/menu/items/${editingItem.id}`
      : `${API_BASE}/menu/items`;

    // Ensure is_available is explicit so backend update doesn't set it to NULL
    const payload = { ...editingItem, is_available: typeof editingItem.is_available !== 'undefined' ? editingItem.is_available : 1 };

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(() => {
      fetchCategories();
      setEditingItem(null);
    }).catch(() => {
      // still refetch to keep UI consistent
      fetchCategories();
      setEditingItem(null);
    });
  };

  const deleteItem = (id) => {
    if (window.confirm('Delete this menu item?')) {
      fetch(`${API_BASE}/menu/items/${id}`, { method: 'DELETE' })
        .then(() => fetchCategories());
    }
  };

  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
  <h2 className="text-2xl font-bold text-text-inverse">Menu Management</h2>
        <button
          type="button"
    onClick={() => setEditingCategory({ name: '', description: '', display_order: 0, is_active: 1 })}
          className="bg-primary text-text-inverse px-4 py-2 rounded-lg hover:bg-primary-dark flex items-center gap-2"
          aria-label="Add menu category"
        >
          <icons.Plus size={18} />
          Add Category
        </button>
      </div>

      {/* Category Editor Modal */}
      {editingCategory && (
        <div className="modal-backdrop flex items-center justify-center z-50">
                <div className="bg-surface rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4 text-text-primary">
              {editingCategory.id ? 'Edit' : 'Add'} Category
            </h3>
            <p className="text-sm text-text-muted mb-3">Existing images will be preserved unless you remove or replace them.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Name</label>
                <input
                  type="text"
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({...editingCategory, name: e.target.value})}
                  className="w-full form-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Description</label>
                <textarea
                  value={editingCategory.description}
                  onChange={(e) => setEditingCategory({...editingCategory, description: e.target.value})}
                  className="w-full form-input"
                  rows="3"
                />
              </div>
              <div>
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" checked={!!editingCategory.is_active} onChange={(e) => setEditingCategory(c => ({ ...c, is_active: e.target.checked ? 1 : 0 }))} />
                  <span className="text-sm text-text-primary">Active</span>
                </label>
              </div>
              <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">Image URL (optional)</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={editingCategory.image_url || ''}
                    onChange={(e) => setEditingCategory({...editingCategory, image_url: e.target.value})}
                    placeholder="https://.../image.jpg"
                    className="w-full form-input"
                    disabled={uploading}
                  />
                  <label className={`px-3 py-2 rounded cursor-pointer text-sm ${uploading ? 'opacity-60 pointer-events-none' : 'bg-surface'}`}>
                    <input type="file" accept="image/*" className="hidden" onChange={async (ev) => {
                      const f = ev.target.files?.[0];
                      if (!f) return;
                      // client-side checks: image type and size <= 5MB
                      const MAX_BYTES = 5 * 1024 * 1024;
                      if (!f.type.startsWith('image/')) {
                        setUploadError('Please select an image file');
                        return;
                      }
                      if (f.size > MAX_BYTES) {
                        setUploadError('Image must be 5 MB or smaller');
                        return;
                      }
                      try {
                        const url = await uploadFile(f);
                        if (url) setEditingCategory(c => ({ ...c, image_url: url }));
                      } catch (err) {
                        // error state is handled by uploadError
                      }
                    }} />
                    {uploading ? `Uploading ${uploadProgress}%` : 'Upload'}
                  </label>
                </div>
                {uploadError && <Toast type="error" onClose={() => setUploadError(null)}>{uploadError}</Toast>}
                {editingCategory.image_url && (
                  <div className="mt-2">
                    <img loading="lazy" src={editingCategory.image_url} alt="preview" className="h-24 rounded object-cover" />
                    {uploading && <div className="w-full bg-surface-warm h-2 rounded mt-2 overflow-hidden"><div className="bg-accent h-2" style={{ width: `${uploadProgress}%` }} /></div>}
                    {uploading && <div className="mt-2"><button type="button" onClick={cancelUpload} className="btn btn-ghost btn-sm">Cancel</button></div>}
                  </div>
                )}

                  {/* debug overlay removed */}
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Gallery image (optional)</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={editingCategory.gallery_image_url || ''}
                    onChange={(e) => setEditingCategory({...editingCategory, gallery_image_url: e.target.value})}
                    placeholder="https://.../image.jpg"
                    className="w-full form-input"
                    disabled={uploading}
                  />
                  <button
                    type="button"
                    onClick={async () => {
                      // open picker and fetch first page
                      const cur = editingCategory.gallery_image_url;
                      setSelectedMediaId(null);
                      setShowMediaPicker(true);
                      try {
                        reset();
                        await fetchPage(0, false);
                        if (cur) {
                          const match = (pagedMedia || []).find(m => normalizeUrl(m.file_url) === normalizeUrl(cur) || m.file_url === cur);
                          if (match) setSelectedMediaId(match.id);
                        }
                      } catch (e) {
                        // ignore
                      }
                    }}
                    className="px-3 py-2 rounded text-sm bg-surface"
                  >
                    Choose from Media
                  </button>
                  {editingCategory.gallery_image_url && (
                    <button type="button" onClick={() => setEditingCategory(c => ({ ...c, gallery_image_url: '', gallery_image_id: null }))} className="px-3 py-2 rounded text-sm bg-surface">Remove</button>
                  )}
                </div>
                {editingCategory.gallery_image_url && (
                  <div className="mt-2">
                    <img loading="lazy" src={normalizeUrl(editingCategory.gallery_image_url)} alt="gallery preview" className="h-24 rounded object-cover" />
                  </div>
                )}
                {/* media errors are handled by the paginated hook when needed */}
              </div>
              <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={saveCategory}
                    className="flex-1 bg-primary text-text-inverse py-2 rounded-lg hover:bg-primary-dark"
                    disabled={uploading}
                  >
                    {uploading ? 'Uploading…' : 'Save'}
                  </button>
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="flex-1 bg-surface-warm text-text-secondary py-2 rounded-lg hover:bg-surface"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Media Picker Modal */}
      {showMediaPicker && (
        <div className="modal-backdrop flex items-center justify-center z-50">
          <div className="bg-surface rounded-lg p-4 max-w-3xl w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Choose media</h3>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setShowMediaPicker(false)} className="px-3 py-1 rounded">Cancel</button>
                <button
                  type="button"
                  onClick={() => {
                    const media = (pagedMedia || []).find(m => String(m.id) === String(selectedMediaId));
                    if (media) setEditingCategory(c => ({ ...c, gallery_image_url: media.file_url, gallery_image_id: media.id }));
                    setShowMediaPicker(false);
                  }}
                  className="px-3 py-1 rounded bg-primary text-text-inverse"
                >
                  Select
                </button>
              </div>
            </div>
            <div>
                <div className="mb-3">
                <button type="button" onClick={() => {
                  // reset and fetch first page
                  reset();
                  fetchPage(0, false).catch(() => {});
                }} className="px-3 py-1 rounded bg-surface">Refresh</button>
              </div>
                  {pagedLoading ? (
                  <div className="flex items-center gap-2"><Spinner size={18} /><span>Loading…</span></div>
                ) : (
                  <>
                  <div className="grid grid-cols-4 gap-3">
                    {pagedMedia.map(m => (
                      <button key={m.id} type="button" onClick={() => setSelectedMediaId(m.id)} className={`border rounded overflow-hidden p-0 ${String(selectedMediaId) === String(m.id) ? 'ring-2 ring-primary' : ''}`}>
                        <img loading="lazy" src={normalizeUrl(m.file_url)} alt={m.title || ''} className="w-full h-24 object-cover" />
                      </button>
                    ))}
                  </div>
                  {pagedTotal !== null && pagedTotal > pagedMedia.length && (
                    <div className="mt-3 text-center">
                      <div ref={sentinelRef} aria-hidden="true" className="h-6" />
                      <div className="text-xs text-text-secondary mt-2">Loading more as you scroll…</div>
                    </div>
                  )}
                  </>
                )}
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50">
          <Toast type={toast.type} onClose={() => setToast(null)}>{toast.message}</Toast>
        </div>
      )}

      {/* Item Editor Modal */}
      {editingItem && (
        <div className="modal-backdrop flex items-center justify-center z-50">
                <div className="bg-surface rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4 text-text-primary">
              {editingItem.id ? 'Edit' : 'Add'} Menu Item
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Name</label>
                <input
                  type="text"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                  className="w-full form-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Description</label>
                <textarea
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                  className="w-full form-input"
                  rows="2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Price</label>
                <input
                  type="number"
                  step="0.01"
                  value={editingItem.price}
                  onChange={(e) => setEditingItem({...editingItem, price: parseFloat(e.target.value)})}
                  className="w-full form-input"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={saveItem}
                  className="flex-1 bg-primary text-text-inverse py-2 rounded-lg hover:bg-primary-dark"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="flex-1 bg-surface-warm text-text-secondary py-2 rounded-lg hover:bg-surface"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Categories List */}
      <div className="space-y-4">
        {categories.map(category => (
          <div key={category.id} className="bg-surface rounded-lg shadow">
              <div className="flex items-center justify-between p-4 border-b border-divider">
              <button
                type="button"
                onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
                className="flex-1 flex items-center gap-3 text-left"
                aria-expanded={expandedCategory === category.id}
                aria-controls={`category-items-${category.id}`}
              >
                <div>
                  {expandedCategory === category.id ? <icons.ChevronUp size={20} /> : <icons.ChevronDown size={20} />}
                </div>
                <div className="flex items-center gap-3">
                  {category.gallery_image_url && (
                    <img loading="lazy" src={normalizeUrl(category.gallery_image_url)} alt="thumb" className="w-12 h-8 object-cover rounded" />
                  )}
                  <div>
                    <h3 className="font-bold text-lg text-text-primary">{category.name}</h3>
                    <p className="text-sm text-text-secondary">{category.description}</p>
                  </div>
                </div>
              </button>
                <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingItem({ category_id: category.id, name: '', description: '', price: 0 })}
                  className="text-primary hover:bg-surface-warm p-2 rounded"
                  aria-label={`Add item to ${category.name}`}
                >
                  <icons.Plus size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingCategory({ ...category, is_active: category.is_active == null ? 1 : category.is_active });
                    setOriginalCategory(category);
                  }}
                  className="text-text-inverse hover:bg-surface-warm p-2 rounded"
                  aria-label={`Edit category ${category.name}`}
                >
                  <icons.Edit size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => deleteCategory(category.id)}
                  className="text-error hover:bg-surface-warm p-2 rounded"
                  aria-label={`Delete category ${category.name}`}
                >
                  <icons.Trash2 size={18} />
                </button>
              </div>
            </div>

            {expandedCategory === category.id && (
              <div id={`category-items-${category.id}`} className="p-4" role="region" aria-label={`${category.name} items`}>
                {category.items && category.items.length > 0 ? (
                  <div className="space-y-2">
                    {category.items.map(item => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-surface-warm rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-text-primary">{item.name}</p>
                          <p className="text-sm text-text-secondary">{item.description}</p>
                            <p className="text-lg font-heading text-primary mt-1">{typeof item.price === 'number' ? `$${item.price.toFixed(2)}` : '—'}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingItem(item)}
                            className="text-text-secondary hover:bg-surface p-2 rounded"
                            aria-label={`Edit item ${item.name}`}
                          >
                            <icons.Edit size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteItem(item.id)}
                            className="text-error hover:bg-surface p-2 rounded"
                            aria-label={`Delete item ${item.name}`}
                          >
                            <icons.Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-text-secondary py-4">No items in this category</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const Module = {
  component: MenuModule,
  name: 'Menu',
  icon: icons.UtensilsCrossed
};

export default Module;

// Icons and auxiliary UI components are referenced here so linters pick up usage
// for imports that are only used inside JSX expressions in some editor/tooling
// setups which otherwise report false-positive `no-unused-vars` errors.
const __usedMenuSymbols = { icons, Toast };
void __usedMenuSymbols;

// Icons are referenced through the centralized `icons` map so linters pick up usage.
