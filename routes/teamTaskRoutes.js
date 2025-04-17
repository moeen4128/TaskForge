const express = require('express');
const router = express.Router();
const teamTaskController = require('../controllers/teamTaskController');
// const auth = require('../middlewares/auth'); // Optional if using authentication

// Create task for team
router.post('/', /* auth, */ teamTaskController.createTeamTask);

// Get all tasks for a team
router.get('/:teamId', /* auth, */ teamTaskController.getTeamTasks);

// Update task status
router.put('/status/:taskId', /* auth, */ teamTaskController.updateTeamTaskStatus);

// Delete a task
router.delete('/:taskId', /* auth, */ teamTaskController.deleteTeamTask);

module.exports = router;
