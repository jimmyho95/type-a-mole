const express = require('express');
const scoreController = require('../controllers/scoreController');

const router = express.Router();

//POST for scores

router.post('/', scoreController.saveScore, (req, res) => {
    return res.status(201).json(res.locals.savedScore);
});

router.get ('/', scoreController.getScores, (req, res) => {
    return res.status(200).json(res.locals.topScores);
});

module.exports = router;