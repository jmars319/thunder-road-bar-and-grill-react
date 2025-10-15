const express = require('express');
const router = express.Router();

/*
  Media routes

  Endpoints:
  - GET /api/media
  - POST /api/media/upload (multipart/form-data field: 'file')
  - DELETE /api/media/:id

  Notes:
  - Upload handling is delegated to the `upload` instance configured in
  server.js and exposed via `app.set('upload', upload)`.
  - The upload handler performs MIME type checks and size limits. This
    route expects a `file` field in the multipart body and metadata (title,
    alt_text, category) in the body.
  - After inserting metadata into `media_library`, the route returns a
    `file_url` which the frontend can use to display the asset.
*/

// Get all media
router.get('/media', (req, res) => {
  req.db.query(
    'SELECT * FROM media_library ORDER BY uploaded_at DESC',
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});

// Upload media
router.post('/media/upload', (req, res) => {
  const upload = req.app.get('upload');

  // We call the multer middleware directly so we can access req.file and
  // handle errors uniformly within this route.
  upload.single('file')(req, res, (err) => {
    if (err) {
      const status = err.status || 500;
      return res.status(status).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { filename, originalname, mimetype, size } = req.file;
    const file_url = `/uploads/${filename}`;
    const { title, alt_text, category } = req.body;

    req.db.query(
      'INSERT INTO media_library (file_url, file_name, file_type, file_size, title, alt_text, category) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [file_url, originalname, mimetype, size, title, alt_text, category],
      (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({
          id: result.insertId,
          file_url,
          message: 'File uploaded successfully'
        });
      }
    );
  });
});

// Delete media
router.delete('/media/:id', (req, res) => {
  const { id } = req.params;
  req.db.query('DELETE FROM media_library WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Media deleted' });
  });
});

module.exports = router;
