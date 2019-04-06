const mongoose = require("mongoose");

var accountSchema = new mongoose.Schema({
    email       : {type : String, required : true, unique : true},
    password    : {type : String, required : true},
    userName    : {type : String},
    role        : {type : String, enum: ["ADMIN", "USER"], default : "USER"},
    dateOfBirth : {type : Date}
})

var account = mongoose.model('account', accountSchema, "Account")

module.exports = account