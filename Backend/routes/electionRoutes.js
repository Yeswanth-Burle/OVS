const express = require('express');
const router = express.Router();
const {
    createElection,
    getElections,
    getElectionById,
    updateElectionStatus,
    updateElectionEligibility,
} = require('../controllers/electionController');
const { addCandidate, getCandidates } = require('../controllers/candidateController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('admin', 'main_admin'), createElection);
router.get('/', protect, getElections);
router.get('/:id', protect, getElectionById);
// Update election status
router.patch('/:id/status', protect, authorize('admin', 'main_admin'), updateElectionStatus);

// Candidate Routes
router.post('/:id/candidates', protect, authorize('admin', 'main_admin'), addCandidate);
router.get('/:id/candidates', protect, getCandidates);

// Update election eligibility
router.patch('/:id/eligibility', protect, authorize('admin', 'main_admin'), updateElectionEligibility);

module.exports = router;
