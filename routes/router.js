const express = require('express');
const router = express.Router();

const responseModel = require('../model/response_model.js');

const userMiddleware = require('../middleware/users.js');
const recipeMiddleware = require('../middleware/recipe.js');

const userRepository = require('../repositories/user_repository.js');
const recipeRepository = require('../repositories/recipe_repository.js');

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
                gift: 'hohoho'
            }
        )
    )
});

// http:/localhost:3000/api/logout
router.get('/logout', userMiddleware.isLoggedIn, (req, res, next) => {
    userRepository.logout(req, res, next);
});

// http:/localhost:3000/api/insert-recipe
router.post('/insert-recipe', userMiddleware.isLoggedIn, recipeMiddleware.recipeInputValidation, (req, res, next) => {
    recipeRepository.insertRecipe(req, res, next);
});

// http:/localhost:3000/api/get-list-recipt
router.get('/get-recipe', (req, res, next) => {
    recipeRepository.getListRecipe(req, res, next);
});

// http:/localhost:3000/api/recipe?id={id}
router.get('/recipe', recipeMiddleware.recipeGetValidation, (req, res, next) => {
    recipeRepository.getRecipe(req, res, next);
});

// http:/localhost:3000/api/order
router.post('/order', userMiddleware.isLoggedIn, recipeMiddleware.orderValidation, (req, res, next) => {
    recipeRepository.orderRecipe(req, res, next);
});

// http:/localhost:3000/api/order/get-list
router.get('/order/get-list', userMiddleware.isLoggedIn, (req, res, next) => {
    recipeRepository.getListOrder(req, res, next);
});

// http:/localhost:3000/api/order/get
router.get('/order/get', userMiddleware.isLoggedIn, recipeMiddleware.getOrderValidation, (req, res, next) => {
    recipeRepository.getOrder(req, res, next);
});

// http:/localhost:3000/api/order/update-status
router.patch('/order/update-status', userMiddleware.isLoggedIn, recipeMiddleware.changeOrderStatusValidation, (req, res, next) => {
    recipeRepository.changeOrderStatus(req, res, next);
});

module.exports = router;