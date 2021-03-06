var path = require('path');

var error = require('../lib/error');
var logger = require('../lib/logger');
var sqldb = require('../lib/sqldb');
var sqlLoader = require('../lib/sql-loader');

var sql = sqlLoader.loadSqlEquiv(__filename);

module.exports = function(req, res, next) {
    var params = {
        uid: req.userUID,
    };
    sqldb.query(sql.get, params, function(err, result) {
        if (err) return next(err);
        if (result.rowCount == 0) {
            // the user doesn't exist so try to make it
            if (req.authUID == req.userUID) {
                // we aren't emulating so we can proceed
                var params = {
                    uid: req.authUID,
                    name: req.authName,
                };
                sqldb.queryOneRow(sql.set, params, function(err, result) {
                    if (err) return next(err);
                    res.locals.user = result.rows[0];
                    next();
                });
            } else {
                // we are an instructor emulating a user so we can't
                // make the user, as we don't have a username
                next(error.make(400, 'No such user: ' + req.userUID));
            }
        } else {
            // we got the user data, now check the name is correct
            var user = result.rows[0];
            if (req.authUID == req.userUID) {
                // we aren't emulating so we can proceed
                if (user.name == req.authName) {
                    // everything matches so just store the data
                    res.locals.user = user;
                    next();
                } else {
                    // username doesn't match so update it
                    var params = {
                        uid: req.authUID,
                        name: req.authName,
                    };
                    sqldb.queryOneRow(sql.set, params, function(err, result) {
                        if (err) return next(err);
                        res.locals.user = result.rows[0];
                        next();
                    });
                }
            } else {
                // we are an instructor emulating a user so we
                // can't check that the username is correct
                res.locals.user = user;
                next();
            }
        }
    });
};
