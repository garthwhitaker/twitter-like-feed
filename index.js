/**
 * @author: Garth Whitaker <garth.whitaker@gmail.com>
 * @description: Entry point of twitter like feed application 
 */

(function () {

    'use strict';

    const yargs = require('yargs');
    const _ = require('lodash');
    const {Logger} = require('./utils/logger/logger');

    var {Relationship} = require('./models/relationship');
    var {Tweet} = require('./models/tweet');
    var utils = require('./utils/utils');

    Logger.log("info", "Application started.");

    var argv = require('yargs')
        .argv;

    if (argv.users && argv.tweets) {

        var relationships = Relationship.populateRelationships(`${argv.users}`);
        Logger.log("info", `Relationship(s) populated.`);

        var tweets = Tweet.populateTweets(`${argv.tweets}`);
        Logger.log("info", `${tweets.length} tweet(s) found.`);

        var users = Relationship.getUsersFromRelationships(relationships);
        Logger.log("info", `${users.length} user(s) found.`);

        var allUsersTweets = Tweet.getAllUserTweets(users, relationships, tweets);
        utils.printTweets(allUsersTweets);
    }
    else {
        console.log('Please enter command in this format \"node index.js --users=filename.txt --tweets=filename.txt\"');
    }

    Logger.log("info", "Application completed.");

})();





