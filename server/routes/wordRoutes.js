const express = require('express');
const router = express.Router();
const wordController = require('../controllers/wordController');

router.get('/list', wordController.getFullList);  // ← new route
router.get('/lists', wordController.listWordFiles);

module.exports = router;
