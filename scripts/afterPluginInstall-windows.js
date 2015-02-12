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

    var projitems = shell.ls(path.join(ctx.opts.projectRoot, 'platforms/windows/*.projitems'))[0];
    console.log('Patching windows universal app .projitems file: ' + projitems);
    if (shell.grep(/Condition="\$\(MSBuildProjectFullPath\.EndsWith\(\'\.Phone\.jsproj\'\)\)"/, projitems).length === 0) {
        // Need to write dependencies to projitems instead of separate jsprojs because of MSBuild v.14 issue with Extensions in AppManifest.xml
        var preliminaryRe = /<\/Project>/i;
        var preliminarySubst = "    <ItemGroup>\n" +
            "        <Reference Include=\"Microsoft.IdentityModel.Clients.ActiveDirectory\">\n" +
            "            <HintPath>plugins\\com.microsoft.aad.adal\\Microsoft.IdentityModel.Clients.ActiveDirectory.winmd</HintPath>\n" +
            "            <IsWinMDFile>true</IsWinMDFile>\n" +
            "        </Reference>\n" +
            "    </ItemGroup>\n" +
            "</Project>";

        // We need 2 item groups
        shell.sed('-i', preliminaryRe, preliminarySubst, projitems);
        shell.sed('-i', preliminaryRe, preliminarySubst, projitems);

        var re = /(<ItemGroup)(>)(\s*<Reference Include="Microsoft.IdentityModel.Clients.ActiveDirectory">\s*<HintPath>)(plugins\\com.microsoft.aad.adal\\Microsoft.IdentityModel.Clients.ActiveDirectory.winmd)(<\/HintPath>)/i;
        var substPhone = '$1 Condition="$(MSBuildProjectFullPath.EndsWith(\'.Phone.jsproj\'))"$2$3..\\..\\plugins\\com.microsoft.aad.adal\\src\\windows\\lib\\wpa\\Microsoft.IdentityModel.Clients.ActiveDirectory.winmd$5';
        var substWindows = '$1 Condition="!$(MSBuildProjectFullPath.EndsWith(\'.Phone.jsproj\'))"$2$3..\\..\\plugins\\com.microsoft.aad.adal\\src\\windows\\lib\\netcore45\\Microsoft.IdentityModel.Clients.ActiveDirectory.winmd$5';

        shell.sed('-i', re, substPhone, projitems);
        shell.sed('-i', re, substWindows, projitems);
    } else {
        console.log('Already patched, skipping...');
    }

    var projectFiles = [
        '*.Phone.jsproj',
        '*.Windows.jsproj',
        '*.Windows80.jsproj'
    ];

    var removeReferenceRe = /(<ItemGroup)(>)(\s*<Reference Include="Microsoft.IdentityModel.Clients.ActiveDirectory">\s*<HintPath>)(plugins\\com.microsoft.aad.adal\\Microsoft.IdentityModel.Clients.ActiveDirectory.winmd)(<\/HintPath>\s*<IsWinMDFile>true<\/IsWinMDFile>\s*<\/Reference>\s*<\/ItemGroup>)/i;
    projectFiles.forEach(function (projfile) {
        var projFilePath = shell.ls(path.join(ctx.opts.projectRoot, 'platforms/windows', projfile))[0];
        if (shell.grep("Microsoft.IdentityModel.Clients.ActiveDirectory.winmd", projFilePath).length > 0) {
            shell.sed('-i', removeReferenceRe, '', projFilePath);
        }
    });
};
