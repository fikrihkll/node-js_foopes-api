const jwt = require('jsonwebtoken');
const responseModel = require('../model/response_model.js');
const envDummy = require('../env_dummy.js');

module.exports = {
    validateRegister: (req, res, next) => {
        let message = [];
        let isValid = true;

        // username min length 3
        if(!req.body.email || req.body.email.length < 4){
            message.push('Email is required and not less than 4 chars');
            isValid = false;
        }
        // password min 6 chars
        if(!req.body.pass || req.body.pass.length < 6){
            message.push('Password is required and not less than 6 chars');
            isValid = false;
        }
        // name min 2 chars
        if(!req.body.name || req.body.name.length < 2){
            message.push('Name is required and not less than 2 chars');
            isValid = false;
        }

        // send response if it is not valid
        if(!isValid){
            return res.status(400).send({
                message: message
            });
        }
        next();
    },
    isLoggedIn: (req, res, next) => {
        const tokenCookie = req.cookies.access_token;
        const tokenAuth = req.headers.authorization;

        let token;
        if(tokenCookie){
            token = tokenCookie;
        }else if(tokenAuth){
            token = tokenAuth.split(' ')[1];
        }

        if(!token){
            return res.status(400).send(
                responseModel.normalResponse(
                    false,
                    "session is invalid",
                    {}
                )
            );
        }
        try{
            let decode = jwt.verify(token, process.env.JWT_SECRET || envDummy.JWT_SECRET);

            req.userData = decode;
            next();
        }catch(e){
            return res.status(400).send(
                responseModel.responseModel.normalResponse(
                    false,
                    "session is over",
                    {}
                )
            );
        }
    }
}