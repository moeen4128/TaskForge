const Team = require('../models/Team');
exports.createTeam = async (req, res) => {
    try {
        const { name } = req.body;
        const user = req.user;
        const team = await Team.create({
            name,
            members: [{ user: user._id, role: 'admin' }],
        });
        res.status(201).json({ team });
    } catch (err) {
        res.status(500).json({ message: 'Failed to create team', error: err.message });
    }
};
// Update Team
exports.updateTeam = async (req, res) => {
    try {
        const { teamId } = req.params; // teamId passed in the URL params
        const { name, members } = req.body; // New name or members to update
        const team = await Team.findById(teamId);

        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        // Update team properties
        if (name) team.name = name;
        if (members) team.members = members;

        await team.save();
        res.status(200).json({ message: 'Team updated successfully', team });
    } catch (err) {
        res.status(500).json({ message: 'Failed to update team', error: err.message });
    }
};

// Delete Team
exports.deleteTeam = async (req, res) => {
    try {
        const { teamId } = req.params; // teamId passed in the URL params
        const team = await Team.findByIdAndDelete(teamId);

        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        res.status(200).json({ message: 'Team deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete team', error: err.message });
    }
};

// Get Team by ID
exports.getTeam = async (req, res) => {
    try {
        const { teamId } = req.params; // teamId passed in the URL params
        const team = await Team.findById(teamId).populate('members.user'); // Populate the members with user details
        // const team = await Team.findById(teamId)
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        res.status(200).json({ team });
    } catch (err) {
        res.status(500).json({ message: 'Failed to get team', error: err.message });
    }
};

// Get All Teams 
exports.getAllTeam = async (req, res) => {
    try {
        const team = await Team.find();
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        res.status(200).json({ team });
    } catch (err) {
        res.status(500).json({ message: 'Failed to get team', error: err.message });
    }
};
