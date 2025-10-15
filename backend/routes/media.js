/*
  Purpose:
  - Provide media management endpoints used by the admin UI: list media,
    upload files (multipart/form-data), and delete media records.
  - This route relies on the `upload` instance configured in `server.js` and
    exposed via `app.get('upload')`.
  Notes:
  - Keep file handling and metadata insertion here; avoid moving business
    logic into server.js.
  Developer annotations:
  - Inputs (POST /api/media/upload): multipart/form-data with field `file`; optional fields: title, alt_text, category.
  - Outputs: GET returns array of media objects; POST returns { id, file_url, message } on success.
  - Security: validate MIME type and size server-side. Store files outside the webroot or use safe filename handling. The route uses the multer `upload` instance configured in `server.js`.
  - Example (curl with file):
    curl -F "file=@./image.jpg" -F "title=My Image" http://localhost:5001/api/media/upload
*/

const express = require('express');
const router = express.Router();

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
