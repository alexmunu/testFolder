
angular.module("twitrackApp",['ngTwitter'])
    .factory("Service", service);

service.$inject = ['$http','$window'];

function service($http) {


    return {
        getTweetsByKeyWord: function (keyword,user_t,user_st) {

            var t={token:user_t,token_secret:user_st};
            console.log(ConfigHeader(t));

            return $http.get("https://api.twitter.com/1.1/search/tweets.json", {

                headers: ConfigHeader(t),
                params: ConfigParameters(keyword)
            })
                /*.success(function (data, status, headers, config) {

                 }).error(function (data, status, headers, config){

                 })*/;

            /*for(var i=0;i<5;i++) {
             http.get("https://api.twitter.com/1.1/search/tweets.json", {headers: ConfigHeader(),params:ConfigParameters(keyword)})
             .success(function (data, status, headers, config) {

             }).error(function (data, status, headers, config){

             });
             }*/
        }
    }

    function ConfigHeader(tokens) {
        //console.log(getTokens());
        return { 'Authorization': getHeader(tokens),'X-Target-URI': 'https://api.twitter.com', 'Access-Control-Allow-Origin': 'http://127.0.0.1:3000'};
    }

    function ConfigParameters(keyword, since_id) {
        return {q: keyword, count: 100, since_id: since_id};
    }

    function ConfigParameters(keyword) {
        return {count: 100,q: keyword};
    }

    function getTokens() {
        console.log("trying");
        return $http.get('/tokens',{});
    }

    function getHeader(tokens) {

        var nonceObj = new jsSHA(Math.round((new Date()).getTime() / 1000.0), "TEXT");
        var oauth_consumer_secret = "4mAV5XmARLO46mP2b01ckuwHQ2NnMFrhUBr3qOmowmHDLnzBTN";
        var endpoint = "https://api.twitter.com/1.1/search/tweets.json";
        var requiredParameters = {
            oauth_consumer_key: "ls0WaY14Ey2T3JKrYmeJnWBov",
            oauth_nonce: nonceObj.getHash("SHA-1", "HEX"),
            oauth_signature_method: "HMAC-SHA1",
            oauth_timestamp: Math.round((new Date()).getTime() / 1000.0),
            oauth_token: tokens.token,
            oauth_version: "1.0"
        };

        requiredParameters.oauth_signature = getOauth_signature(endpoint, requiredParameters, oauth_consumer_secret, tokens.token_secret);
        return requiredParameters;
    }

    function getOauth_signature(endpoint, params, consumer_secret, token_secret) {

        var base_signature_string = "GET&" + encodeURIComponent(endpoint) + "&";
        var requiredParameterKeys = Object.keys(params);
        for (var i = 0; i < requiredParameterKeys.length; i++) {
            if (i == requiredParameterKeys.length - 1) {
                base_signature_string += encodeURIComponent(requiredParameterKeys[i] + "=" + params[requiredParameterKeys[i]]);
            } else {
                base_signature_string += encodeURIComponent(requiredParameterKeys[i] + "=" + params[requiredParameterKeys[i]] + "&");
            }
        }

        if (typeof base_signature_string !== "undefined" && base_signature_string.length > 0) {
            if (typeof consumer_secret !== "undefined" && consumer_secret.length > 0) {
                var shaObj = new jsSHA(base_signature_string, "TEXT");
                return encodeURIComponent(shaObj.getHMAC(consumer_secret + "&" + token_secret, "TEXT", "SHA-1", "B64"));
            }
        } else {
            return "null";
        }
    }

    function filter_array_object(attr_to_remove, array) {

        var new_arr = [];
        for (var i = 0; i < array.length; i++) {
            if (array[i][attr_to_remove]) new_arr.push(array[i]);
        }

        return new_arr;
    }
}

