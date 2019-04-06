const mongoose = require("mongoose");

var balancedSchema = new mongoose.Schema({
    email       : {type : String, required : true, unique : true},
    userName    : {type : String},
    attempts    : {type : Number},
    message     : {type : String}
})

var balanced = mongoose.model('balanced', balancedSchema, "Balanced")

module.exports = balanced