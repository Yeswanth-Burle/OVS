const Candidate = require('../models/Candidate');
const Election = require('../models/Election');

// @desc    Add a candidate to an election
// @route   POST /api/elections/:id/candidates
// @access  Admin
exports.addCandidate = async (req, res) => {
    try {
        const { name, party, image } = req.body;
        const electionId = req.params.id;

        const election = await Election.findById(electionId);
        if (!election) {
            return res.status(404).json({ message: 'Election not found' });
        }

        // Check if election has started
        // Check if election has started
        if (election.status !== 'draft') {
            return res.status(400).json({ message: 'Cannot add candidates after the election has started' });
        }

        const candidate = await Candidate.create({
            name,
            party,
            image,
            electionId,
        });

        res.status(201).json(candidate);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get candidates for an election
// @route   GET /api/elections/:id/candidates
// @access  Public
exports.getCandidates = async (req, res) => {
    try {
        const electionId = req.params.id;
        const candidates = await Candidate.find({ electionId });

        res.status(200).json(candidates);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
