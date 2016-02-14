module.exports = function (passport, app, mongoose) {

    var express = require('express');
    var router = express.Router();
    var Twitter = require('twit');
    var Tweet = require('../models/Tweet');
    var Q = require('q');

    var user_model = null;
    var User = null;
    var tokens = null;
    var twitter = null;

    app.use(require('express-session')({secret: 'keyboard cat', resave: true, saveUninitialized: true}));
    app.use(passport.initialize());
    app.use(passport.session());

    /* GET home page. */
    router.get('/',
        function (req, res) {
            res.render('home', {user: req.user});
        });

    router.get('/tokens', function (req, res) {
        console.log("im here now");
        res.json({"token": token, "token_secret": token_secret});
    });

    router.get('/login',
        function (req, res) {
            res.render('home');
        });

    router.get('/login/twitter',
        passport.authenticate('twitter'));

    router.get('/login/twitter/return',
        passport.authenticate('twitter', {failureRedirect: '/home'}),
        function (req, res) {
            tokens = {
                "oauth_token": req.user.oauth_token,
                "oauth_token_secret": req.user.oauth_token_secret
            };
            console.log("User logged successfully");
            //insert_user_in_MongoDB(req.user);
            res.redirect('/');
        });

    router.get('/profile',
        require('connect-ensure-login').ensureLoggedIn(),
        function (req, res) {
            res.render('profile', {user: req.user});
        });

    router.get('/index',
        require('connect-ensure-login').ensureLoggedIn(),
        function (req, res) {
            twitter = new Twitter({
                consumer_key: process.env.CONSUMER_KEY || 'ls0WaY14Ey2T3JKrYmeJnWBov',
                consumer_secret: process.env.CONSUMER_SECRET || '4mAV5XmARLO46mP2b01ckuwHQ2NnMFrhUBr3qOmowmHDLnzBTN',
                access_token: tokens.oauth_token,
                access_token_secret: tokens.oauth_token_secret,
                callBackUrl: 'http://127.0.0.1:3000/login/twitter/return'
            });
            res.render('index', {user: req.user});
        });

    router.get('/logout', function (req, res) {
        req.logout();
        //delete_user_in_MongoDB(req);
        res.redirect('/');
    });

    var searched_tweets = {};

    // a middleware function with no mount path. This code is executed for every request to the router
    router.use(function (req, res, next) {
        console.log('Time:', Date.now());
        next();
    });

    /* GET tweets listing. */

    router.get('/keyword/:word', function (req, res) {

        /* getSearchedTweets_TW_ApiService.then(storeTweetsInMongoDB).then(getsearchedTweets).done(function(){
         res.json.json(searched_tweets);
         });*/

        twitter.get('search/tweets', {q: req.params.word, count: 100}, function (err, data, response) {
            searched_tweets = data.statuses;
            if (!searched_tweets)
                res.json({"Message": "EmptyList"});
            else {
                Tweet.remove({}, function (err, removed) {
                    if (!err) {
                        console.log('collection removed');
                        Tweet.collection.insert(searched_tweets, function (err, docs) {
                            if (err) {
                                console.error(err.message);
                            } else {
                                console.info('Tweets successfully stored.', docs.length);
                                Tweet.find({"coordinates": {$ne: null}}, function (err, docs) {
                                    if (!err) {
                                        //console.log(JSON.stringify(docs));
                                        res.json(JSON.stringify(docs));
                                    } else console.error(err.message);
                                });
                            }
                        });
                    }
                });
            }
        });
    });

    router.get('/continue/:word', function (req, res) {
        Tweet.findOne({}, null, {sort: {id: -1}}, function (err, docs) {
            if (!err) {
                var last_id = docs.id;
                twitter.get('search/tweets', {
                    q: req.params.word,
                    count: 100,
                    since_id: last_id
                }, function (err, data, response) {
                    searched_tweets = data.statuses;
                    if (!searched_tweets)
                        res.json({"Message": "EmptyList"});
                    else {
                        Tweet.collection.insert(searched_tweets, function (err, docs) {
                            if (err) {
                                console.error(err.message);
                            } else {
                                console.info('Tweets successfully stored.', docs.length);
                                Tweet.find({"coordinates": {$ne: null}}, function (err, docs) {
                                    if (!err) {
                                        //console.log(JSON.stringify(docs));
                                        res.json(JSON.stringify(docs));
                                    } else console.error(err.message);
                                });
                            }
                        });
                    }
                });
            } else console.error(err.message);
        });
    });

    return router;
};