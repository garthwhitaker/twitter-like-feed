
/**
 * @author: Garth Whitaker <garth.whitaker@gmail.com>
 * NOTES:
 * I have not done any unique user checking not case-sensitive checking has been put in place. It was assumed
 * that each user i.e.(follower/followed) would be unique
 */

(function () {

    'use strict';

    const _ = require('lodash');

    const utils = require('./../utils/utils');

    /**
     * Class represenating relationships between follower and followed
     */

    class Relationship {

        /**
         * Create a relationship.
         * @param {string} follower - The name of the follower in the relationship
         * @param {string|string[]} followed - The name(s) of the followed in the relationship 
         */

        constructor(follower, followed) {
            this.follower = follower;
            this.followed = followed;
        }

        /**
         * Retrieve follower
         * @return {string} 
         */
        getFollower() {
            return this.follower;
        }

        /**
         * Retrieve followed
         * @return {string[]} List of followed
         */
        getFollowed() {
            return this.followed;
        }

        /***
             * This  method fetches relationship information from file
             * @param {string} fileName - The name of file containing relationship information
             * @return {string} The relationships contents from file
             */

        static fetchRelationships(fileName) {

            var relationships = utils.fetch(fileName);
            return relationships;

        }

        /***
        * This  method filters out followers from relationships array
        * @param {Relationship[]} relationships - The list of relationships 
        * @return {string[]} The names of followers
        */

        static getFollowersFromRelationships(relationships) {

            var followers = relationships.map((relationship) => {
                return relationship.follower;
            });

            return followers;
        }

        /***
        * This  method filters out followed from relationships array
        * @param {Relationship[]} relationships - A list of relationships
        * @return {string[]} The names of those followed 
        */

        static getFollowedFromRelationships(relationships) {

            var followed = relationships.map((relationship) => {
                return relationship.followed;
            });

            return followed;
        }

        /**
         * This methods runs through all the relationships followers and followed properties and 
         * gets the users from them
         * @param {Relationship[]} relationships - A list of relationships
         * @return {string[]} List of all the names of  users 
         */

        static getUsersFromRelationships(relationships) {

            var followers = this.getFollowersFromRelationships(relationships);
            var followed = this.getFollowedFromRelationships(relationships);

            var users = this.populateUsers(followers, followed);

            return users;
        }

        /**
         * This methods combines followers and followed to get all users 
         * gets the users from them
         * @param {string[]} followers - A list of followers
         * @param {string[]} followed - A list of followed
         * @return {string[]} List of all the names of  users 
         */

        static populateUsers(followers, followed) {
           
            var users = _.union(followers, followed);
            users = _.flatten(users);
            users = _.uniq(users).sort();
            return users;
        }

        /**
         * This methods runs through all the relationships followers and check if there is a follower of the same name,
         * if so, update the followed array and ensure that array has distinct members
         * @param {Relationship[]} relationships - A list of relationships
         * @param {Relationship} relationship - The relationship to update or create
         * @return {Relationship[]} A update list of relationships 
         */

        static udpateRelationships(relationships, relationship) {

            var result = this.getRelationshipFollowerIndex(relationships, relationship.follower);

            if (result !== -1) {

                var currentRelationship = relationships[result];

                var uniqueFollowed = _.union(currentRelationship.followed, relationship.followed);
                currentRelationship.followed = uniqueFollowed;

            }
            else {
                relationships.push(new Relationship(relationship.follower, relationship.followed));
            }

        }

        /**
         * This method populates relationships from file 
         * @param {fileName} fileName - The name of file containing relationship information
         * @return {Relationship[]} List of relationships
         */

        static populateRelationships(fileName) {

            var relationships = [];

            var relationshipsFromFile = this.fetchRelationships(fileName);

            if (relationshipsFromFile) {
                var filteredRelationships = relationshipsFromFile.split('\r\n').filter(Boolean);

                filteredRelationships.forEach((user) => {
                    var result = utils.extractRelationship(user);

                    if (result) {

                        var follower = result[1];
                        var followed = result[2].split(/,\s+/);

                        var relationship = new Relationship(follower, followed);
                        this.udpateRelationships(relationships, relationship);
                    }
                });
            }

            return relationships;

        }

         /**
         * This method returns index of relationships for follower
         * @param {Relationship[]} relationships - A list of relationships
         * @param {string} follower - The name of follower 
         * @return {number} Index of relationship
         */

        static getRelationshipFollowerIndex(relationships, follower) {

            var relationship;

            var indexOfFollower = relationships.findIndex((item) => {
                return  item.follower === follower;
            });

            return indexOfFollower;

        }


         /**
         * This method returns relationships for follower
         * @param {Relationship[]} relationships - A list of relationships
         * @param {string} follower - The name of follower 
         * @return {Relationship} Index of relationship
         */

        static getRelationshipByFollower(relationships, follower){
            return relationships[this.getRelationshipFollowerIndex(relationships,follower)];
        }

    }

    /**
     * Relationship
     * @module Relationship
     */

    module.exports = {
        Relationship
    }
})();
