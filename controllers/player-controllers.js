const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');


const HttpError = require('../models/http-error');
const Player = require('../models/Player');

const register = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed.', 422)
        );
    }
    const { username } = req.body;

    let existingPlayer
    try {
        existingPlayer = await Player.findOne({ username: username })
    } catch (err) {
        const error = new HttpError(
            'Registering failed, please try again later.',
            500
        );
        return next(error);
    }

    if (existingPlayer) {
        const error = new HttpError(
            'Player exists already, please login instead.',
            422
        );
        return next(error);
    }

    const registeredPlayer = new Player({
        username
    });

    try {
        await registeredPlayer.save();
    } catch (err) {
        const error = new HttpError(
            'Registering failed, please try again.',
            500
        );
        return next(error);
    }

    let token;
    try {
        token = jwt.sign(
            { playerId: registeredPlayer._id, username: registeredPlayer.username },
            process.env.JWT_KEY,
            { expiresIn: '1h' }
        );
    } catch (err) {
        const error = new HttpError(
            'Signing up failed, please try again later.',
            500
        );
        return next(error);
    }

    res.status(201).json({ playerId: registeredPlayer._id, username: registeredPlayer.username, token: token });

};


const login = async (req, res, next) => {
    const { username } = req.body;

    let existingPlayer;

    try {
        existingPlayer = await Player.findOne({ username: username })
    } catch (err) {
        const error = new HttpError(
            'Logging in failed, please try again later.',
            500
        );
        return next(error);
    }

    if (!existingPlayer) {
        const error = new HttpError(
            'Invalid credentials, could not log you in.',
            403
        );
        return next(error);
    }

    let token;
    try {
        token = jwt.sign(
            { playerId: existingPlayer._id, username: existingPlayer.username },
            process.env.JWT_KEY,
            { expiresIn: '1h' }
        );
    } catch (err) {
        const error = new HttpError(
            'Logging in failed, please try again later.',
            500
        );
        return next(error);
    }

    res.json({ playerId: existingPlayer._id, username: existingPlayer.username, token: token });
};

exports.register = register;
exports.login = login;