(function () {
    'use strict';

    const expect = require('expect');
    const mock = require('mock-fs');

    const utils = require('./../utils/utils');
    const config = require("./../config/config.json");

    const FILE_NAME = 'fake.txt';
    const FULL_PATH = `data/${FILE_NAME}`;

    var utilMockFile = {};
    utilMockFile[FULL_PATH] = 'This is mocked file';

    describe('Utils', () => {

        beforeEach(function () {
            mock(utilMockFile);
        });

        afterEach(mock.restore);

        it('should fetch file contents for user', () => {
            var contentsOfFile = utils.fetch(FILE_NAME);
            expect(contentsOfFile).toBe(utilMockFile[FULL_PATH]);
            expect(contentsOfFile.length).toBeGreaterThan(0);
        });

        it('should throw an error with ENOENT file or directory not found', () => {

            expect(function () {
                utils.fetch('userasdsad.txt');
            }).toThrow(/ENOENT, no such file or directory/);
        });

        it('should extract tweet from text', () => {
            var result = utils.extractTweet('Alan> If you have a procedure with 10 parameters, you probably missed some.');
            expect(result).toExist();
        });

        it('should fail to extract tweet as greater than sign is missing from text', () => {
            var result = utils.extractTweet('Alan If you have a procedure with 10 parameters, you probably missed some.');
            expect(result).toNotExist();
        });

        it('should extract relationship from text', () => {
            var result = utils.extractRelationship('Ward follows Alan');
            expect(result).toExist();
        });

        it('should fail to relationship tweet as follow text is missing from text', () => {
            var result = utils.extractRelationship('Ward>  Alan');
            expect(result).toNotExist();
        });
    })
})();