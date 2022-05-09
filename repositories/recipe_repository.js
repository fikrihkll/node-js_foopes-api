const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');
const responseModel = require('../model/response_model.js');
const envDummy = require('../env_dummy.js');

const db = require('../lib/db.js');

const insertRecipe = (req, res, next) => {

    let name = req.body.name;
    let imgUrl = req.body.img_url;
    let guide = req.body.guide;
    let time = req.body.approx_time_cook;
    let recipeOrder = req.body.recipe_order_count;

    let ingredientsName = req.body.ing_name;
    let ingredientsQty = req.body.ing_qty;
    let ingredientsPrice = req.body.ing_price;

    db.query(`INSERT INTO recipe VALUES(0, '${name}', '${imgUrl}', '${guide}', '${time}', ${recipeOrder})`, (err, result) => {
        if(err){
            console.log(err);
            return res.status(500).send(
                responseModel.internalErrorResponse(err)
            );
        }

        let ingredientsValue = [];
        for(let i=0; i<ingredientsName.length; i++){
            ingredientsValue.push([0, result.insertId, ingredientsName[i], ingredientsQty[i], ingredientsPrice[i]]);
        }
        
        console.log(ingredientsValue);

        db.query(`INSERT INTO ingredient VALUES ?`, [ingredientsValue], (err, ingResult) => {
            if(err){
                console.log(err);
                return res.status(500).send(
                    responseModel.internalErrorResponse(err)
                );
            }

            return res.status(200).send(
                responseModel.normalResponse(
                    true,
                    'Success Insert',
                    req.body
                )  
            );
        });
        
    });
}

const getListRecipe = (req, res, next) => {

    db.query(`SELECT * FROM recipe`, (err, result) => {
        if(err){
            console.log(err);
            return res.status(500).send(
                responseModel.internalErrorResponse(err)
            );
        }

        return res.status(200).send(
            responseModel.normalResponse(
                true,
                "recipe fetched",
                result
            )  
        );
        
    });
}

const getRecipe = (req, res, next) => {

    let recipeId = req.query.id;

    db.query(`SELECT * FROM recipe WHERE id = ${recipeId}`, (err, result) => {
        if(err){
            console.log(err);
            return res.status(500).send(
                responseModel.internalErrorResponse(err)
            );
        }

        if(result.length === 0){
            return res.status(200).send(
                responseModel.normalResponse(
                    false,
                    "not found",
                    {}
                )
            );
        }

        let recipe = result[0];

        db.query(`SELECT * FROM ingredient WHERE recipe_id = ${recipeId}`, (err, resultIng) => {
            
            recipe['ingredients'] = resultIng;
            
            return res.status(200).send(
                responseModel.normalResponse(
                    true,
                    "recipe fetched",
                    recipe
                )  
            );
        });

        
        
    });
}

const getListOrder = (req, res, next) => {

    let userId = req.userData.id;

    db.query(`SELECT * FROM order_data INNER JOIN recipe ON recipe.id = order_data.recipe_id AND order_data.user_id = ${userId} ORDER BY order_data.order_date DESC`, (err, result) => {
        if(err){
            console.log(err);
            return res.status(500).send(
                responseModel.internalErrorResponse(err)
            );
        }

        return res.status(200).send(
            responseModel.normalResponse(
                true,
                "Order list fetched",
                result
            )  
        );
        
    });
}

const orderRecipe = (req, res, next) => {
    let address = req.body.address;
    let phone = req.body.phone;
    let deliveryFee =  req.body.delivery_fee;
    let totalPrice = req.body.total_price;
    let recipeId = req.body.recipe_id;
    let userId = req.userData.id;

    db.query(`INSERT INTO order_data VALUES(0, '${address}', '${phone}', ${recipeId}, ${userId}, NOW(), 'WAITING CONFIRMATION', ${totalPrice}, ${deliveryFee})`, (err, result) => {
        if(err){
            console.log(err);
            return res.status(500).send(
                responseModel.internalErrorResponse(err)
            );
        }

        return res.status(200).send(
            responseModel.normalResponse(
                true,
                "Order created successfully",
                result
            )
        );
    });
}



const getOrder = (req, res, next) => {

    let orderId = req.query.order_id;

    db.query(`SELECT * FROM order_data WHERE id = ${orderId}`, (err, result) => {
        if(err){
            console.log(err);
            return res.status(500).send(
                responseModel.internalErrorResponse(err)
            );
        }

        if(result.length === 0){
            return res.status(200).send(
                responseModel.normalResponse(
                    false,
                    "not found",
                    {}
                )
            );
        }

        let order = result[0];

        db.query(`SELECT * FROM ingredient WHERE recipe_id = ${order.recipe_id}`, (err, resultIng) => {
            
            order['items'] = resultIng;
            
            return res.status(200).send(
                responseModel.normalResponse(
                    true,
                    "Order fetched",
                    order
                )  
            );
        });

        
        
    });
}

const changeOrderStatus = (req, res, next) => {

    let orderId = req.body.order_id;
    let newStatus = req.body.new_status;

    db.query(`UPDATE order_data SET status = '${newStatus}' WHERE id = ${orderId}`, (err, result) => {
        if(err){
            console.log(err);
            return res.status(500).send(
                responseModel.internalErrorResponse(err)
            );
        }

        return res.status(200).send(
            responseModel.normalResponse(
                true,
                "status changed",
                result
            )  
        );
        
    });
}

module.exports = {
    insertRecipe,
    getListRecipe,
    getRecipe,
    orderRecipe,
    getOrder,
    getListOrder,
    changeOrderStatus
}