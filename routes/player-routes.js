const express = require('express');
const { check } = require('express-validator');

const playersController = require('../controllers/player-controllers');

const router = express.Router();

router.post(
    '/register',
    [
        check('username').isLength({ min: 4 })
    ],
    playersController.register
);

router.post('/login', playersController.login);

module.exports = router;