// Copyright (c) Microsoft Open Technologies, Inc.  All rights reserved.  Licensed under the Apache License, Version 2.0.  See License.txt in the project root for license information.
(function () {
    if (WinJS.Utilities.isPhone) {
        return;
    }

    exports.Clients = {
        // Microsoft.IdentityModel.Clients
        ActiveDirectory: {
                PromptBehavior: ADAL3WinMDProxy.PromptBehavior,
                UserIdentifier: ADAL3WinMDProxy.UserIdentifier,
                UserIdentifierType: ADAL3WinMDProxy.UserIdentifierType,
                AuthenticationContext: ADAL3WinMDProxy.AuthenticationContext
        }
    };
})();