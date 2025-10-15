const express = require('express');
const router = express.Router();

// Get all contact messages
router.get('/contact/messages', (req, res) => {
  req.db.query(
    'SELECT * FROM contact_messages ORDER BY submitted_at DESC',
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});

// Submit contact message
router.post('/contact', (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  
  req.db.query(
    'INSERT INTO contact_messages (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)',
    [name, email, phone, subject, message],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId, message: 'Message sent successfully' });
    }
  );
});

// Mark message as read
router.put('/contact/messages/:id', (req, res) => {
  const { id } = req.params;
  const { is_read } = req.body;
  
  req.db.query(
    'UPDATE contact_messages SET is_read = ? WHERE id = ?',
    [is_read, id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Message updated' });
    }
  );
});

// Delete contact message
router.delete('/contact/messages/:id', (req, res) => {
  const { id } = req.params;
  req.db.query('DELETE FROM contact_messages WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Message deleted' });
  });
});

module.exports = router;
