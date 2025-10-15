// Lightweight admin auth middleware for dev/admin UI protection
// Checks for a simple header or cookie to gate admin endpoints. Replace with
// production-ready authentication (sessions/JWT) before deploying.
module.exports = function adminAuth(req, res, next) {
  // For development convenience, allow a header X-Admin-Auth: admin
  const header = req.get('X-Admin-Auth');
  if (header === 'admin') return next();

  // Alternatively, allow a cookie named admin=true (simple dev fallback)
  if (req.cookies && (req.cookies.admin === 'true' || req.cookies.admin === true)) return next();

  return res.status(401).json({ error: 'Unauthorized - admin only' });
};
