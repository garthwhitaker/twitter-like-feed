(function () {
    'use strict';

    const expect = require('expect');
    const mock = require('mock-fs');

    const {Tweet} = require('./../models/tweet');
    const {Relationship} = require('./../models/relationship');
    const config = require("./../config/config.json");

    const FILE_NAME = 'fake.txt';
    const RELATIONSHIP_FILE_NAME = 'relationship.txt';

    const TWEET_FULL_PATH = `data/${FILE_NAME}`;
    const RELATIONSHIP_FULL_PATH = `data/${RELATIONSHIP_FILE_NAME}`;

    var tweets = [];
    var relationships = [];

    var tweetMockedFile = {};
    tweetMockedFile[TWEET_FULL_PATH] = 'Ward> This is a message from Ward\r\nAlan> This is a message from Alan\r\nMax> This is a message from Max';
    tweetMockedFile[RELATIONSHIP_FULL_PATH] = 'Ward follows Alan\r\nJames follows Frank\r\nFrank follows Alan, Ward';

    beforeEach(function () {
        mock(tweetMockedFile);
        tweets = Tweet.populateTweets(FILE_NAME);
        relationships = Relationship.populateRelationships(RELATIONSHIP_FILE_NAME);
    });

    afterEach(mock.restore);

    describe('Tweets', () => {
        it('should create a tweet', () => {
            var tweet = Tweet.createTweet('Ward', 'This is a message 5', 5);
            expect(tweet.getMessage()).toBe('This is a message 5');
            expect(tweet.getMessage().length).toBeLessThan(config.MAX_TWEET_LENGTH);
            expect(tweet.getPosition()).toBe(5);
            expect(tweet.getUser()).toBe('Ward');
        });

        it('should create a tweet with message truncated as it is above max length of 140', () => {
            var tweet = Tweet.createTweet('Ward', 'This is a long tweet to ensure that if I surpass the 140 character limit,\
            I will have a truncated message that will be stored as the message for my tweet.', 5);
            expect(tweet.getMessage().length).toBe(config.MAX_TWEET_LENGTH);
            expect(tweet.getPosition()).toBe(5);
            expect(tweet.getUser()).toBe('Ward');
        });
        it('should populate tweets', () => {
            var tweets = Tweet.populateTweets(FILE_NAME);
            expect(tweets.length).toBeGreaterThan(0);
        });

        it('should not populate tweets and throw error', () => {
            expect(function () {
                Tweet.populateTweets('adada.txt')
            }).toThrow(/ENOENT, no such file or directory/);
        });

        it('should get no tweets for user', () => {

            var result = Tweet.getTweetsByUser(tweets, 'Alian');

            expect(result.length).toBe(0);
        });

        it('should get tweets for user', () => {

            var result = Tweet.getTweetsByUser(tweets, 'Alan');
            expect(result.length).toBe(1);
            expect(result[0].getMessage()).toBe(tweets[1].getMessage());
            expect(result[0].getPosition()).toBe(tweets[1].getPosition());
            expect(result[0].getUser()).toBe(tweets[1].getUser());
        });

        it('should sort tweets by position', () => {

            Tweet.sortTweetsByPosition(tweets);
            expect(tweets.length).toBe(3);
            expect(tweets[0].getPosition()).toBe(0);
            expect(tweets[2].getPosition()).toBe(2);

        });

        it('should get all tweets by users followed', () => {
            var followedTweets = Tweet.getFollowedTweetsByUser("Ward", relationships, tweets);

            expect(followedTweets.length).toBe(1);
            expect(followedTweets[0].getMessage()).toBe('This is a message from Alan');

        });



    });
})();