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
  read: {
    type: Boolean,
    default: false,
  },
  iv:{
    type: String
  },
  messageTextRemit: {
    type: String,
    required: true
  },
  ivRemit:{
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
  const {encryptedData:dataRemit, iv:ivRemit} = encryptText(message.messageTextRemit);

  if (!iv || !ivRemit) {
    return next(new Error('IV generation failed'));
  }

  message.messageText = encryptedData;
  message.iv = iv;

  message.messageTextRemit = dataRemit;
  message.ivRemit = ivRemit;

  next();
})

messageSchema.methods.decryptMessage = function() {
  return decryptText(this.messageText, this.iv);
}
messageSchema.methods.decryptMessageRemit = function() {
  return decryptText(this.messageTextRemit, this.ivRemit);
}

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;