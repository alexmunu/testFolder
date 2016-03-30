var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TweetSchema = new Schema({ any: {} });
/*
var TweetSchema = new Schema({
    metadata: {
        iso_language_code: String,
        result_type: String
    },
    created_at: String,
    id: Number,
    id_str: String,
    text: String,
    source: String,
    truncated: Boolean,
    in_reply_to_status_id: Schema.Types.Mixed,
    in_reply_to_status_id_str: Schema.Types.Mixed,
    in_reply_to_user_id: Schema.Types.Mixed,
    in_reply_to_user_id_str: Schema.Types.Mixed,
    in_reply_to_screen_name: Schema.Types.Mixed,
    user: {
        id: Number,
        id_str: String,
        name: String,
        screen_name: String,
        location: String,
        description: String,
        url: Schema.Types.Mixed,
        entities: [],
        protected: Boolean,
        followers_count: Number,
        friends_count: Number,
        listed_count: Number,
        created_at: String,
        favourites_count: Number,
        utc_offset: Number,
        time_zone: String,
        geo_enabled: Boolean,
        verified: Boolean,
        statuses_count: Number,
        lang: String,
        contributors_enabled: Boolean,
        is_translator: Boolean,
        is_translation_enabled: Boolean,
        profile_background_color: String,
        profile_background_image_url: String,
        profile_background_image_url_https: String,
        profile_background_tile: Boolean,
        profile_image_url: String,
        profile_image_url_https: String,
        profile_banner_url: String,
        profile_link_color: String,
        profile_sidebar_border_color: String,
        profile_sidebar_fill_color: String,
        profile_text_color: String,
        profile_use_background_image: Boolean,
        has_extended_profile: Boolean,
        default_profile: Boolean,
        default_profile_image: Boolean,
        following: Boolean,
        follow_request_sent: Boolean,
        notifications: Boolean
    },
    geo: Schema.Types.Mixed,
    coordinates: Schema.Types.Mixed,
    place: Schema.Types.Mixed,
    contributors: Schema.Types.Mixed,
    is_quote_status: Boolean,
    retweet_count: Number,
    favorite_count: Number,
    entities: {
        hashtags: [Schema.Types.Mixed],
        symbols: [Schema.Types.Mixed],
        user_mentions: [Schema.Types.Mixed],
        urls: [Schema.Types.Mixed]
    },
    favorited: Boolean,
    retweeted: Boolean,
    lang: String
});*/

module.exports = mongoose.model('Tweet', TweetSchema);