// const mongoose = require('mongoose');
// const taskSchema = new mongoose.Schema({
//     title: {
//       type: String,
//       required: true,
//     },
//     description: String,
//     status: {
//       type: String,
//       enum: ['todo', 'in-progress', 'done'],
//       default: 'todo',
//     },
//     project: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Project',
//       required: true,
//     },
//     assignedTo: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//     },
//     dueDate: Date,
//     createdBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//     },
//     createdAt: {
//       type: Date,
//       default: Date.now,
//     },
//   });
  
//   module.exports = mongoose.model('Task', taskSchema);
  
// const mongoose = require('mongoose');

// const taskSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//   },
//   description: String,
//   status: {
//     type: String,
//     enum: ['todo', 'in-progress', 'done'],
//     default: 'todo',
//   },
//   project: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Project',
//     required: true,
//   },
//   assignedTo: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//   },
//   dueDate: Date,
//   createdBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,  // Ensuring 'createdBy' field is always populated
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// // Virtual property to check task's user role (could be expanded for role-related logic)
// taskSchema.virtual('isAssigned').get(function () {
//   return this.assignedTo !== null;
// });

// // Static method for pagination, search, and filtering
// taskSchema.statics.paginateTasks = async function (filters = {}, page = 1, limit = 10, search = '') {
//   const query = { ...filters };

//   // Search Logic
//   if (search) {
//     query.$or = [
//       { title: { $regex: search, $options: 'i' } },
//       { description: { $regex: search, $options: 'i' } },
//     ];
//   }

//   // Pagination logic
//   const tasks = await this.find(query)
//     .populate('assignedTo', 'name email')
//     .populate('createdBy', 'name email')
//     .skip((page - 1) * limit)
//     .limit(Number(limit))
//     .sort({ createdAt: -1 }); // Sorting by latest createdAt

//   const totalTasks = await this.countDocuments(query); // Count total matching tasks
//   const totalPages = Math.ceil(totalTasks / limit);

//   return { tasks, pagination: { currentPage: page, totalPages, totalTasks, limit } };
// };

// module.exports = mongoose.model('Task', taskSchema);


const mongoose = require('mongoose');
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  status: {
    type: String,
    enum: ['todo', 'in-progress', 'done'],
    default: 'todo',
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false, // Optional initially, can be changed to required if needed
  },
  dueDate: {
    type: Date,
    validate: {
      validator: function(value) {
        return value >= Date.now(); // Ensure dueDate is not in the past
      },
      message: 'Due date must be in the future',
    },
  },
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

// Virtual property to check if the task is assigned
taskSchema.virtual('isAssigned').get(function() {
  return this.assignedTo !== null;
});

// Static method for pagination, search, and filtering
taskSchema.statics.paginateTasks = async function(filters = {}, page = 1, limit = 10, search = '') {
  const query = { ...filters };

  // Search Logic
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  // Pagination logic
  const tasks = await this.find(query)
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email')
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  const totalTasks = await this.countDocuments(query);
  const totalPages = Math.ceil(totalTasks / limit);

  return { tasks, pagination: { currentPage: page, totalPages, totalTasks, limit } };
};

// Indexing the 'project' and 'status' fields to improve query performance
taskSchema.index({ project: 1, status: 1 });

module.exports = mongoose.model('Task', taskSchema);
