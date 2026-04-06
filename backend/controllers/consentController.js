const Consent = require('../models/Consent.js');
const Grievance = require('../models/Grievance.js');

const recordConsent = async (req, res) => {
  try {
    const { cookieId, consentType, consentGiven } = req.body;
    const userId = req.user._id;

    const consent = await Consent.findOneAndUpdate(
      { userId, cookieId },
      { consentType, consentGiven, timestamp: Date.now() },
      { upsert: true, new: true }
    );

    res.json({ success: true, consent });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const withdrawConsent = async (req, res) => {
  try {
    const { consentId } = req.body;
    await Consent.findByIdAndUpdate(consentId, { consentGiven: false, withdrawnAt: Date.now() });
    res.json({ success: true, message: "Consent withdrawn" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const fileGrievance = async (req, res) => {
  try {
    const { subject, description } = req.body;
    const grievance = await Grievance.create({
      userId: req.user._id,
      subject,
      description
    });
    res.status(201).json({ success: true, grievance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getConsents = async (req, res) => {
  try {
    const consents = await Consent.find({ userId: req.user._id });
    res.json({ success: true, consents });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { recordConsent, withdrawConsent, fileGrievance, getConsents };