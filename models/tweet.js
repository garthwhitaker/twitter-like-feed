
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
         * This method get all tweets for user 
         * @param {string[]} users - A list of user names
         * @param {Relationship[]} relationships - A list of relationships
         * @param {Tweet[]} tweets - A list of tweets
         */

        static getAllUserTweets(users, relationships, tweets) {

            var result = [];
            users.forEach((user) => {

                var userTweets = this.getTweetsByUser(tweets, user);
                var followedTweets = this.getFollowedTweetsByUser(user, relationships, tweets);
                userTweets = userTweets.concat(followedTweets);

                this.sortTweetsByPosition(userTweets);

                result[user] = userTweets;
            });

            return result;

        }

        /**
         * This methods runs through all the tweets and returns tweets for users followed
         * @param {string} user - The name of a user
         * @param {Relationship[]} relationships- A list of relationships
         * @param {Tweet[]} tweets - A list of tweets
         * @return {Tweet[]} List of all tweets by users followed
         */

        static getFollowedTweetsByUser(user, relationships, tweets) {

            var result = [];

            var relationshipForFollowed = relationships.filter((relationship) => {
                return relationship.follower === user;
            });

            if (relationshipForFollowed.length) {
                relationshipForFollowed[0].followed.forEach((followedUser) => {
                    var followedUserTweets = Tweet.getTweetsByUser(tweets, followedUser);
                    result = result.concat(followedUserTweets);
                })
            }

            return result;
        }



        /**
         * This method populates tweets from file
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
                    var message = result[2];

                    tweets.push(this.createTweet(user, message, index));
                }
            });

            return tweets;
        }

        /**
         * This method create a Tweet object 
         * @param {user} - The name of user who created tweet
         * @param {message} - The description of tweet
         * @param {position} - The order the tweet was in the file
         * @return {Tweet} 
         */

        static createTweet(user, message, position) {

            if (message.length > config.MAX_TWEET_LENGTH) {
                message = message.substr(0, config.MAX_TWEET_LENGTH);
            }

            var tweet = new Tweet(user, message, position);

            return tweet;
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
