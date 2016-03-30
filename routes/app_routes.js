module.exports = function (passport, app, mongoose,server) {

    var express = require('express');
    var router = express.Router();
    var Twitter = require('twit');
    var Tweet = require('../models/Tweet');
    var JSONStream = require('JSONStream');
    

    var io = require('socket.io')(server);

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

    router.get('/home',
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
        req.session.destroy();
        //delete_user_in_MongoDB(req);
        res.redirect('/');
    });

    // a middleware function with no mount path. This code is executed for every request to the router
    router.use(function (req, res, next) {
        console.log('Time:', Date.now());
        next();
    });

    /* GET tweets listing. */
    var stream = null;

    router.get('/keyword/:word', function (req, res) {
        var track = req.params.word;
        track = track.toLowerCase();
        stream = twitter.stream('statuses/filter', {locations: [-180,-90,180,90]});

        stream.on('tweet', function (tweet) {
            if (tweet.text.toLowerCase().indexOf(track) > -1) {
                console.log(tweet);
                Tweet.collection.insert(tweet, function (err, docs) {
                    if (err) {
                        console.error(err.message );
                    } else {
                        console.info('Tweet successfully stored.', docs.length);
                    }
                });
            }
        });

        res.json("{Message: Service Started}");
    });

    router.get('/start', function (req, res) {
        res.set('Content-type', 'application/json');
        Tweet.find().stream().pipe(JSONStream.stringify()).pipe(res);
    });


    var searches = {};
    io.on('connection', function(socket) {
        searches[socket.id] = {};
        socket.on('word', function(q) {


            if (!searches[socket.id][q]) {
                console.log('New Search >>', q);

                var stream = twitter.stream('statuses/filter', {locations: [-180,-90,180,90]});

                stream.on('tweet', function (tweet) {
                    if (tweet.text.toLowerCase().indexOf(q) > -1) {

                        Tweet.collection.insert(tweet, function (err, docs) {
                            if (err) {
                                console.error(err.message );
                            } else {
                                console.info('Tweet Stored.', docs.length);
                            }
                        });
                    socket.emit('tweet_' + q, tweet);
                    }
                });
                
                // https://dev.twitter.com/streaming/overview/connecting
                stream.on('reconnect', function(req, res, connectInterval) {
                    console.log('reconnect :: connectInterval', connectInterval)
                });

                stream.on('disconnect', function(disconnectMessage) {
                    console.log('disconnect', disconnectMessage);
                });

                searches[socket.id][q] = stream;
            }
        });

        socket.on('remove', function(word) {
            searches[socket.id][word].stop();
            delete searches[socket.id][word];
            console.log('Removed Search >>', word);
        });

        socket.on('disconnect', function() {
            for (var k in searches[socket.id]) {
                searches[socket.id][k].stop();
                delete searches[socket.id][k];
            }
            delete searches[socket.id];
            console.log('Removed All Search from user >>', socket.id);
        });

    });

    return router;
};