// Copyright (c) Microsoft Open Technologies, Inc.  All rights reserved.  Licensed under the Apache License, Version 2.0.  See License.txt in the project root for license information.

/*global module, require*/

var checkArgs = require('cordova/argscheck').checkArgs;

var bridge = require('./CordovaBridge');
var Deferred = require('./utility').Utility.Deferred;

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

        return bridge.executeNativeMethod('setUseBroker', [!!useBroker]);
    }
}
