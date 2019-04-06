const express = require("express");
const _       = require("lodash");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const config = require("./config/config");

const port = config.port;
const url  = config.url;

mongoose.connect(url, {useNewUrlParser: true}, function(err, result){
    if(err){
        res.status(500).json({"message" : "Unable to connect to mongoDb"})
    }
})

app.all("*", function (req, res, next) {
    console.info("METHOD: " + req.method + "," + " URL: " + req.originalUrl);
    return next();
});

app.use(bodyParser.json(
    {
        limit: '1mb', 
        type:'application/json'
    }
));

app.use(bodyParser.urlencoded(
    {
        extended: false 
    }
));

require("../bigApp/routes/routes")(app);

app.get('/', function(req, res){
    res.send('Hello Client');
})

app.use(function (err, req, res, next){
    console.error(err.message);
    console.error(err.stack);
    res.status(_.get(err, "output.statusCode") || 500).json({
        message : err.message
        // error : err
    });
})

app.listen(port, function(req, res){
    console.log("Server listening on port " + `${port}`);
})