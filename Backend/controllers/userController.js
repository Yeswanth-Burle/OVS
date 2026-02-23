const User = require('../models/User');
const Election = require('../models/Election');
const Candidate = require('../models/Candidate');
const Vote = require('../models/Vote');

// @desc    Get all users
// @route   GET /api/users
// @access  Admin/Main Admin
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update user status (approve/block) or role
// @route   PATCH /api/users/:id/status
// @access  Main Admin
exports.updateUser = async (req, res) => {
    try {
        const { status, role } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (status) user.status = status;
        if (role) user.role = role;

        await user.save();

        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Create a new admin
// @route   POST /api/users/create-admin
// @access  Main Admin
exports.createAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please add all fields' });
        }

        // Check if user exists
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        // Note: In a real app, you might want to auto-generate a password and email it to the user
        // For simplicity, we'll take it from the request or use a default if you prefer logic for that
        const salt = require('bcryptjs').genSaltSync(10);
        const hashedPassword = require('bcryptjs').hashSync(password, salt);

        // Create admin user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'admin',
            status: 'approved' // Auto-approve created admins
        });

        if (user) {
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get system stats
// @route   GET /api/users/stats
// @access  Admin/Main Admin
exports.getStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalElections = await Election.countDocuments();
        const totalCandidates = await Candidate.countDocuments();
        const totalVotes = await Vote.countDocuments();

        res.status(200).json({
            totalUsers,
            totalElections,
            totalCandidates,
            totalVotes,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
