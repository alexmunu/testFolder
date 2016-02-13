var passport=require('passport');
var Strategy = require('passport-twitter').Strategy;


passport.use(new Strategy({
        consumerKey: process.env.CONSUMER_KEY || 'ls0WaY14Ey2T3JKrYmeJnWBov',
        consumerSecret: process.env.CONSUMER_SECRET || '4mAV5XmARLO46mP2b01ckuwHQ2NnMFrhUBr3qOmowmHDLnzBTN',
        callbackURL: 'http://127.0.0.1:3000/login/twitter/return'
    },
    function(token, tokenSecret, profile, cb) {
        // In this example, the user's Twitter profile is supplied as the user
        // record.  In a production-quality application, the Twitter profile should
        // be associated with a user record in the application's database, which
        // allows for account linking and authentication with other identity
        // providers.
        profile.oauth_token=token;
        profile.oauth_token_secret=tokenSecret;

        return cb(null, profile);
    }));


// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  In a
// production-quality application, this would typically be as simple as
// supplying the user ID when serializing, and querying the user record by ID
// from the database when deserializing.  However, due to the fact that this
// example does not have a database, the complete Twitter profile is serialized
// and deserialized.
passport.serializeUser(function(user, cb) {
    cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
});


module.exports=passport;
