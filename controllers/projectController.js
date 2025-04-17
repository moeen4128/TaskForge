const Project = require('../models/Project');

exports.createProject = async (req, res) => {
  try {
    const { name, description, teamId } = req.body;

    const project = await Project.create({
      name,
      description,
      team: teamId,
      createdBy: req.user._id,
    });

    res.status(201).json({ project });
  } catch (err) {
    res.status(500).json({ message: 'Project creation failed', error: err.message });
  }
};

exports.getProjectsByTeam = async (req, res) => {
  try {
    const { teamId } = req.params;
    const projects = await Project.find({ team: teamId }).populate('createdBy', 'name email');
    res.status(200).json({ projects });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving projects', error: err.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { name, description } = req.body;

    const updated = await Project.findByIdAndUpdate(
      projectId,
      { name, description },
      { new: true }
    );

    res.status(200).json({ project: updated });
  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    await Project.findByIdAndDelete(projectId);
    res.status(200).json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed', error: err.message });
  }
};
