const express = require('express');
const router = express.Router();

const responseModel = require('../model/response_model.js');

const userMiddleware = require('../middleware/users.js');

const userRepository = require('../repositories/user_repository.js');

// http:/localhost:3000/api/register
router.post('/register', userMiddleware.validateRegister, (req, res, next) => {
    userRepository.register(req, res, next);
});

// http:/localhost:3000/api/login
router.post('/login', (req, res, next) => {
    userRepository.login(req, res, next);
});

// http:/localhost:3000/api/secret-route
router.get('/secret-route', userMiddleware.isLoggedIn, (req, res, next) => {
    return res.status(200).send(
        responseModel.normalResponse(
            true,
            "what do you want?",
            {
                gift: 'fuck u bitch'
            }
        )
    )
});

// http:/localhost:3000/api/logout
router.get('/logout', userMiddleware.isLoggedIn, (req, res, next) => {
    userRepository.logout(req, res, next);
});


module.exports = router;