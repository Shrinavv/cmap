const mongoose = require('mongoose');

const consentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cookieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cookie' },
  consentType: { type: String, enum: ['necessary','analytics','marketing','preferences'], default: 'necessary' },
  consentGiven: { type: Boolean, default: true },
  withdrawnAt: Date,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Consent', consentSchema);