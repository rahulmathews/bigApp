"use-strict"

const jwt       = require("jsonwebtoken");
const  _        = require("lodash");
const boom      = require("boom");

const config     = require("../config/config");
const Account    = require("../model/Account");

var authenticateToken = function(req, res, next){
    var token = req.headers.authorization;
    if(!token){
        return res.status(401).send({success : false, message : "No token provided"});
    }
    
    token = token.slice(7, token.length);// remove Bearer
    jwt.verify(token, config.secretKey, function(err, result) {
        if(err){
            return res.status(500).send({success : false, message: "Failed to authenticate token"});
        }
        req.userIdFromLoginToken = result.id 
        return next();
    });
}

var authorizeToken = function(req, res, next){ // obtain role from the model and only allow when role is admin
    if(_.isNil(req.userIdFromLoginToken)){
        var error = new boom("Invalid Token data", {
            statusCode : 400
        })
        return next(error);
    }
    Account.findById(req.userIdFromLoginToken)
    .then(function(doc){
        if(!doc){
            var error = new boom("Account details not found", {
                statusCode : 404
            })
            return next(error);
        }
        else{
            if(doc.role == "ADMIN"){
                return next();
            }
            else{
                res.status(403).json({success : false, message : "Unauthorised"})
            }
        }
    })
    .catch(function(err){
        return next(err);
    })
}

module.exports = {
    authenticateToken : authenticateToken,
    authorizeToken    : authorizeToken
}

