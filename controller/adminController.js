"use-strict"

const Promise = require("bluebird");
const _       = require("lodash");
const boom    = require("boom");

const Account   = require("../model/Account");

var getUsers = function getUsers(cb){
    Account.find({"role" : "USER"}).select({"password" : 0, "__v" : 0})
    .then(function(result){
        return cb(null, result);
    })
    .catch(function(err){
        return cb(err, null);
    })
}

var deleteUser = function deleteUser(userId, cb){
    Account.findOneAndDelete({"_id" : userId, "role" : "USER"}) // to prevent one admin deleting another admin
    .then(function(result){
        return cb(null, result);
    })
    .catch(function(err){
        return cb(err, null);
    })
}

module.exports = {
    getUsersAsync : Promise.promisify(getUsers),
    deleteUserAsync : Promise.promisify(deleteUser)
}