// const express = require('express');
// const router = express.Router();
// const notificationController = require('../controllers/notificationController');

// // Create
// router.post('/', notificationController.createNotification);

// // Get for a specific user
// router.get('/:userId', notificationController.getUserNotifications);

// // Mark as read
// router.put('/read/:id', notificationController.markAsRead);

// module.exports = router;


const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { getUserNotifications, markAsRead } = require('../controllers/notificationController');

router.get('/', auth, getUserNotifications);
router.patch('/:id/read', auth, markAsRead);

module.exports = router;
