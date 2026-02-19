const express = require('express');
const router = express.Router();
const { castVote, checkVoteStatus } = require('../controllers/voteController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, castVote);
router.get('/check/:electionId', protect, checkVoteStatus);

module.exports = router;
