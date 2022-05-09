const req = require('express/lib/request');
const responseModel = require('../model/response_model.js');

module.exports = {
    recipeGetValidation : (req, res, next) => {
        let isValid = true;

        let recipeId = req.query.id;
        console.log(recipeId);

        if(!recipeId){
            isValid = false;
        }

        if(!isValid){
            return res.status(400).send(
                responseModel.internalErrorResponse("input is invalid")
            );
        }

        next();
    },
    recipeInputValidation : (req, res, next) =>{
        let isValid = true;
        let name = req.body.name;
        let imgUrl = req.body.img_url;
        let guide = req.body.guide;
        let time = req.body.approx_time_cook;
        let ingredientsName = req.body.ing_name;
        let ingredientsQty = req.body.ing_qty;
        let ingredientsPrice = req.body.ing_price;

        if(!name){
            isValid = false;
        }
        if(!imgUrl){
            isValid = false;
        }
        if(!guide){
            isValid = false;
        }
        if(!time){
            isValid = false;
        }
        if(!ingredientsName){
            req.body.ing_name = [];
        }
        if(!ingredientsQty){
            req.body.ing_qty = [];
        }
        if(!ingredientsPrice){
            req.body.ing_price = [];
        }

        if(ingredientsName.length !== ingredientsQty.length && ingredientsName.length !== ingredientsPrice.length){
            isValid = false;
        }

        if(!isValid){
            return res.status(400).send(
                responseModel.internalErrorResponse("input is invalid")
            );
        }

        next();
    },
    orderValidation: (req, res, next) => {
        let isValid = true;

        let address = req.body.address;
        let phone = req.body.phone;
        let deliveryFee =  req.body.delivery_fee;
        let totalPrice = req.body.total_price;
        let recipeId = req.body.recipe_id;

        if(!address){
            isValid = false;
        }
        if(!phone){
            isValid = false;
        }
        if(!deliveryFee){
            isValid = false;
        }
        if(!totalPrice){
            isValid = false;
        }
        if(!recipeId){
            isValid = false;
        }

        if(!isValid){
            return res.status(400).send(
                responseModel.internalErrorResponse("Input is not valid")
            );
        }

        next();
    },
    getOrderValidation: (req, res, next) => {
        let isValid = true;

        if(!req.query.order_id){
            isValid = false;
        }

        if(!isValid){
            return res.status(400).send(
                responseModel.internalErrorResponse("Input is not valid")
            );
        }

        next();
    },
    changeOrderStatusValidation: (req, res, next) => {
        let isValid = true;

        if(!req.body.order_id){
            isValid = false;
        }
        if(!req.body.new_status){
            isValid = false;
        }

        if(!isValid){
            return res.status(400).send(
                responseModel.internalErrorResponse("Input is not valid")
            );
        }

        next();
    }
}