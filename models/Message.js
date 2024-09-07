const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  remit: {
    type: mongoose.ObjectId,
    required: true,
  },
  recep: {
    type: mongoose.ObjectId,
    required: true,
  },
  messageText: {
    type: String,
    required: true,
  },
  timestamps: true
});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;