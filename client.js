var getCookie = function(name) {
    var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
};

$(document).ready(function() {
    $('.btn-login').hide();
    $('.btn-logout').hide();
    $.ajax('config.json').then(function(config) {
        var dataRef = new Firebase(config.firebase_url);

        $('.btn-login').click(function(e) {
            window.location.href = '/authvk';
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
                } else {
                    console.log('Authenticated successfully with payload:', result.auth);
                    console.log('Auth expires at:', new Date(result.expires * 1000));
                    $('.btn-login').hide();
                    $('.btn-logout').show();
                }
            });
        } else {
            $('.btn-login').show();
            $('.btn-logout').hide();
        }
    });
});