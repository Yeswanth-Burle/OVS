const mongoose = require('mongoose');

const electionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
    },
    startDate: {
        type: Date,
        required: [true, 'Please add a start date'],
    },
    endDate: {
        type: Date,
        required: [true, 'Please add an end date'],
    },
    status: {
        type: String,
        enum: ['draft', 'active', 'completed'],
        default: 'draft',
    },
    eligibility: {
        type: String,
        enum: ['open', 'invite_only', 'blacklisted'],
        default: 'open',
    },
    allowedVoters: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    blockedVoters: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Election', electionSchema);
