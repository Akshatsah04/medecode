const express = require('express');
const router = express.Router();
const { processReport, getHistory } = require('../controllers/reportController');
const upload = require('../middleware/upload');
const { protect, optionalAuth } = require('../middleware/authMiddleware');

// GET /api/report/history
router.get('/history', protect, getHistory);

// POST /api/report/analyze
router.post('/analyze', optionalAuth, upload.single('report'), processReport);

module.exports = router;
