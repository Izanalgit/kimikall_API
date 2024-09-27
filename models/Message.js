const mongoose = require('mongoose');
const {encryptText,decryptText} = require('../utils/messageCrypto');

const messageSchema = new mongoose.Schema({
  remit: {
    type: mongoose.Schema.ObjectId,
    required: true  
  },
  recep: {
    type: mongoose.Schema.ObjectId,
    required: true
  },
  messageText: {
    type: String,
    required: true
  },
  iv:{
    type: String
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

//Encrypt/Decrypt messages

messageSchema.pre('save', function(next) {
  const message = this;

  const {encryptedData, iv} = encryptText(message.messageText);

  if (!iv) {
    return next(new Error('IV generation failed'));
  }

  message.messageText = encryptedData;
  message.iv = iv;

  next();
})

messageSchema.methods.decryptMessage = function() {
  return decryptText(this.messageText, this.iv);
}

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;