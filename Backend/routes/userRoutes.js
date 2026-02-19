const express = require('express');
const router = express.Router();
const { getUsers, updateUser, getStats } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, authorize('admin', 'main_admin'), getUsers);
router.patch('/:id/status', protect, authorize('main_admin'), updateUser);
router.get('/stats', protect, authorize('admin', 'main_admin'), getStats);

module.exports = router;
