const Score = require('../models/Score');

const scoreController = {};

scoreController.saveScore = async (req, res, next) => {
    const { player, score, wpm, difficulty } = req.body;

    try {
        const newScore = await Score.create({ player, score, wpm, difficulty });
        res.locals.savedScore = newScore;
        return next();
    } catch (err) {
        return next ({
            log: 'Error in scoreController.saveScore',
            status: 500,
            message: { err: 'Failed to save score' },
        });
    }
};

scoreController.getScores = async (req, res, next) => {
    try {
        const scores = await Score.find().sort({ score: -1}).limit(10);
        const recentScores = await Score.find().sort({ createdAt: -1 }).limit(10);
        res.locals.topScores = { topScores: scores, recentScores: recentScores };
        return next();
    } catch (err) {
        return next({
            log: 'Error in scoreController.getScores',
            status: 500, 
            message: { err: 'Failed to fetch scores' },
        });
    }
};

module.exports = scoreController;