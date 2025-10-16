(async () => {
  const assert = require('assert');
  const http = require('http');

  const API_BASE = process.env.API_BASE || 'http://localhost:5001/api';
  const fetch = global.fetch || require('node-fetch');

  try {
    // 1) Create a new category
    const unique = `int-test-${Date.now()}`;
    let res = await fetch(`${API_BASE}/menu/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: unique, description: 'integration test category', display_order: 999, is_active: 1 })
    });
    assert(res.ok, 'POST /menu/categories failed');
    const created = await res.json();
    assert(created.id, 'No id returned from create');
    const catId = created.id;

    // 2) Update category to set is_active = 1 explicitly (and optionally gallery_image_id)
    res = await fetch(`${API_BASE}/menu/categories/${catId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: unique, description: 'updated', display_order: 1000, is_active: 1 })
    });
    assert(res.ok, 'PUT /menu/categories/:id failed');

    // 3) Fetch public menu and ensure our category appears
    res = await fetch(`${API_BASE}/menu`);
    assert(res.ok, 'GET /menu failed');
    const menu = await res.json();
    const found = Array.isArray(menu) ? menu.find(c => c.name === unique) : null;
    assert(found, 'Created category not present in public menu');

    // 4) Cleanup: delete category
    res = await fetch(`${API_BASE}/menu/categories/${catId}`, { method: 'DELETE' });
    assert(res.ok, 'DELETE /menu/categories/:id failed');

    console.log('Integration test passed');
    process.exit(0);
  } catch (err) {
    console.error('Integration test failed:', err && err.message ? err.message : err);
    process.exit(2);
  }
})();
