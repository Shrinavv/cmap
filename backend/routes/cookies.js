const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.js');
const { syncCookies, getUserCookies } = require('../controllers/cookieController.js');

router.post('/sync', auth, syncCookies);
router.get('/', auth, getUserCookies);

module.exports = router;