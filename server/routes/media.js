import express from 'express';
import upload from '../middleware/upload.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Upload single file
// @route   POST /api/media/upload
// @access  Private (Admin only)
router.post('/upload', protect, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded or file rejected by filter.' });
    }

    // Return the URL to access the uploaded file
    const fileUrl = `/uploads/${req.file.filename}`;
    return res.status(201).json({
      message: 'File uploaded successfully!',
      url: fileUrl,
      fileName: req.file.filename,
      size: req.file.size
    });
  } catch (error) {
    return res.status(500).json({ message: 'File upload failed', error: error.message });
  }
});

export default router;
