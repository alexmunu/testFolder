
module.exports = function(tokens) {

    var express = require('express');
    var angular = express.Router();
    var Twitter = require('twitter-js-client').Twitter;
    var Tweet = require('./models/Tweet');

    var twitter = null;


    function insertTweets(data) {
        
        Tweet.collection.insert(data, function (err, docs) {
            if (err) {
                console.error(err.message);
            } else {
                console.info('Tweets successfully stored.', docs.length);
            }
        });
    }

    var searched_tweets = {};

// a middleware function with no mount path. This code is executed for every request to the router
    angular.use(function(req, res, next) {
        console.log('Time:', Date.now());
        

        next();
    });

/* GET tweets listing. */
    angular.get('/keyword/:word', function (req, res, next) {
        twitter = new Twitter({
            "consumerKey": process.env.CONSUMER_KEY || 'ls0WaY14Ey2T3JKrYmeJnWBov',
            "consumerSecret": process.env.CONSUMER_SECRET || '4mAV5XmARLO46mP2b01ckuwHQ2NnMFrhUBr3qOmowmHDLnzBTN',
            "accessToken": tokens.oauth_token,
            "accessTokenSecret": tokens.oauth_secret_token,
            "callBackUrl": 'http://127.0.0.1:3000/login/twitter/return'
        });

        searched_tweets = twitter.getSearch({ 'q': req.params.word, 'count': 10 }, function(err, response, body) {
            console.log('ERROR [%s]', err);
        }, function(data) {
            return data;
        });

        if (!searched_tweets)
            next();
        else {
            insertTweets(searched_tweets);
            res.json(searched_tweets);
        }
    });

    

}
