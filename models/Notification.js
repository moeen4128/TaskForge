// const mongoose = require('mongoose');

// const notificationSchema = new mongoose.Schema({
//   recipient: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//   },
//   message: {
//     type: String,
//     required: true,
//   },
//   isRead: {
//     type: Boolean,
//     default: false,
//   },
//   link: String, // optional — e.g. task or project link
// }, { timestamps: true });

// module.exports = mongoose.model('Notification', notificationSchema);



const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  link: String,
  read: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
