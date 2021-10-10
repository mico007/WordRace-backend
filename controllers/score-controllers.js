const { validationResult } = require('express-validator');


const HttpError = require('../models/http-error');
const Score = require('../models/Score');

const getAllScore = async (req, res, next) => {

    let sum = 0;
    let averageScore;
    let maxLevel = 0;

    const promises = [
        Score.find({}).populate("player").sort({ finalScore: -1 }).exec(),
        Score.countDocuments({}).exec(),
    ];
    Promise.all(promises).then(([scores, totalScore]) => {

        //calculating average of score
        scores.forEach(score => {
            sum += score.finalScore;
        });
        averageScore = sum / totalScore;

        //finding max level reached
        for (let i = 0; i < scores.length; i++) {
            if (scores[i].level > maxLevel) {
                maxLevel = scores[i].level;
            }
        }

        res.json({ scores: scores, gamesPlayed: totalScore, averageScore: averageScore.toFixed(1), maxLevel: maxLevel });

    })
}

const saveScore = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed.', 422));
    }

    const { finalScore, multiplier, level, gamesPlayed } = req.body;

    const savedScore = new Score({
        player: req.playerData.playerId,
        finalScore,
        multiplier,
        level,
        gamesPlayed
    })

    try {
        await savedScore.save();
    } catch (err) {
        const error = new HttpError(
            'Saving score failed, please try again.',
            500
        );
        return next(error);
    }

    res.status(201).json({ score: savedScore });
}

exports.saveScore = saveScore;
exports.getAllScore = getAllScore;