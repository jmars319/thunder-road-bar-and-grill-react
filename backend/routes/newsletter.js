const express = require('express');
const router = express.Router();

// Get all subscribers
router.get('/newsletter/subscribers', (req, res) => {
  req.db.query(
    'SELECT * FROM newsletter_subscribers ORDER BY subscribed_at DESC',
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});

// Subscribe to newsletter
router.post('/newsletter/subscribe', (req, res) => {
  const { email, name } = req.body;
  
  req.db.query(
    'INSERT INTO newsletter_subscribers (email, name) VALUES (?, ?)',
    [email, name],
    (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ error: 'Email already subscribed' });
        }
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: result.insertId, message: 'Subscribed successfully' });
    }
  );
});

// Unsubscribe
router.post('/newsletter/unsubscribe', (req, res) => {
  const { email } = req.body;
  
  req.db.query(
    'UPDATE newsletter_subscribers SET is_active = 0 WHERE email = ?',
    [email],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Unsubscribed successfully' });
    }
  );
});

// Delete subscriber
router.delete('/newsletter/subscribers/:id', (req, res) => {
  const { id } = req.params;
  req.db.query('DELETE FROM newsletter_subscribers WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Subscriber deleted' });
  });
});

module.exports = router;
