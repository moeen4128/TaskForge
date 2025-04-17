// const Notification = require('../models/Notification');

// // Create a notification
// exports.createNotification = async (req, res) => {
//   try {
//     const { recipient, message, link } = req.body;

//     const notification = new Notification({
//       recipient,
//       message,
//       link
//     });

//     await notification.save();
//     res.status(201).json(notification);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Get all notifications for a user
// exports.getUserNotifications = async (req, res) => {
//   try {
//     const userId = req.params.userId;

//     const notifications = await Notification.find({ recipient: userId }).sort({ createdAt: -1 });
//     res.status(200).json(notifications);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Mark notification as read
// exports.markAsRead = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const notification = await Notification.findById(id);
//     if (!notification) return res.status(404).json({ message: 'Notification not found' });

//     notification.isRead = true;
//     await notification.save();

//     res.status(200).json(notification);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


const Notification = require('../models/Notification');

exports.getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user.id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findById(id);
    if (!notification) return res.status(404).json({ message: 'Notification not found' });

    notification.read = true;
    await notification.save();
    res.json({ message: 'Marked as read' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update notification' });
  }
};
