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

    // Read config.xml -> extract adal-use-corporate-network variable value; default it to false
    var useCorporateNetwork = false;
    var configXml = shell.ls(path.join(ctx.opts.projectRoot, 'platforms/windows/config.xml'))[0];
    var pluginXml = shell.ls(path.join(ctx.opts.projectRoot, 'plugins/com.microsoft.aad.adal/plugin.xml'))[0];

    var rePreferenceValue = /<preference\s+name="adal-use-corporate-network"\s+value="(.+)"\s*\/>/i;
    var preferenceValue = shell.grep(rePreferenceValue, configXml);

    var result = rePreferenceValue.exec(preferenceValue);
    if(result !== null) {
        var match = result[1];

        useCorporateNetwork = match.toUpperCase() === 'TRUE';
    }

    var reHelperPluginDepEnabled = /(<)(dependency id="com\.microsoft\.aad\.adal\.sso".*)(>)/i;
    var reHelperPluginDepDisabled = /(<!--)(dependency id="com\.microsoft\.aad\.adal\.sso".*)(-->)/i;
    var ssoPluginDepEnabled = (shell.grep(reHelperPluginDepEnabled, pluginXml) !== '');
    var ssoPluginDepDisabled = (shell.grep(reHelperPluginDepDisabled, pluginXml) !== '');

    var plugmanInstallOpts = {
        plugins_dir: path.join(ctx.opts.projectRoot, 'plugins'),
        platform: 'windows',
        project: path.join(ctx.opts.projectRoot, 'platforms', 'windows')
    };

    if(useCorporateNetwork === true) {
        // If adal-use-corporate-network is true, check if we have enabled SSO plugin dependency
        //  If yes, then it should be already added, no action needed
        //  If no - enable it and manually install the dependent plugin
        if(ssoPluginDepDisabled) {
            console.log('useCorporateNetwork: ' + useCorporateNetwork);
            console.log('Adding SSO helper plugin');

            // Enabling dependency
            shell.sed('-i', reHelperPluginDepDisabled, '<' + '$2' + '>', pluginXml);

            ctx.requireCordovaModule('plugman').install(plugmanInstallOpts.platform, plugmanInstallOpts.project, 
                '.\\plugins\\com.microsoft.aad.adal\\src\\windows\\sso', plugmanInstallOpts.plugins_dir);
        }
    } else {
        // If adal-use-corporate-network is false, check if we have disabled SSO plugin dependency
        //  If yes, then it should be already removed, no action needed
        //  If no - disable it and manually uninstall the dependent plugin
        if(ssoPluginDepEnabled) {
            console.log('useCorporateNetwork: ' + useCorporateNetwork);
            console.log('Removing SSO helper plugin');

            // Disabling dependency first to allow dependent plugin to be removed
            shell.sed('-i', reHelperPluginDepEnabled, '<!--' + '$2' + '-->', pluginXml);

            ctx.requireCordovaModule('plugman').uninstall(plugmanInstallOpts.platform, plugmanInstallOpts.project, 
                helperPluginId, plugmanInstallOpts.plugins_dir);
        }
    }
};
