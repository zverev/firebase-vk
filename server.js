var express = require('express');
var app = express();
var config = require('./config.json');

app.get('/authvk', function(req, res) {
    // Generate a new secure JWT
    var FirebaseTokenGenerator = require("firebase-token-generator");
    var tokenGenerator = new FirebaseTokenGenerator(config.firebase_secret);
    var token = tokenGenerator.createToken({
        some: "arbitrary",
        data: "here"
    });
    res.cookie('firetoken', token);
    res.redirect('/');
});

app.use("/", express.static(__dirname));

app.listen(8010);