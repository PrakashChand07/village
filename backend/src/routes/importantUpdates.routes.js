const express = require('express');
const router = express.Router();
const { getImportantUpdates } = require('../controllers/importantUpdatesController');

// Public route
router.get('/', getImportantUpdates);

module.exports = router;
