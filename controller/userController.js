"use-strict"

const Promise = require("bluebird");
const _       = require("lodash");
const jwt     = require("jsonwebtoken");
const bcrypt  = require("bcryptjs");
const boom    = require("boom");

const config    = require("../config/config");
const Account   = require("../model/Account");
const Balanced  = require("../model/Balanced");

var registerUser = function(dataObj, cb){
    if(_.isNil(dataObj.email) || _.isNil(dataObj.password)){
        var error = new boom("Email or password is either null or undefined", {
            statusCode : 400
        });
        return cb(error, null);
    }

    Account.findOne({"email" : dataObj.email})
    .then(function(doc){
        if(doc){
            var error = new boom("Account with the given email Id already exists", {
                statusCode : 400
            });
            return cb(error, null);
        }
        return transformObjectAsync(dataObj)
    })
    .then(function(result){
        var account = new Account(result);
        return account.save();
    })
    .then(function(doc){
        var token = jwt.sign({ id: doc._id }, config.secretKey, {
            expiresIn: 86400
          });
        var result = {
            "token"   : token,
            "message" : "success"
        }
        return cb(null, result);
    })
    .catch(function(err){
        return cb(err, null);
    })
}

var transformObject = function(dataObj, cb){
    var password = dataObj.password;
    bcrypt.hash(password, 10)
    .then(function(hash) {
        dataObj.password = hash;
        return cb(null, dataObj);
    })
    .catch(function(err){
        return cb(err, null);
    })
}
var transformObjectAsync = Promise.promisify(transformObject);

var performOperation = function performOperation(data, userId, cb){
    var promise = null;
    var obj = { // just defining object so that I can cross verify it with each element in stack
        "[" : "]",
        "{" : "}",
        "(" : ")",
        ")" : "(",
        "}" : "{",
        "]" : "["
    }
    if(_.isNil(data)){
        var error = new boom("Input is either null or undefined", {
            statusCode : 400
        });
        return cb(error, null);
    }
    if(_.isNil(userId)){ 
        var error = new boom("Something bad happened", {
            statusCode : 400
        });
        return cb(error, null);
    }
    //using stack as data structure to check whether the string is balanced or not
    var stack = [];
    var dataArr = data.split('');
    _.forEach(dataArr, function(char, index){
        if(_.isEmpty(stack)){
            stack.push(char)
        }
        else{
            if(stack[stack.length - 1] == obj[char]){
                stack.pop()
            }
            else{
                stack.push(char);
            }
        }
    })

    Account.findById(userId) //extract email using userId
    .then(function(doc){
        if(!doc){
            var error = new boom("Invalid User", {
                statusCode : 400
            });
            return cb(error, null);
        }
        var email = doc.email;
        var userName = doc.userName || "";
        if(_.isEmpty(stack)){
            console.log("Balanced Operation");
            promise = Balanced.findOneAndUpdate({"email" : email, "userName" : userName}, {$inc : {attempts : 1}}, {upsert : true, new : true}).select({"_id" : 0, "__v" : 0, "email" : 0}).lean();
        }
        else{
            console.log("Unbalanced Operation");
            var obj = {
                "message" : "",
                "username": userName,
                "attempts" : 1
            }
            promise = Promise.resolve(obj)
        }
        return promise;
    })
    .then(function(result){
        if(result.message !== ""){
            result.message = "Success";
        }
        return cb(null, result);
    })
    .catch(function(err){
        return cb(err, null);
    })
}

module.exports = {
    registerUserAsync     : Promise.promisify(registerUser),
    performOperationAsync : Promise.promisify(performOperation)
}