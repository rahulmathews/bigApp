"use-strict"

const _         = require("lodash");
const boom      = require("boom");

const adminController = require("../controller/adminController");

var getUsers = function getUsers(req, res, next){
    if(_.isNil(req.headers.authorization)){ // just for caution
        var error = new boom("Unauthorised", {
            statusCode : 400
        });
        return next(error);
    }
    adminController.getUsersAsync()
    .then(function(result){
        return res.status(200).json(result)
    })
    .catch(function(err){
        return next(err);
    })
}

var deleteUser = function deleteUser(req, res, next){
    var userId = _.get(req, "params.userId", null);

    if(_.isNil(req.headers.authorization)){ // just for caution
        var error = new boom("Unauthorised", {
            statusCode : 401
        });
        return next(error);
    }
    if(_.isNil(userId)){
        var error = new boom("UserId is either null or undefined", {
            statusCode : 400
        });
        return next(error);
    }

    adminController.deleteUserAsync(userId)
    .then(function(result){
        return res.status(200).json({success : true, message : "successfully deleted"});
    })
    .catch(function(err){
        return next(err);
    })
}

module.exports = {
    getUsers : getUsers,
    deleteUser : deleteUser
}