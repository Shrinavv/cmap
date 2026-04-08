const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.js');

const { 
  recordConsent, 
  withdrawConsent, 
  fileGrievance, 
  getConsents,
  getGrievances,
  updateGrievanceStatus,
  getAllGrievances 
} = require('../controllers/consentController');

router.post('/record', auth, recordConsent);
router.post('/withdraw', auth, withdrawConsent);
router.post('/grievance', auth, fileGrievance);
router.get('/', auth, getConsents);
router.get('/grievances', auth, getGrievances);
router.get('/admin/grievances', auth, getAllGrievances);
router.put('/grievance/:id', auth, updateGrievanceStatus);   // ← Important

module.exports = router;