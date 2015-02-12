/*
 * Copyright (c) Microsoft Open Technologies, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

module.exports = function (ctx) {
    var shell = ctx.requireCordovaModule('shelljs');
    var path = ctx.requireCordovaModule('path');
    var helperPluginId = 'com.microsoft.aad.adal.sso';

    // Removing references from .projitems
    var projitems = shell.ls(path.join(ctx.opts.projectRoot, 'platforms/windows/*.projitems'))[0];
    var referenceRe = /(<ItemGroup Condition="!?\$\(MSBuildProjectFullPath\.EndsWith\('\.Phone\.jsproj'\)\)">\s*<Reference Include="Microsoft\.IdentityModel\.Clients\.ActiveDirectory">[\s\S]*?<\/ItemGroup>)/i;

    // Removing 2 reference groups
    shell.sed('-i', referenceRe, '', projitems);
    shell.sed('-i', referenceRe, '', projitems);
    console.log('Removed 2 refereces from projitems');

    // Removing dependent helper plugin as we added it manually
    var pluginXml = shell.ls(path.join(ctx.opts.projectRoot, 'plugins/com.microsoft.aad.adal/plugin.xml'))[0];
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
