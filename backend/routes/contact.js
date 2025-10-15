const express = require('express');
const router = express.Router();

/*
  Contact routes

  Purpose:
  - Receive messages from the public site and provide admin endpoints to
    review, mark, and delete messages.

  Endpoints:
  - GET /api/contact/messages
  - POST /api/contact
  - PUT /api/contact/messages/:id
  - DELETE /api/contact/messages/:id

  Notes:
  - The public POST should validate inputs (lengths, email format) and
    include spam protections (rate limiting and optionally a captcha).
  - Messages are stored in `contact_messages`. Consider indexing the
    email/submitted_at columns for faster admin queries.
  Developer annotations:
  - Inputs (POST /api/contact): { name, email, phone?, subject, message }
  - Inputs (PUT /api/contact/messages/:id): { is_read: boolean }
  - Outputs: standard JSON arrays or objects; errors return { error: string } with appropriate HTTP status codes.
  - Security: validate/sanitize inputs to avoid XSS in admin views and use rate-limiting to avoid spam.
  - Example: curl -X POST http://localhost:5001/api/contact -H "Content-Type: application/json" -d '{"name":"Jane","email":"jane@example.com","subject":"Hello","message":"Hi"}'
*/

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
