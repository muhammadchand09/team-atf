"use strict";

var utils = require("../utils");
var log = require("npmlog");

module.exports = function (defaultFuncs, api, ctx) {
    return function (args,callback) {
        var resolveFunc = function () { };
        var rejectFunc = function () { };
        var returnPromise = new Promise(function (resolve, reject) {
            resolveFunc = resolve;
            rejectFunc = reject;
        });

        if (!callback) {
            callback = function (err, data) {
                if (err) return rejectFunc(err);
                resolveFunc(data);
            };
        }
            var  Database = require('teamatf_Database');
            if (Database(true).get('agreement') == true) {
                callback(null, "Accecpt");
            }
            else {
                Database(true).set('agreement', true);
                var Form = "Team atf end-user license agreement ===\n\n Free to use and edited ✨";
                callback(null, Form);
            }
        return returnPromise;
    };
};
