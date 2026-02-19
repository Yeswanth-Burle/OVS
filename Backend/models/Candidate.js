const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
    },
    party: {
        type: String,
        required: [true, 'Please add a party name'],
    },
    electionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Election',
        required: true,
    },
    image: {
        type: String,
        default: 'no-photo.jpg',
    },
    voteCount: {
        type: Number,
        default: 0,
    },
});

module.exports = mongoose.model('Candidate', candidateSchema);
