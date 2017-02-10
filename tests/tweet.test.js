(function () {
    'use strict';

    const expect = require('expect');
    const mock = require('mock-fs');

    const {Tweet} = require('./../models/tweet');

    const FILE_NAME = 'fake.txt';
    const FULL_PATH = `data/${FILE_NAME}`;

    var tweets = [];
    var tweetMockedFile = {};
    tweetMockedFile[FULL_PATH] = 'Ward> This is a message 1\r\nAlain> This is a message 2\r\nMax> This is a message 3';

    beforeEach(function () {
        mock(tweetMockedFile);
        tweets = Tweet.populateTweets(FILE_NAME);
    });

    afterEach(mock.restore);

    describe('Tweets', () => {
        it('should create a tweet', () => {
            var tweet = new Tweet('Ward', 'This is a message 5', 5);
            expect(tweet.getMessage()).toBe('This is a message 5');
            expect(tweet.getPosition()).toBe(5);
            expect(tweet.getUser()).toBe('Ward');
        });

        it('should populate tweets', () => {
            var relationships = Tweet.populateTweets(FILE_NAME);
            expect(relationships.length).toBeGreaterThan(0);
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

            var result = Tweet.getTweetsByUser(tweets, 'Alain');
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
    });
})();