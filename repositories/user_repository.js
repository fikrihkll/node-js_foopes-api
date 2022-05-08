const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');
const responseModel = require('../model/response_model.js');
const envDummy = require('../env_dummy.js');

const db = require('../lib/db.js');

const login = (req, res, next) => {
    let email = req.body.email;
    let pass = req.body.pass;

    db.query(`SELECT * FROM user WHERE email = '${email}'`, (err, result) => {
        if(err){
            return res.status(400).send({
                message: err
            });
        }
        if(!result.length){
            return res.status(200).send(
                responseModel.normalResponse(false, 'email or password incorrect', {})
            );
        }

        let passFromDb = result[0].pass;

        bcrypt.compare(pass, passFromDb, (bErr, bResult) =>{
            if(bErr){ // error compare
                return res.status(500).send(responseModel.normalResponse(false, "email or password incorrect", {}));
            }else{ 
                if(bResult){ // pass match
                    let token = jwt.sign(
                        {
                            email: result[0].email,
                            id: result[0].id
                        },
                        process.env.JWT_SECRET || envDummy.JWT_SECRET,
                        {expiresIn: "7d"}
                    )
                    let data = result[0];
                    data['token'] = token;
                    return res
                    .cookie(
                        "access_token",
                        token,
                        {
                            httpOnly: true,
                            secure: process.env.NODE_ENV === 'prod' || envDummy.NODE_ENV === 'prod'
                        }
                     )
                    .status(200).send(
                        responseModel.normalResponse(true, "Login Success", data)
                    );
                }

                return res.status(200).send(responseModel.normalResponse(false, "email or password incorrect", {}));
            }
        });
    });
}

const register = (req, res, next) => {
    let email = req.body.email;
    let pass = req.body.pass;
    let name = req.body.name;
    let address = req.body.address;
    let phone = req.body.phone;

    // Check email
    db.query(`SELECT * FROM user WHERE email = '${email}'`, (err, result) => {
        if(result.length){ // email is already used
            return res.status(409).send(responseModel.normalResponse(false, "email is already used", {}));
        }else{
            // Encrypt pass
            bcrypt.hash(pass, 10, (err, hash) => {
                if(err){ // error encrypted
                    return res.status(500).send(responseModel.internalErrorResponse(err));
                }else{
                    // Insert data
                    db.query(`INSERT INTO user VALUES(null, '${uuid.v4()}', '${email}', '${hash}', '${name}', '${address}', '${phone}')`,
                    (err, result) => {
                        if(err){ // error insert
                            return res.status(500).send(responseModel.internalErrorResponse(err));
                        }
                        return res.status(201).send(
                            responseModel.normalResponse(
                                true, 
                                "Register Success!",
                                req.body
                            )
                        );
                    });
                }
            })
        }
    });
}

const logout = (req, res, next) => {
    return res
    .clearCookie("access_token")
    .status(200)
    .send(
        responseModel.normalResponse(
            true,
            "Successfully logged out 😏 🍀",
            {}));
}

module.exports = {
    login,
    register,
    logout
}