#!/usr/bin/env node

// Copyright (c) Microsoft Open Technologies, Inc.  All rights reserved.  Licensed under the Apache License, Version 2.0.  See License.txt in the project root for license information.

module.exports = function (ctx) {
    var shell = ctx.requireCordovaModule('shelljs');
    var path = ctx.requireCordovaModule('path');
    var helperPluginId = 'cordova-plugin-ms-adal-sso';

    // Removing references from .projitems
    var projitems = shell.ls(path.join(ctx.opts.projectRoot, 'platforms/windows/*.projitems'))[0];
    var referenceRe = /(<ItemGroup Condition="!?\$\(MSBuildProjectFullPath\.EndsWith\('\.Phone\.jsproj'\)\)">\s*<Reference Include="Microsoft\.IdentityModel\.Clients\.ActiveDirectory">[\s\S]*?<\/ItemGroup>)/i;

    // Removing 2 reference groups
    shell.sed('-i', referenceRe, '', projitems);
    shell.sed('-i', referenceRe, '', projitems);
    console.log('Removed 2 refereces from projitems');

    // Removing dependent helper plugin as we added it manually
    var pluginXml = shell.ls(path.join(ctx.opts.projectRoot, 'plugins/cordova-plugin-ms-adal/plugin.xml'))[0];
    var reHelperPluginDepEnabled = /(<)(dependency id="com\.microsoft\.aad\.adal\.sso".*)(>)/i;

    var plugmanInstallOpts = {
        plugins_dir: path.join(ctx.opts.projectRoot, 'plugins'),
        platform: 'windows',
        project: path.join(ctx.opts.projectRoot, 'platforms', 'windows')
    };

    // Removing helper plugin if it was installed
    if (shell.grep(reHelperPluginDepEnabled, pluginXml)) {
        console.log('Removing SSO helper plugin');
        // Disabling dependency first to allow dependent plugin to be removed
        shell.sed('-i', reHelperPluginDepEnabled, '<!--' + '$2' + '-->', pluginXml);

        ctx.requireCordovaModule('plugman').uninstall(plugmanInstallOpts.platform, plugmanInstallOpts.project, 
            helperPluginId, plugmanInstallOpts.plugins_dir);
    }
};
