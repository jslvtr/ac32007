var express = require('express');
var passport = require('passport');
var util = require('util');
var BearerStrategy = require('passport-http-bearer').Strategy;

var configDB = require('./database.js');

function findByToken(token, fn) {
    var query = 'SELECT * FROM agile_api.users WHERE access_token = ?';
    var params = [ token ];

    configDB.client.execute(query, params, {prepare: true}, function(err, result) {
            if (err) {
                return fn(err, null);
            } else if (result.rows.length === 1) {
                return fn(null, result.rows[0]);
            } else {
                return fn(null, null);
            }
        }
    );
}

module.exports = {
    tokenHandler : function () {
        return new BearerStrategy({ "passReqToCallback": true },
            function (req, token, done) {
                // asynchronous validation, for effect...
                process.nextTick(function () {

                    // Find the user by token.  If there is no user with the given token, set
                    // the user to `false` to indicate failure.  Otherwise, return the
                    // authenticated `user`.  Note that in a production-ready application, one
                    // would want to validate the token for authenticity.
                    findByToken(token, function (err, user) {
                        if (err) {
                            return done(err, false);
                        }
                        if (!user) {
                            return done(null, false);
                        }
                        return done(null, user);
                    })
                });
            }
        )
    },
    facebookHandler : function(accessToken, refreshToken, profile, done) {
        findByToken(accessToken, function (err, user) {
            if (err) {
                return done(err, false);
            }
            if (!user) {
                return done(null, false);
            }
            return done(null, user);
        })
    }
};