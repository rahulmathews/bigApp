"use-strict"

const _         = require("lodash");
const boom      = require("boom");
const Joi       = require("joi");

const userController = require("../controller/userController");

var registerUser = function registerUser(req, res, next){

    var email        = _.get(req, "body.email", null);
    var password     = _.get(req, "body.password", null);
    var dateOfBirth  = _.get(req, "body.dateOfBirth", null);
    var userName     = _.get(req, "body.userName", null);
    var role         = _.get(req, "body.role", "USER");

    var dataObj = {
        "email"         : email,
        "password"      : password,
        "dateOfBirth"   : dateOfBirth,
        "userName"      : userName,
        "role"          : role
    }

    const schema = Joi.object().keys({
        email       : Joi.string().email({ minDomainAtoms: 2 }).required(),
        password    : Joi.string().required(),
        userName    : Joi.string().alphanum().min(3).max(30).allow(null),
        dateOfBirth : Joi.date().max('now').allow(null),
        role        : Joi.string().valid(['ADMIN', 'USER'])   
    })

    Joi.validate(dataObj, schema, function(err, value){
        if(err){
            return next(err)
        }
    })

    if(_.isNil(email) || _.isNil(password)){
        var error = new boom("Email or password is either null or undefined", {
            statusCode : 400
        });
        return next(error);
    }

    userController.registerUserAsync(dataObj)
    .then(function(result){
        res.status(200).json(result); 
    })
    .catch(function(err){
        return next(err);
    })
}

var performOperation = function performOperation(req, res, next){
    var dataInput = _.get(req, "body.data", null);
    var userId    = _.get(req, "userIdFromLoginToken", null);

    if(_.isNil(dataInput)){
        var error = new boom("Input is either null or undefined", {
            statusCode : 400
        });
        return next(error);
    }
    if(_.isNil(userId)){
        var error = new boom("Something Bad Happened", {
            statusCode : 400
        });
        return next(error);
    }

    userController.performOperationAsync(dataInput, userId)
    .then(function(result){
        res.status(200).json(result); 
    })
    .catch(function(err){
        return next(err);
    })
}

module.exports = {
    performOperation : performOperation,
    registerUser     : registerUser
}