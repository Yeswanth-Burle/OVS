const Vote = require('../models/Vote');
const Candidate = require('../models/Candidate');
const Election = require('../models/Election');
const User = require('../models/User');

// @desc    Cast a vote
// @route   POST /api/votes
// @access  Voter
exports.castVote = async (req, res) => {
    try {
        const { electionId, candidateId } = req.body;
        const voterId = req.user.id;

        // Check if election is active
        const election = await Election.findById(electionId);
        if (!election) {
            return res.status(404).json({ message: 'Election not found' });
        }
        if (election.status !== 'active') {
            return res.status(400).json({ message: 'Election is not active' });
        }

        // Check eligibility
        if (election.eligibility === 'invite_only') {
            if (!election.allowedVoters.includes(voterId)) {
                return res.status(403).json({ message: 'You are not eligible to vote in this election' });
            }
        } else if (election.eligibility === 'blacklisted') {
            if (election.blockedVoters.includes(voterId)) {
                return res.status(403).json({ message: 'You are blocked from voting in this election' });
            }
        }

        // Check if user already voted (also handled by DB index, but good to check early)
        const alreadyVoted = await Vote.findOne({ voterId, electionId });
        if (alreadyVoted) {
            return res.status(400).json({ message: 'You have already voted in this election' });
        }

        // Create Vote
        const vote = await Vote.create({
            voterId,
            electionId,
            candidateId,
        });

        // Increment candidate vote count
        await Candidate.findByIdAndUpdate(candidateId, { $inc: { voteCount: 1 } });

        // Add election to user's votedElections
        await User.findByIdAndUpdate(voterId, { $push: { votedElections: electionId } });

        res.status(201).json({ message: 'Vote cast successfully' });
    } catch (error) {
        console.error(error);
        if (error.code === 11000) {
            return res.status(400).json({ message: 'You have already voted in this election' });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Check if user voted in election
// @route   GET /api/votes/check/:electionId
// @access  Voter
exports.checkVoteStatus = async (req, res) => {
    try {
        const { electionId } = req.params;
        const voterId = req.user.id;

        const vote = await Vote.findOne({ voterId, electionId });

        if (vote) {
            res.status(200).json({ hasVoted: true, vote });
        } else {
            res.status(200).json({ hasVoted: false });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
