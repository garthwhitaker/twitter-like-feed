/**
 * @author: Garth Whitaker <garth.whitaker@gmail.com>
 */

(function () {

    'use strict';

    const winston = require('winston');
    const LOG_FILE_NAME = 'system.log';

    //Instantiating logger with required parameters
    var Logger = new (winston.Logger)({
        transports: [
            new (winston.transports.File)({ json: false, filename: LOG_FILE_NAME })
        ],
        exitOnError : false
    });

    /**
    * A module that exports logging functionality for auditing purposes and easy troubleshooting when application 
    * is running in production environment
    * @module Logger
    */

    module.exports = {
        Logger
    };
})();