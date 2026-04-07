const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.js');

const { 
  recordConsent, 
  withdrawConsent, 
  fileGrievance, 
  getConsents,
  getGrievances,
  updateGrievanceStatus     // ← Make sure this is imported
} = require('../controllers/consentController');

router.post('/record', auth, recordConsent);
router.post('/withdraw', auth, withdrawConsent);
router.post('/grievance', auth, fileGrievance);
router.get('/', auth, getConsents);
router.get('/grievances', auth, getGrievances);
router.put('/grievance/:id', auth, updateGrievanceStatus);   // ← This line is now correct

module.exports = router;