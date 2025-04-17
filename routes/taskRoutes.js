const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const checkRole = require('../middlewares/checkRole');
const {
  createTask,
  getAllTasks,
  getTasksByProject,
  updateTask,
  deleteTask,
  changeTaskStatus,
} = require('../controllers/taskController');

// Routes for tasks with role-based access control
router.post('/', auth, checkRole('admin', 'manager'), createTask);
router.get('/', auth, checkRole('admin', 'manager', 'employee'), getAllTasks);
router.get('/:projectId', auth, checkRole('admin', 'manager', 'employee'), getTasksByProject);
router.put('/:taskId', auth, checkRole('admin', 'manager'), updateTask);
router.delete('/:taskId', auth, checkRole('admin', 'manager'), deleteTask);
router.put('/changeTaskStatus/:taskId', auth, checkRole('admin', 'manager'), changeTaskStatus);

module.exports = router;
