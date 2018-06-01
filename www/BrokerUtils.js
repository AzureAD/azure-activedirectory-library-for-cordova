// Copyright (c) Microsoft Open Technologies, Inc.  All rights reserved.  Licensed under the Apache License, Version 2.0.  See License.txt in the project root for license information.

/*global module, require*/

var bridge = require('./CordovaBridge');
var checkArgs = require('cordova/argscheck').checkArgs;

/**
 * BrokerUtils
 */
function BrokerUtils(authContext) {
    this.authContext = authContext;
}

/**
 * Gets broker uri
 *
 * @returns {String} Broker RedirectURI
 */
BrokerUtils.prototype.getBrokerRedirectUri = function () {
    checkArgs('*', 'BrokerUtils.getBrokerRedirectUri', arguments);

    var args = [
        this.authContext.authority,
        this.authContext.validateAuthority
    ];

    return bridge.executeNativeMethod('getBrokerRedirectUri', args);
};

module.exports = BrokerUtils;
