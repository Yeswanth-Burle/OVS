const express = require('express');
const router = express.Router();
const { getResults } = require('../controllers/resultController');
const { protect } = require('../middleware/authMiddleware');

// Using protect here to allow checking req.user for admin role
router.get('/:electionId', protect, getResults);

module.exports = router;
