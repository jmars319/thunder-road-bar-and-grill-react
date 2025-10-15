const express = require('express');
const router = express.Router();

// Get all menu categories with items
router.get('/menu', (req, res) => {
  const query = `
    SELECT 
      c.id as category_id,
      c.name as category_name,
      c.description as category_description,
      c.image_url as category_image,
      c.display_order as category_order,
      i.id as item_id,
      i.name as item_name,
      i.description as item_description,
      i.price as item_price,
      i.image_url as item_image,
      i.display_order as item_order
    FROM menu_categories c
    LEFT JOIN menu_items i ON c.id = i.category_id
    WHERE c.is_active = 1 AND (i.is_available = 1 OR i.id IS NULL)
    ORDER BY c.display_order, i.display_order
  `;

  req.db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // Group items by category
    const categories = {};
    results.forEach(row => {
      if (!categories[row.category_id]) {
        categories[row.category_id] = {
          id: row.category_id,
          name: row.category_name,
          description: row.category_description,
          image_url: row.category_image,
          display_order: row.category_order,
          items: []
        };
      }
      
      if (row.item_id) {
        categories[row.category_id].items.push({
          id: row.item_id,
          name: row.item_name,
          description: row.item_description,
          price: row.item_price,
          image_url: row.item_image,
          display_order: row.item_order
        });
      }
    });

    res.json(Object.values(categories));
  });
});

// Get all categories (admin)
router.get('/menu/categories', (req, res) => {
  req.db.query('SELECT * FROM menu_categories ORDER BY display_order', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Get items by category (admin)
router.get('/menu/categories/:categoryId/items', (req, res) => {
  const { categoryId } = req.params;
  req.db.query(
    'SELECT * FROM menu_items WHERE category_id = ? ORDER BY display_order',
    [categoryId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});

// Create category
router.post('/menu/categories', (req, res) => {
  const { name, description, image_url, display_order } = req.body;
  req.db.query(
    'INSERT INTO menu_categories (name, description, image_url, display_order) VALUES (?, ?, ?, ?)',
    [name, description, image_url, display_order || 0],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId, message: 'Category created' });
    }
  );
});

// Update category
router.put('/menu/categories/:id', (req, res) => {
  const { id } = req.params;
  const { name, description, image_url, display_order, is_active } = req.body;
  req.db.query(
    'UPDATE menu_categories SET name = ?, description = ?, image_url = ?, display_order = ?, is_active = ? WHERE id = ?',
    [name, description, image_url, display_order, is_active, id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Category updated' });
    }
  );
});

// Delete category
router.delete('/menu/categories/:id', (req, res) => {
  const { id } = req.params;
  req.db.query('DELETE FROM menu_categories WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Category deleted' });
  });
});

// Create menu item
router.post('/menu/items', (req, res) => {
  const { category_id, name, description, price, image_url, display_order } = req.body;
  req.db.query(
    'INSERT INTO menu_items (category_id, name, description, price, image_url, display_order) VALUES (?, ?, ?, ?, ?, ?)',
    [category_id, name, description, price, image_url, display_order || 0],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId, message: 'Item created' });
    }
  );
});

// Update menu item
router.put('/menu/items/:id', (req, res) => {
  const { id } = req.params;
  const { name, description, price, image_url, display_order, is_available } = req.body;
  req.db.query(
    'UPDATE menu_items SET name = ?, description = ?, price = ?, image_url = ?, display_order = ?, is_available = ? WHERE id = ?',
    [name, description, price, image_url, display_order, is_available, id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Item updated' });
    }
  );
});

// Delete menu item
router.delete('/menu/items/:id', (req, res) => {
  const { id } = req.params;
  req.db.query('DELETE FROM menu_items WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Item deleted' });
  });
});

module.exports = router;
