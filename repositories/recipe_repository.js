const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');
const responseModel = require('../model/response_model.js');
const envDummy = require('../env_dummy.js');

const db = require('../lib/db.js');

const insertRecipe = async (req, res, next) => {

    let name = req.body.name;
    let imgUrl = req.body.img_url;
    let guide = req.body.guide;
    let time = req.body.approx_time_cook;
    let recipeOrder = req.body.recipe_order_count;

    let ingredients = req.body.ingredients;

    let resultRecipe = db.query(`INSERT INTO recipe VALUES(null, ${name}, ${imgUrl}, ${guide}, ${time}, ${recipeOrder})`, (err, result) => {
        if(err){

        }

        
    });
}

module.exports = {
    insertRecipe
}