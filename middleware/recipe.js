const responseModel = require('../model/response_model.js');

module.exports = {
    recipeInputValidation : (req, res, next) =>{
        let isValid = true;
        let name = req.body.name;
        let imgUrl = req.body.img_url;
        let guide = req.body.guide;
        let time = req.body.approx_time_cook;
        let ingredients = req.body.ingredients;

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
        if(!ingredients){
            req.ingredients = [];
        }

        if(!isValid){
            return res.status(400).send(
                responseModel.internalErrorResponse("input is invalid")
            );
        }

        next();
    }
}