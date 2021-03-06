var ERR = require('async-stacktrace');
var _ = require('lodash');
var async = require('async');
var pg = require('pg');

var config = require('../lib/config');
var sqldb = require('../lib/sqldb');
var models = require('../models');
var sprocs = require('../sprocs');
var cron = require('../cron');
var courseDB = require('../lib/course-db');
var syncFromDisk = require('../sync/syncFromDisk');

config.startServer = false;
var server = require('../server');

var testHelperDb = require('./testHelperDb');

var courseDir = '../exampleCourse';

module.exports = {
    before: function(callback) {
        async.series([
            function(callback) {
                testHelperDb.before(function(err) {
                    if (ERR(err, callback)) return;
                    callback(null);
                });
            },
            function(callback) {
                syncFromDisk.syncDiskToSql(courseDir, function(err) {
                    if (ERR(err, callback)) return;
                    callback(null);
                });
            },
            function(callback) {
                server.startServer(function(err) {
                    if (ERR(err, callback)) return;
                    callback(null);
                });
            },
        ], function(err) {
            if (ERR(err, callback)) return;
            callback(null);
        });
    },

    after: function(callback) {
        async.series([
            function(callback) {
                testHelperDb.after(function(err) {
                    if (ERR(err, callback)) return;
                    callback(null);
                });
            },
        ], function(err) {
            if (ERR(err, callback)) return;
            callback(null);
        });
    },
};
