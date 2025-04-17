// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const checkRole = require('../middlewares/checkRole');
const { getAllUsers } = require('../controllers/userController');

// Protect the route so only admin can access it
router.get('/', auth, checkRole(['admin']), getAllUsers);

module.exports = router;
