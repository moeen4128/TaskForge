// // const Task = require('../models/Task');
// // const Team = require('../models/Team');

// // exports.createTeamTask = async (req, res) => {
// //   try {
// //     const { title, description, assignedTo, dueDate, teamId, project } = req.body;

// //     const team = await Team.findById(teamId);
// //     if (!team) return res.status(404).json({ message: 'Team not found' });

// //     const task = new Task({
// //       title,
// //       description,
// //       assignedTo,
// //       dueDate,
// //       project
// //     });

// //     await task.save();

// //     res.status(201).json(task);
// //   } catch (error) {
// //     res.status(500).json({ message: 'Server error while creating team task' });
// //   }
// // };



// const Task = require('../models/Task');
// const Team = require('../models/Team');

// exports.createTeamTask = async (req, res) => {
//   try {
//     const { title, description, assignedTo, dueDate, teamId, project } = req.body;

//     const team = await Team.findById(teamId);
//     if (!team) return res.status(404).json({ message: 'Team not found' });

//     const task = await Task.create({ title, description, assignedTo, dueDate, project });
//     res.status(201).json(task);
//   } catch (err) {
//     res.status(500).json({ message: 'Server error while creating task' });
//   }
// };


const Notification = require('../models/Notification');

if (assignedTo) {
  await Notification.create({
    recipient: assignedTo,
    message: `You have been assigned a new task: "${title}"`,
    link: `/tasks/${task._id}`,
  });
}
