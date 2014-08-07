var express = require('express');
var request = require('request');
var app = express();
var config = require('./config.json');

app.get('/authvk', function(req, res) {
    // сюда нас редиректит vk с параметром code
    var code = req.query.code;
    if (code) {
        var requestUrl = 'https://oauth.vk.com/access_token?' +
            'client_id=' + config.vk_app_id + '&' +
            'client_secret=' + config.vk_secret + '&' +
            'code=' + code + '&' +
            'redirect_uri=' + config.host + '/authvk';
        // отправляем запрос сервер-сервер с секретным ключом,
        // чтобы получить access_token
        request(requestUrl, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                // теперь можно сгенерировать токен для firebase, который
                // мы и отправим на клиент в куке
                var FirebaseTokenGenerator = require("firebase-token-generator");
                var tokenGenerator = new FirebaseTokenGenerator(config.firebase_secret);
                var token = tokenGenerator.createToken(body);
                res.cookie('firetoken', token);
                res.redirect('/');
            } else {
                console.log(response);
                res.send('error');
            }
        });
    } else {
        res.send('invalid code');
    }
});

app.use("/", express.static(__dirname));

app.listen(8010);