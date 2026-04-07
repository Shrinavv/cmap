const mongoose = require('mongoose');

const grievanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  domain: { type: String, required: true },
  subject: { type: String, required: true },
  description: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['notified', 'resolved', 'rejected'], 
    default: 'notified' 
  },
  fiduciaryReply: { type: String, default: '' },     // ← NEW
  repliedAt: { type: Date },                         // ← NEW
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Grievance', grievanceSchema);