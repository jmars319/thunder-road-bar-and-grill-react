const express = require('express');
const router = express.Router();

// Get all job applications
router.get('/jobs', (req, res) => {
  req.db.query(
    'SELECT * FROM job_applications ORDER BY submitted_at DESC',
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});

// Submit job application
router.post('/jobs', (req, res) => {
  const { name, email, phone, position, experience, cover_letter, resume_url } = req.body;
  
  req.db.query(
    'INSERT INTO job_applications (name, email, phone, position, experience, cover_letter, resume_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [name, email, phone, position, experience, cover_letter, resume_url],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId, message: 'Application submitted' });
    }
  );
});

// Update application status
router.put('/jobs/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  req.db.query(
    'UPDATE job_applications SET status = ? WHERE id = ?',
    [status, id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Application updated' });
    }
  );
});

// Delete application
router.delete('/jobs/:id', (req, res) => {
  const { id } = req.params;
  req.db.query('DELETE FROM job_applications WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Application deleted' });
  });
});

module.exports = router;
