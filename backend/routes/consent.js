const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.js');
const { recordConsent, withdrawConsent, fileGrievance, getConsents } = require('../controllers/consentController');

router.post('/record', auth, recordConsent);
router.post('/withdraw', auth, withdrawConsent);
router.post('/grievance', auth, fileGrievance);
router.get('/', auth, getConsents);

module.exports = router;