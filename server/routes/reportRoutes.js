const express = require('express');
const router = express.Router();
const { processReport, getHistory } = require('../controllers/reportController');
const upload = require('../middleware/upload');

// GET /api/report/history
router.get('/history', getHistory);

// POST /api/report/analyze
router.post('/analyze', upload.single('report'), processReport);

module.exports = router;
