/**
 * @author: Garth Whitaker <garth.whitaker@gmail.com>
 */

(function () {

    'use strict';

    const fs = require('fs');
    const path = require('path');
    const {Logger} = require('./../utils/logger/logger');
    const config = require("./../config/config.json");

    /**
      * This method reads a file
      * @param {string} fileName - The name of the file to read
      * @return {string} The contents of the file
      */
    var fetch = (fileName) => {

        try {
            var filePath = path.join(config.DATA_FOLDER_PATH, fileName);
            Logger.log('info', `Fetching contents of file in location: ${filePath}`);
            return fs.readFileSync(filePath).toString();
        } catch (error) {
            Logger.log('error', error.message);
            throw new Error(error.message);
        }

    };

    /**
     * This method fetches tweet information from file
     * @param {string} text - The tweet in text format i.e. 
     *                        Alan> If you have a procedure with 10 parameters, you probably missed some.
     * @return {string[]} The matched array response
     */

    var extractTweet = (text) => {
        return new RegExp(config.REGEX_TWEET).exec(text);
    }

    /**
     * This method fetches relationship information from file
     * @param {string} text - The relationship in text format i.e. Ward follows Alan
     * @return {string[]} The matched array response
     */

    var extractRelationship = (text) => {
        return new RegExp(config.REGEX_RELATIONSHIP).exec(text);
    }

    /**
     * This prints all user tweets to console
     * @param {Object} allUserTweets - A key value store for user -> tweets
     */

    var printTweets = (allUsersTweets) =>{
         Object.keys(allUsersTweets).forEach((user) => {

            var message = `${user}\n`;
            Logger.log('info',`Printing tweet(s) for user: ${user}.`);
            Logger.log('info', `(${allUsersTweets[user].length}) tweet(s) found.`)

            allUsersTweets[user].forEach((tweet) => {
                message += `\t@${tweet.user}: ${tweet.message}\n\n`;
            });

            Logger.log('info',`Tweet message(s): \n${message}`);

            console.log(message);

        })
    }

    /**
     * utils
     * @module utils
     */

    module.exports = {
        fetch,
        extractTweet,
        extractRelationship,
        printTweets
    }

})();