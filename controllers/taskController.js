// const Task = require('../models/Task');

// exports.createTask = async (req, res) => {
//   try {
//     const { title, description, status, projectId, assignedTo, dueDate } = req.body;
//  // Check if the user is an admin or manager for the project
//     if (req.user.role !== 'admin' && req.user.role !== 'manager') {
//       return res.status(403).json({ message: 'Forbidden: Only managers or admins can create tasks' });
//     }
//     const task = await Task.create({
//       title,
//       description,
//       status,
//       project: projectId,
//       assignedTo,
//       dueDate,
//       createdBy: req.user._id,
//     });

//     res.status(201).json({ task });
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to create task', error: err.message });
//   }
// };
// exports.getTasksByProject = async (req, res) => {
//     try {
//       const { projectId } = req.params;
  
//       // Managers can only see tasks from projects they are assigned to
//       if (req.user.role === 'manager') {
//         // Assuming a 'projects' field exists for the user that stores the projects the manager is assigned to
//         const user = await User.findById(req.user._id);
//         if (!user.projects.includes(projectId)) {
//           return res.status(403).json({ message: 'Forbidden: You do not have access to this project' });
//         }
//       }
  
//       const tasks = await Task.find({ project: projectId })
//         .populate('assignedTo', 'name email')
//         .populate('createdBy', 'name email');
//       res.status(200).json({ tasks });
//     } catch (err) {
//       res.status(500).json({ message: 'Failed to fetch tasks', error: err.message });
//     }
//   };
// exports.updateTask = async (req, res) => {
//     try {
//       const { taskId } = req.params;
//       const { title, description, status, assignedTo, dueDate } = req.body;
  
//       // Check if the user is allowed to update the task
//       const task = await Task.findById(taskId);
//       if (!task) {
//         return res.status(404).json({ message: 'Task not found' });
//       }
  
//       if (req.user.role === 'manager' && task.project.toString() !== req.user.projectId) {
//         return res.status(403).json({ message: 'Forbidden: Managers can only update tasks within their own projects' });
//       }
  
//       const updatedTask = await Task.findByIdAndUpdate(
//         taskId,
//         { title, description, status, assignedTo, dueDate },
//         { new: true }
//       );
  
//       res.status(200).json({ task: updatedTask });
//     } catch (err) {
//       res.status(500).json({ message: 'Failed to update task', error: err.message });
//     }
//   };
// exports.deleteTask = async (req, res) => {
//     try {
//       const { taskId } = req.params;
//       const task = await Task.findById(taskId);
//       if (!task) {
//         return res.status(404).json({ message: 'Task not found' });
//       }
  
//       // Managers can only delete tasks from their own projects
//       if (req.user.role === 'manager' && task.project.toString() !== req.user.projectId) {
//         return res.status(403).json({ message: 'Forbidden: Managers can only delete tasks from their own projects' });
//       }
  
//       await Task.findByIdAndDelete(taskId);
//       res.status(200).json({ message: 'Task deleted successfully' });
//     } catch (err) {
//       res.status(500).json({ message: 'Failed to delete task', error: err.message });
//     }
//   };

const Task = require('../models/Task');
const User = require('../models/User');

// 1. Create Task
exports.createTask = async (req, res) => {
  try {
    const { title, description, status, projectId, assignedTo, dueDate } = req.body;
    // Check if the user is an admin or manager for the project
    if (req.user.role !== 'admin' && req.user.role !== 'manager') {
      return res.status(403).json({ message: 'Forbidden: Only managers or admins can create tasks' });
    }
    const task = await Task.create({
      title,
      description,
      status,
      project: projectId,
      assignedTo,
      dueDate,
      createdBy: req.user._id,
    });

    res.status(201).json({ task });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create task', error: err.message });
  }
};
// Get all tasks
exports.getAllTasks = async (req, res) => {
    try {
      const tasks = await Task.find().populate('assignedTo', 'name email').populate('createdBy', 'name email');
      res.status(200).json({ tasks });
    } catch (err) {
      res.status(500).json({ message: 'Failed to retrieve tasks', error: err.message });
    }
  };
