const express = require('express');
const router = express.Router();

/*
  Reservations routes

  Purpose:
  - Provide public reservation creation and admin management endpoints.

  Endpoints:
  - GET /api/reservations
  - POST /api/reservations
  - PUT /api/reservations/:id
  - DELETE /api/reservations/:id

  Notes:
  - Ensure `reservation_date` and `reservation_time` are validated and use
    a consistent format compatible with MySQL.
  - Consider rate-limiting or adding captcha on the public POST endpoint to
    reduce spam and automated bookings.
*/

// Get all reservations
router.get('/reservations', (req, res) => {
  req.db.query(
    'SELECT * FROM reservations ORDER BY reservation_date DESC, reservation_time DESC',
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});

// Create reservation
router.post('/reservations', (req, res) => {
  const { name, email, phone, reservation_date, reservation_time, number_of_guests, special_requests } = req.body;
  
  req.db.query(
    'INSERT INTO reservations (name, email, phone, reservation_date, reservation_time, number_of_guests, special_requests) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [name, email, phone, reservation_date, reservation_time, number_of_guests, special_requests],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId, message: 'Reservation created' });
    }
  );
});

// Update reservation status
router.put('/reservations/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  req.db.query(
    'UPDATE reservations SET status = ? WHERE id = ?',
    [status, id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Reservation updated' });
    }
  );
});

// Delete reservation
router.delete('/reservations/:id', (req, res) => {
  const { id } = req.params;
  req.db.query('DELETE FROM reservations WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Reservation deleted' });
  });
});

module.exports = router;
