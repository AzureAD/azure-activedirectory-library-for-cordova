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