// 2. Get Tasks by Project with Pagination, Search and Filter
exports.getTasksByProject = async (req, res) => {
    try {
      const { projectId } = req.params;
      const { page = 1, limit = 10, search = '', status = '', assignedTo = '' } = req.query;
  
      // Managers can only see tasks from projects they are assigned to
      if (req.user.role === 'manager') {
        const user = await User.findById(req.user._id);
        if (!user.projects.includes(projectId)) {
          return res.status(403).json({ message: 'Forbidden: You do not have access to this project' });
        }
      }
  
      // Build query for searching, filtering, and pagination
      let query = { project: projectId };
  
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ];
      }
  
      if (status) {
        query.status = status;
      }
  
      if (assignedTo) {
        query.assignedTo = assignedTo;
      }
  
      // Pagination logic
      const tasks = await Task.find(query)
        .populate('assignedTo', 'name email')
        .populate('createdBy', 'name email')
        .skip((page - 1) * limit)
        .limit(Number(limit));
  
      const totalTasks = await Task.countDocuments(query); // Get total tasks for pagination info
      const totalPages = Math.ceil(totalTasks / limit);
  
      res.status(200).json({
        tasks,
        pagination: {
          currentPage: page,
          totalPages,
          totalTasks,
          limit,
        },
      });
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch tasks', error: err.message });
    }
  };
// 3. Update Task
exports.updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, description, status, assignedTo, dueDate } = req.body;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if the user is allowed to update the task
    if (req.user.role === 'manager' && task.project.toString() !== req.user.projectId) {
      return res.status(403).json({ message: 'Forbidden: Managers can only update tasks within their own projects' });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { title, description, status, assignedTo, dueDate },
      { new: true }
    );

    res.status(200).json({ task: updatedTask });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update task', error: err.message });
  }
};

// 4. Delete Task
exports.deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Managers can only delete tasks from their own projects
    if (req.user.role === 'manager' && task.project.toString() !== req.user.projectId) {
      return res.status(403).json({ message: 'Forbidden: Managers can only delete tasks from their own projects' });
    }

    await Task.findByIdAndDelete(taskId);
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete task', error: err.message });
  }
};

// 5. Assign Task to a User
exports.assignTask = async (req, res) => {
  try {
    const { taskId, userId } = req.body;
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if the user is allowed to assign tasks (Admin or Manager)
    if (req.user.role !== 'admin' && req.user.role !== 'manager') {
      return res.status(403).json({ message: 'Forbidden: Only managers or admins can assign tasks' });
    }

    task.assignedTo = userId;
    await task.save();
    res.status(200).json({ message: 'Task assigned successfully', task });
  } catch (err) {
    res.status(500).json({ message: 'Failed to assign task', error: err.message });
  }
};

// 6. Change Task Status
exports.changeTaskStatus = async (req, res) => {
    try {
      const { taskId, status } = req.body;
      const task = await Task.findById(taskId);  
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
  
      // Ensure the status is valid
      const validStatuses = ['todo', 'in-progress', 'done'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid task status' });
      }
  
      task.status = status;
      await task.save();
      res.status(200).json({ message: 'Task status updated successfully', task });
    } catch (err) {
      res.status(500).json({ message: 'Failed to change task status', error: err.message });
    }
  };
  

// 7. Set Due Date
exports.setDueDate = async (req, res) => {
  try {
    const { taskId, dueDate } = req.body;
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.dueDate = dueDate;
    await task.save();
    res.status(200).json({ message: 'Due date set successfully', task });
  } catch (err) {
    res.status(500).json({ message: 'Failed to set due date', error: err.message });
  }
};

// 8. Get Task Details
exports.getTaskDetails = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json({ task });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch task details', error: err.message });
  }
};

// 9. Get Tasks Assigned to a User
exports.getTasksByAssignedUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const tasks = await Task.find({ assignedTo: userId })
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');
    res.status(200).json({ tasks });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch tasks', error: err.message });
  }
};
