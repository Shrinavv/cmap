const mongoose = require('mongoose');

const cookieSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  domain: String,
  name: String,
  value: String,
  expirationDate: String,
  secure: Boolean,
  httpOnly: Boolean,
  sameSite: String,
  syncedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Cookie', cookieSchema);