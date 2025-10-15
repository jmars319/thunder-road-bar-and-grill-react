import React, { useState, useEffect } from 'react';
import { UtensilsCrossed, Plus, Edit, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

const API_BASE = 'http://localhost:5001/api';

function MenuModule() {
  const [categories, setCategories] = useState([]);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    fetch(`${API_BASE}/menu`)
      .then(res => res.json())
      .then(data => setCategories(data));
  };

  const saveCategory = () => {
    const method = editingCategory.id ? 'PUT' : 'POST';
    const url = editingCategory.id 
      ? `${API_BASE}/menu/categories/${editingCategory.id}`
      : `${API_BASE}/menu/categories`;

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingCategory)
    }).then(() => {
      fetchCategories();
      setEditingCategory(null);
    });
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

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingItem)
    }).then(() => {
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
        <h2 className="text-2xl font-bold text-text-primary">Menu Management</h2>
        <button
          onClick={() => setEditingCategory({ name: '', description: '', display_order: 0 })}
          className="bg-primary text-text-inverse px-4 py-2 rounded-lg hover:bg-primary-dark flex items-center gap-2"
        >
          <Plus size={18} />
          Add Category
        </button>
      </div>

      {/* Category Editor Modal */}
      {editingCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-surface rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4 text-text-primary">
              {editingCategory.id ? 'Edit' : 'Add'} Category
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Name</label>
                <input
                  type="text"
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({...editingCategory, name: e.target.value})}
                  className="w-full form-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Description</label>
                <textarea
                  value={editingCategory.description}
                  onChange={(e) => setEditingCategory({...editingCategory, description: e.target.value})}
                  className="w-full form-input"
                  rows="3"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={saveCategory}
                  className="flex-1 bg-primary text-text-inverse py-2 rounded-lg hover:bg-primary-dark"
                >
                  Save
                </button>
                <button
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

      {/* Item Editor Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-surface rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4 text-text-primary">
              {editingItem.id ? 'Edit' : 'Add'} Menu Item
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Name</label>
                <input
                  type="text"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                  className="w-full form-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Description</label>
                <textarea
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                  className="w-full form-input"
                  rows="2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Price</label>
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
                  onClick={saveItem}
                  className="flex-1 bg-primary text-text-inverse py-2 rounded-lg hover:bg-primary-dark"
                >
                  Save
                </button>
                <button
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
                onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
                className="flex-1 flex items-center gap-3 text-left"
              >
                <div>
                  {expandedCategory === category.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-text-primary">{category.name}</h3>
                  <p className="text-sm text-text-secondary">{category.description}</p>
                </div>
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingItem({ category_id: category.id, name: '', description: '', price: 0 })}
                  className="text-primary hover:bg-surface-warm p-2 rounded"
                >
                  <Plus size={18} />
                </button>
                <button
                  onClick={() => setEditingCategory(category)}
                  className="text-text-secondary hover:bg-surface-warm p-2 rounded"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => deleteCategory(category.id)}
                  className="text-error hover:bg-surface-warm p-2 rounded"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            {expandedCategory === category.id && (
              <div className="p-4">
                {category.items && category.items.length > 0 ? (
                  <div className="space-y-2">
                    {category.items.map(item => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-surface-warm rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-text-primary">{item.name}</p>
                          <p className="text-sm text-text-secondary">{item.description}</p>
                          <p className="text-lg font-heading text-primary mt-1">${item.price.toFixed(2)}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingItem(item)}
                            className="text-text-secondary hover:bg-surface p-2 rounded"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => deleteItem(item.id)}
                            className="text-error hover:bg-surface p-2 rounded"
                          >
                            <Trash2 size={16} />
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
  icon: UtensilsCrossed
};

export default Module;
