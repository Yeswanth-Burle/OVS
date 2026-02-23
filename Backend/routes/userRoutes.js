const express = require('express');
const router = express.Router();
const { getUsers, updateUser, getStats, createAdmin } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, authorize('admin', 'main_admin'), getUsers);
router.patch('/:id/status', protect, authorize('main_admin'), updateUser);
router.post('/create-admin', protect, authorize('main_admin'), createAdmin);
router.get('/stats', protect, authorize('admin', 'main_admin'), getStats);

module.exports = router;
