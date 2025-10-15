const express = require('express');
const router = express.Router();

// Login endpoint
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  // Updated credentials: admin / admin123
  if (email === 'admin' && password === 'admin123') {
    res.json({
      success: true,
      user: {
        id: 1,
        name: 'Admin User',
        email: 'admin',
        role: 'admin'
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
});

module.exports = router;
