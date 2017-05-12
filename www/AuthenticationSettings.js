// Copyright (c) Microsoft Open Technologies, Inc.  All rights reserved.  Licensed under the Apache License, Version 2.0.  See License.txt in the project root for license information.

/*global module, require*/

var checkArgs = require('cordova/argscheck').checkArgs;

var exec = require('cordova/exec');
var bridge = require('./CordovaBridge');
var LogItem = require('./LogItem');
var Deferred = require('./utility').Utility.Deferred;
if (cordova.platformId === 'windows') {
    require("cordova/exec/proxy").add("ADAL3WinMDProxy", ADAL3WinMDProxy.Logger);
}

module.exports = {

    /**
     * Sets flag to use or skip authentication broker.
     * By default, the flag value is false and ADAL will not talk to broker.
     *
     * @param   {Boolean}   useBroker         Flag to use or skip authentication broker
     *
     * @returns {Promise}  Promise either fulfilled or rejected with error
     */
    setUseBroker: function(useBroker) {

        checkArgs('*', 'AuthenticationSettings.setUseBroker', arguments);

        if (cordova.platformId === 'android') {
            return bridge.executeNativeMethod('setUseBroker', [!!useBroker]);
        }

        // Broker is handled by system on Windows/iOS
        var deferred = new Deferred();
        deferred.resolve();
        return deferred;
    },

    setLogger: function (userLogFunc) {
        exec(
            function(res) {
                userLogFunc(new LogItem(res));
            },
            null,
            cordova.platformId === 'windows' ? 'ADAL3WinMDProxy' : 'ADALProxy',
            "setLogger",
            []);
    },

    setLogLevel: function(logLevel) {
        if (cordova.platformId === 'android' || cordova.platformId === 'ios') {
            return bridge.executeNativeMethod('setLogLevel', [logLevel]);
        }

        var deferred = new Deferred();
        deferred.resolve();
        return deferred;
    }
}