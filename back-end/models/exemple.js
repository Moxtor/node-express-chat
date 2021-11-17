const mongoose = require('mongoose');

const MessageSchema = mongoose.Schema({
  Id: { type: String, required: true },
  timestamp : {type : String, required: true },
  msg: { type: String, required: true },
});

module.exports = mongoose.model('Message', MessageSchema);