const express = require('express');
const { check } = require('express-validator');

const scoreController = require('../controllers/score-controllers');

const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.get("/", scoreController.getAllScore);

router.use(checkAuth);

router.post(
    '/',
    [
        check('finalScore').not().isEmpty()
    ],
    scoreController.saveScore
);

module.exports = router;