
/**
 * @author: Garth Whitaker <garth.whitaker@gmail.com>
 */

(function () {

    'use strict';

    const _ = require('lodash');

    const config = require("./../config/config.json");
    const utils = require('./../utils/utils');

    /***
     * This private method fetches tweet information from file
     * @param {string} fileName - The name of file containing tweet information
     * @return {string} The tweet contents from file
     */

    var fetchTweets = (fileName) => {
        var tweets = utils.fetch(fileName);
        return tweets;
    }

    /**
     * Class representing tweets
     */

    class Tweet {

        /**
         * Create a tweet.
         * @param {string} user - The name of the user who made tweet
         * @param {string} message - The message of the tweet 
         * @param {number} position - The order of the tweet when it was retrieved 
         */

        constructor(user, message, position) {
            this.user = user;
            this.message = message;
            this.position = position;
        }


        /**
         * Retrieve user
         * @return {string} 
         */
        getUser() {
            return this.user;
        }

        /**
         * Retrieve message
         * @return {string} 
         */
        getMessage() {
            return this.message;
        }


        /**
         * Retrieve position
         * @return {string} 
         */
        getPosition() {
            return this.position;
        }

        /**
         * This methods runs through all the tweets and returns tweets for user
         * @param {Tweet[]} tweets - A list of tweets
         * @param {string} user - The name of a user
         * @return {Tweet[]} List of filtered tweets for user 
         */

        static getTweetsByUser(tweets, user) {
            var result = [];

            result = tweets.filter((tweet) => {
                return tweet.user === user;
            });

            return result;
        }

        /**
         * This method sorts tweets by position 
         * @param {Tweet[]} tweets - A list of tweets
         * @return {Tweet[]}  A list of tweets
         */

        static sortTweetsByPosition(tweets) {

            tweets.sort(function (a, b) {
                return a.position - b.position;
            });
        }

        /**
         * This method prints out tweets 
         * @param {string[]} users - A list of user names
         * @param {Relationship[]} relationships - A list of relationships
         * @param {Tweet[]} tweets - A list of twets
         */

        static printTweets(users, relationships, tweets) {

            users.forEach((user) => {

                var userTweets = this.getTweetsByUser(tweets, user);
                
                var relationshipForFollowed = relationships.filter((relationship) => {
                    return relationship.follower == user;
                });
                
                if (relationshipForFollowed.length) {
                    relationshipForFollowed[0].followed.forEach((followedUser) => {

                        var followedUserTweets = Tweet.getTweetsByUser(tweets, followedUser);
                        userTweets = userTweets.concat(followedUserTweets);
                    })
                }

                this.sortTweetsByPosition(userTweets);

                var message = `${user}\n`;
                userTweets.forEach((tweet) => {
                    message += `\t@${tweet.user}: ${tweet.message}\n\n`;
                });

                console.log(message);

            });

        }

        /**
         * This method populates tweets 
         * @param {fileName} - The name of file containing tweet information
         * @return {Tweet[]} List of tweets
         */

        static populateTweets(fileName) {

            var tweetsFromFile = fetchTweets(fileName);

            var tweets = [];

            var filteredTweets = tweetsFromFile.split('\r\n').filter(Boolean);

            filteredTweets.forEach((info, index) => {

                var result = utils.extractTweet(info);
                if (result) {

                    var user = result[1];
                    var tweet = result[2].substr(0, config.MAX_TWEET_LENGTH);

                    tweets.push(new Tweet(user, tweet, index));
                }
            });

            return tweets;
        }

    }

    /**
    * Tweet
    * @module Tweet
    */

    module.exports = {
        Tweet
    };
})();
