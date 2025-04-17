const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const {
  createProject,
  getProjectsByTeam,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');

router.post('/', auth, createProject);
router.get('/:teamId', auth, getProjectsByTeam);
router.put('/:projectId', auth, updateProject);
router.delete('/:projectId', auth, deleteProject);

module.exports = router;
