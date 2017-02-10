(function () {
    'use strict';

    const expect = require('expect');
    const mock = require('mock-fs');

    const {Relationship} = require('./../models/relationship');

    const FILE_NAME = 'fake.txt';
    const FULL_PATH = `data/${FILE_NAME}`;

    var relationshipMockedFile = {};
    relationshipMockedFile[FULL_PATH] = 'Ward follows Alan\r\nJames follows Frank\r\nFrank follows Alan, Ward';

    var relationships = [];

    describe('Relationships', () => {

        beforeEach(function () {
            mock(relationshipMockedFile);
            relationships = Relationship.populateRelationships(FILE_NAME);
        });

        afterEach(mock.restore);


        it('should create a relationship', () => {
            var relationship = new Relationship("Ward", "Alan");
            expect(relationship.getFollower()).toBe("Ward");
            expect(relationship.getFollowed()).toBe("Alan");
        });

        it('should fetch relationships', () => {
            var contentsOfFile = Relationship.fetchRelationships(FILE_NAME);
            expect(contentsOfFile).toBe(relationshipMockedFile[FULL_PATH]);
            expect(contentsOfFile.length).toBeGreaterThan(0);
        });

        it('should throw an error with ENOENT file or directory not found', () => {

            expect(function () {
                Relationship.fetchRelationships('faasdasdke.txt');
            }).toThrow(/ENOENT, no such file or directory/);
        });

        it('should populate relationships', () => {
            var relationships = Relationship.populateRelationships(FILE_NAME);
            expect(relationships.length).toBeGreaterThan(0);
        });

        it('should not populate relationships and throw error', () => {
            expect(function () {
                Relationship.populateRelationships('adada.txt')
            }).toThrow(/ENOENT, no such file or directory/);
        });

        it('should get followers from relationships', () => {

            var followers = Relationship.getFollowersFromRelationships(relationships);
            expect(followers.length).toBeGreaterThan(0);
            expect(followers).toInclude("Ward");
            expect(followers).toInclude("Frank");
            expect(followers).toNotInclude("Alan");
        });

        it('should not get followers from relationships', () => {
            var followers = Relationship.getFollowersFromRelationships([]);
            expect(followers.length).toBe(0);
        });

        it('should get followed from relationships', () => {
            var followed = Relationship.getFollowedFromRelationships(relationships);
            expect(followed.length).toBeGreaterThan(0);
            expect(followed).toInclude("Alan");
            expect(followed).toInclude("Frank");
            expect(followed).toNotInclude("Jeremy");
        });

        it('should not get followed from empty relationships', () => {
            var followed = Relationship.getFollowedFromRelationships([]);
            expect(followed.length).toBe(0);
        });


        it('should get all users from relationships', () => {
            var users = Relationship.getUsersFromRelationships(relationships);
            expect(users.length).toBeGreaterThan(0);
            expect(users).toInclude("Alan");
            expect(users).toInclude("Frank");
            expect(users).toInclude("James");
            expect(users).toInclude("Ward");
            expect(users).toNotInclude("Jeremy");
        });

        it('should not get any users from empty relationships', () => {
            var users = Relationship.getUsersFromRelationships([]);
            expect(users.length).toBe(0);
        });

        it('should populate a list of users from followers and followed', () => {
            var followed = Relationship.getFollowedFromRelationships(relationships);
            var followers = Relationship.getFollowersFromRelationships(relationships);

            var users = Relationship.populateUsers(followed, followers);

            expect(users.length).toBe(4);

        });

        it('should update and find relationship', () => {

            var relationship = new Relationship("Garth", "Ward");

            Relationship.udpateRelationships(relationships, relationship);

            var storedRelationship = Relationship.getRelationshipByFollower(relationships, relationship.getFollower());
            expect(storedRelationship.getFollower()).toBe(relationship.getFollower());
            expect(storedRelationship.getFollowed()).toBe(relationship.getFollowed());

        });

        it('should return index of follower in relationship list', () => {
            var followerIndex = Relationship.getRelationshipFollowerIndex(relationships, "James");
            expect(followerIndex).toNotBe(-1);
            expect(followerIndex).toBe(1);
        });

        it('should return follower in relationship list', () => {
            var followerRelationship = Relationship.getRelationshipByFollower(relationships, "James");
            expect(followerRelationship).toExist();
            expect(followerRelationship.getFollower()).toBe("James");
        });
    });


})();
