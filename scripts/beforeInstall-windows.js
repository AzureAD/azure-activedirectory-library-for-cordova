#!/usr/bin/env node

// Copyright (c) Microsoft Open Technologies, Inc.  All rights reserved.  Licensed under the Apache License, Version 2.0.  See License.txt in the project root for license information.

module.exports = function (ctx) {
    var shell = ctx.requireCordovaModule('shelljs');
    var path = ctx.requireCordovaModule('path');

    // Processing USE_CORPORATE_NETWORK plugin variable
    var useCorporateNetwork = false;

    var re = /--variable ADAL_USE_CORPORATE_NETWORK=(.+)/i;
    var result = re.exec(ctx.cmdLine);
    if(result !== null) {
        var match = result[1];

        useCorporateNetwork = match.toUpperCase() === 'TRUE';
    }

    console.log('useCorporateNetwork: ' + useCorporateNetwork);

    var pluginXml = shell.ls(path.join(ctx.opts.projectRoot, 'plugins/cordova-plugin-ms-adal/plugin.xml'))[0];

    if (useCorporateNetwork === true) {
        var reHelperPlugin = /(<!--)(dependency id="cordova-plugin-ms-adal-sso" url="\.\/src\/windows\/sso"\/)(-->)/i;
        var substHelperPlugin = '<' + '$2' + '>';

        shell.sed('-i', reHelperPlugin, substHelperPlugin, pluginXml);

        var plugmanInstallOpts = {
            plugins_dir: path.join(ctx.opts.projectRoot, 'plugins'),
            platform: 'windows',
            project: path.join(ctx.opts.projectRoot, 'platforms', 'windows')
        };

        ctx.requireCordovaModule('plugman').install(plugmanInstallOpts.platform, plugmanInstallOpts.project, 
            '.\\plugins\\cordova-plugin-ms-adal\\src\\windows\\sso', plugmanInstallOpts.plugins_dir);
    }
};
