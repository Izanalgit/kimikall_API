const mongoose = require('mongoose');

const preUserSchema = new mongoose.Schema({
  expireAt: {
    type: Date,
    default: new Date(),
    expires: 3600, // (60*60) 1h expires time
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  pswd: {
    type: String,
    required: true,
  },
  key: {
    type: String,
    required: true,
    unique: true,
  }

});

const PreUser = mongoose.model('preUser', preUserSchema);
module.exports = PreUser;