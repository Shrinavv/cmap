const Consent = require('../models/Consent.js');
const Grievance = require('../models/Grievance.js');
const nodemailer = require('nodemailer');

// Create email transporter
const transporter = nodemailer.createTransport({     // ← Fixed: createTransport (not createTransporter)
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

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
    await Consent.findByIdAndUpdate(consentId, { 
      consentGiven: false, 
      withdrawnAt: Date.now() 
    });
    res.json({ success: true, message: "Consent withdrawn" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const fileGrievance = async (req, res) => {
  try {
    let { domain, subject, description } = req.body;

    if (!domain || !subject || !description) {
      return res.status(400).json({ message: "Domain, subject and description are required" });
    }

    // Clean domain (remove leading dot if present)
    domain = domain.replace(/^\./, '').trim().toLowerCase();

    // Basic validation
    if (!domain || !domain.includes('.')) {
      return res.status(400).json({ message: "Please enter a valid domain (e.g. google.com)" });
    }

    const grievance = await Grievance.create({
      userId: req.user._id,
      domain,
      subject,
      description,
      status: 'notified'
    });

    // Try to send notification email (but don't fail the whole request if email fails)
    try {
      const possibleEmails = [
        `grievance@${domain}`,
        `dpo@${domain}`,
        `privacy@${domain}`,
        `support@${domain}`
      ].filter(email => email && email.includes('@') && !email.startsWith('@'));

      if (possibleEmails.length > 0) {
        await transporter.sendMail({
          from: `"Cookie CMP" <${process.env.EMAIL_USER}>`,
          to: possibleEmails,
          subject: `DPDP Act Grievance: ${subject} [${domain}]`,
          html: `
            <h3>Dear Grievance Officer / DPO,</h3>
            <p>A user has raised a grievance against your domain <strong>${domain}</strong> through our Consent Management Platform.</p>
            
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Description:</strong></p>
            <p>${description}</p>
            
            <p>Please respond as per the timelines prescribed under the DPDP Act, 2023.</p>
            <p><strong>Grievance ID:</strong> ${grievance._id}</p>
            
            <p>Best regards,<br><strong>Cookie CMP Dashboard</strong></p>
          `
        });
        console.log(`Grievance email sent for domain: ${domain}`);
      }
    } catch (emailError) {
      console.error("Email sending failed (non-blocking):", emailError.message);
      // We still save the grievance even if email fails
    }

    res.status(201).json({ 
      success: true, 
      grievance,
      message: `Grievance filed successfully for ${domain}. Notification attempt made to the website.` 
    });

  } catch (error) {
    console.error("fileGrievance error:", error);
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

const getGrievances = async (req, res) => {
  try {
    const grievances = await Grievance.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    res.json({ success: true, grievances });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADMIN - Update grievance status and/or reply
const updateGrievanceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, fiduciaryReply } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Grievance ID is required" });
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (fiduciaryReply !== undefined) updateData.fiduciaryReply = fiduciaryReply;
    updateData.repliedAt = Date.now();

    const grievance = await Grievance.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!grievance) {
      return res.status(404).json({ message: "Grievance not found" });
    }

    res.json({ 
      success: true, 
      message: "Grievance updated successfully",
      grievance 
    });
  } catch (error) {
    console.error("Update grievance error:", error);
    res.status(500).json({ message: error.message });
  }
};
// ADMIN ONLY - Get ALL grievances
const getAllGrievances = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const grievances = await Grievance.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, grievances });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  recordConsent, 
  withdrawConsent, 
  fileGrievance, 
  getConsents,
  getGrievances,
  updateGrievanceStatus,
  getAllGrievances     // ← Add this
};
