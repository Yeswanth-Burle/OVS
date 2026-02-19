const Election = require('../models/Election');

// @desc    Create a new election
// @route   POST /api/elections
// @access  Admin
exports.createElection = async (req, res) => {
    try {
        const { title, description, startDate, endDate } = req.body;

        const electionExists = await Election.findOne({ title });
        if (electionExists) {
            return res.status(400).json({ message: 'Election with this title already exists' });
        }

        const election = await Election.create({
            title,
            description,
            startDate,
            endDate,
            createdBy: req.user.id,
        });

        res.status(201).json(election);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all elections
// @route   GET /api/elections
// @access  Public (or Protected based on requirement)
exports.getElections = async (req, res) => {
    try {
        const elections = await Election.find().populate('createdBy', 'name');
        res.status(200).json(elections);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get election by ID
// @route   GET /api/elections/:id
// @access  Public
exports.getElectionById = async (req, res) => {
    try {
        const election = await Election.findById(req.params.id).populate('createdBy', 'name');
        if (!election) {
            return res.status(404).json({ message: 'Election not found' });
        }
        res.status(200).json(election);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update election status (e.g., active, completed)
// @route   PATCH /api/elections/:id/status
// @access  Admin
exports.updateElectionStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const election = await Election.findById(req.params.id);

        if (!election) {
            return res.status(404).json({ message: 'Election not found' });
        }

        election.status = status;
        await election.save();

        res.status(200).json(election);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update election eligibility
// @route   PATCH /api/elections/:id/eligibility
// @access  Admin
exports.updateElectionEligibility = async (req, res) => {
    try {
        const { eligibility, allowedVoters, blockedVoters } = req.body;
        const election = await Election.findById(req.params.id);

        if (!election) {
            return res.status(404).json({ message: 'Election not found' });
        }

        if (eligibility) election.eligibility = eligibility;
        if (allowedVoters) election.allowedVoters = allowedVoters;
        if (blockedVoters) election.blockedVoters = blockedVoters;

        await election.save();

        res.status(200).json(election);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
