const mongoose = require('mongoose');
const teamSchem = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    members: [
        {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        role: {
            type: String,
            enum: ['admin', 'member'],
            default: 'member',
        },
    }],
    });

    module.exports = mongoose.model('Team', teamSchem);