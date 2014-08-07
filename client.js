var getCookie = function(name) {
    var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
};

var requestUserInfo = function(uid, at, callback) {
    var script = document.createElement('SCRIPT');
    script.src = 'https://api.vk.com/method/users.get?user_id=' + uid + '&v=5.24&access_token=' + at + '&callback=callbackFunc';
    window.callbackFunc = function(data) {
        callback(data);
    };
    document.getElementsByTagName("head")[0].appendChild(script);
}

$(document).ready(function() {
    $('.btn-login').hide();
    $('.btn-logout').hide();
    $('.username-label').hide();
    $.ajax('config.json').then(function(config) {
        var dataRef = new Firebase(config.firebase_url);

        $('.btn-login').click(function(e) {
            window.location.href = 'https://oauth.vk.com/authorize?' +
                'client_id=' + config.vk_app_id + '&' +
                'scope=email&' +
                'redirect_uri=' + config.host + '/authvk&' +
                'response_type=code&v=5.24';
        });
        $('.btn-logout').click(function(e) {
            dataRef.unauth();
            document.cookie = 'firetoken=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
            window.location.href = '/';
        });

        var token = getCookie('firetoken');
        if (token) {
            dataRef.auth(token, function(error, result) {
                if (error) {
                    console.log('Login Failed!', error);
                    $('.btn-login').show();
                    $('.btn-logout').hide();
                    $('.username-label').hide();
                } else {
                    console.log('Authenticated successfully with payload:', result.auth);
                    console.log('Auth expires at:', new Date(result.expires * 1000));
                    var payload = JSON.parse(result.auth);
                    requestUserInfo(payload.user_id, payload.access_token, function(data) {
                        $('.btn-login').hide();
                        $('.btn-logout').show();
                        $('.username-label').show();
                        $('.username-label').html(data.response[0].first_name + ' ' + data.response[0].last_name);
                    });
                }
            });
        } else {
            $('.btn-login').show();
            $('.btn-logout').hide();
            $('.username-label').hide();
        }
    });
});