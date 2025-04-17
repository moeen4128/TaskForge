const express = require('express');
const { createTeam, updateTeam, deleteTeam, getTeam,getAllTeam} = require('../controllers/teamController');
const router = express.Router();
const auth = require('../middlewares/auth');
const checkRole = require('../middlewares/checkRole'); // Your role-based authorization middleware

router.post('/', auth, checkRole('admin'), createTeam); // Create team
router.put('/:teamId', auth, checkRole('admin'), updateTeam); // Update team
router.delete('/:teamId', auth, checkRole('admin'), deleteTeam); // Delete team
router.get('/:teamId', auth, checkRole('admin', 'manager'), getTeam); // Get team by ID
router.get('/', auth, checkRole('admin', 'manager'), getAllTeam); // Get team by ID

module.exports = router;
