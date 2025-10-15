const express = require('express');
const router = express.Router();

/*
  Auth routes

  Purpose:
  - Provide simple authentication endpoints used by the admin UI. This file
    currently contains a development-only login stub and should be replaced
    with a production-ready auth system (hashed passwords, sessions or JWT,
    rate limiting, account lockout, and CSRF protections) before deployment.

  Endpoints:
  - POST /api/login
    Request: { email, password }
    Response: { success: boolean, user?: { id, name, email, role }, message?: string }

  Notes:
  - Responses should aim for a consistent shape so the frontend can handle
    errors and success cases uniformly. Do not store plaintext passwords.
*/

// Login endpoint (development stub)
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // NOTE: credentials are intentionally simple for local/dev use. Replace
  // with a real user lookup and password verification in production.
  if (email === 'admin' && password === 'admin123') {
    return res.json({
      success: true,
      user: {
        id: 1,
        name: 'Admin User',
        email: 'admin',
        role: 'admin'
      }
    });
  }

  return res.status(401).json({ success: false, message: 'Invalid credentials' });
});

module.exports = router;
