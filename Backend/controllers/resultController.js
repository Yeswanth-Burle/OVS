const Vote = require('../models/Vote');
const Election = require('../models/Election');
const Candidate = require('../models/Candidate');

// @desc    Get election results
// @route   GET /api/results/:electionId
// @access  Public (after election) / Admin (always)
exports.getResults = async (req, res) => {
    try {
        const { electionId } = req.params;
        const election = await Election.findById(electionId);

        if (!election) {
            return res.status(404).json({ message: 'Election not found' });
        }

        // Check if user is admin or if election is completed
        // Note: For public access, we need to check if we have a user attached (if middleware is optionally used)
        // Or if the route is protected. The prompt says "Results visible only after election completion".
        // Admin should see always. 
        // We will assume this route is protected or we check req.user if available.
        // But if it's public access for voters, they can only see if status is completed.

        const isCompleted = election.status === 'completed';
        const isAdmin = req.user && (req.user.role === 'admin' || req.user.role === 'main_admin');

        if (!isCompleted && !isAdmin) {
            return res.status(403).json({ message: 'Results are available only after election completion' });
        }

        // Aggregate votes
        const results = await Candidate.find({ electionId }).sort({ voteCount: -1 });

        res.status(200).json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
