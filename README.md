# Active Directory Authentication Library (ADAL) plugin for Apache Cordova apps

Active Directory Authentication Library ([ADAL](https://msdn.microsoft.com/en-us/library/azure/jj573266.aspx)) plugin provides easy to use authentication functionality for your Apache Cordova apps by taking advantage of Windows Server Active Directory and Windows Azure Active Directory.
Here you can find the source code for the library.

  * [ADAL for Android](https://github.com/AzureAD/azure-activedirectory-library-for-android),
  * [ADAL for iOS](https://github.com/AzureAD/azure-activedirectory-library-for-objc),
  * [ADAL for .NET](https://github.com/AzureAD/azure-activedirectory-library-for-dotnet).

This plugin uses native SDKs for ADAL for each supported platform and provides single API across all platforms. Here is a quick usage sample:

```javascriptMicrosoft.ADAL.AuthenticationSettings.setUseBroker(false)

// Shows user authentication dialog if required
function authenticate(authCompletedCallback, errorCallback) {
  var authContext = new Microsoft.ADAL.AuthenticationContext(authority);  
  authContext.tokenCache.readItems().then(function (items) {
    if (items.length > 0) {
        authority = items[0].authority;
        authContext = new Microsoft.ADAL.AuthenticationContext(authority);
    }
    // Attempt to authorize user silently
    authContext.acquireTokenSilentAsync(resourceUri, clientId)
    .then(authCompletedCallback, function () {
        // We require user cridentials so triggers authentication dialog
        authContext.acquireTokenAsync(resourceUri, clientId, redirectUri)
        .then(authCompletedCallback, errorCallback);
    });
  });
};

authenticate(function(authResponse) {
  console.log("Token acquired: " + authResponse.accessToken);
  console.log("Token will expire on: " + authResponse.expiresOn);
}, function(err) {
  console.log("Failed to authenticate: " + err);
});
```

For more API documentation and examples see [Azure AD Cordova Getting Started](https://azure.microsoft.com/en-us/documentation/articles/active-directory-devquickstarts-cordova/) and JSDoc for exposed functionality stored in [www](https://github.com/AzureAD/azure-activedirectory-library-for-cordova/tree/master/www) subfolder.

## Supported platforms

  * Android (OS 4.0.3 and higher)
  * iOS
  * Windows (Windows 8.0, Windows 8.1, Windows 10 and Windows Phone 8.1)

## Creating new AuthenticationContext

The `Microsoft.ADAL.AuthenticationContext` class retrieves authentication tokens from Azure Active Directory and ADFS services.
Use `AuthenticationContext` constructor to synchronously create a new `AuthenticationContext` object.

#### Parameters
- __authority__: Authority url to send code and token requests. _(String)_ [Required]
- __validateAuthority__: Validate authority before sending token request. _(Boolean)_ (Default: `true`) [Optional]

#### Example
    var authContext = new Microsoft.ADAL.AuthenticationContext("https://login.windows.net/common"); 

## AuthenticationContext methods and properties
- acquireTokenAsync
- acquireTokenSilentAsync
- tokenCache

### acquireTokenAsync
The `AuthenticationContext.acquireTokenAsync` method asynchronously acquires token using interactive flow.
It **always shows UI** and skips token from cache.

- __resourceUrl__: Resource identifier. _(String)_ [Required]
- __clientId__: Client (application) identifier. _(String)_ [Required]
- __redirectUrl__: Redirect url for this application. _(String)_ [Required]
- __userId__: User identifier. _(String)_ [Optional]
- __extraQueryParameters__: Extra query parameters. Parameters should be escaped before passing to this method (e.g. using 'encodeURI()') _(String)_ [Optional]

__Note__: Those with experience in using native ADAL libraries should pay attention as the plugin uses `PromptBehaviour.Always`
when calling `AcquireToken` method and native libraries use `PromptBehaviour.Auto` by default. As a result
the plugin does not check the cache for existing access or refresh token. This is special design decision
so that `AcquireToken` is always showing a UX and `AcquireTokenSilent` never does so.

#### Example
```
var authContext = new Microsoft.ADAL.AuthenticationContext("https://login.windows.net/common");
authContext.acquireTokenAsync("https://graph.windows.net", "a5d92493-ae5a-4a9f-bcbf-9f1d354067d3", "http://MyDirectorySearcherApp")
  .then(function(authResponse) {
    console.log("Token acquired: " + authResponse.accessToken);
    console.log("Token will expire on: " + authResponse.expiresOn);
  }, function(err) {
    console.log("Failed to authenticate: " + err);
  });
```

### acquireTokenSilentAsync
The `AuthenticationContext.acquireTokenSilentAsync` method acquires token WITHOUT using interactive flow.
It checks the cache to return existing result if not expired. It tries to use refresh token if available.
If it fails to get token withoutd isplaying UI it will fail. This method guarantees that no UI will be shown to user.

- __resourceUrl__: Resource identifier. _(String)_ [Required]
- __clientId__: Client (application) identifier. _(String)_ [Required]
- __userId__: User identifier. _(String)_ [Optional]

#### Example
```
var authContext = new Microsoft.ADAL.AuthenticationContext("https://login.windows.net/common");
authContext.acquireTokenSilentAsync("https://graph.windows.net", "a5d92493-ae5a-4a9f-bcbf-9f1d354067d3")
  .then(function(authResponse) {
    console.log("Token acquired: " + authResponse.accessToken);
    console.log("Token will expire on: " + authResponse.expiresOn);
  }, function(err) {
    console.log("Failed to authenticate: " + err);
  });
```

### tokenCache
The `AuthenticationContext.tokenCache` property returns `TokenCache` class instance which stores access and refresh tokens.
This class could be used to retrieve cached items (`readItems` method), remove specific (`deleteItem` method) or all items (`clear` method).

#### Example
```
var authContext = new Microsoft.ADAL.AuthenticationContext("https://login.windows.net/common");
authContext.tokenCache.readItems().then(function (items) {
  console.log("Num cached items: " + items.length);
});
```

## Known issues and workarounds

## How to sign out

Similar to native labraries the plugin does not provide special method to sign out as it depends on server/application logic.
The recomendation here is

1. Step1: clear cache

    var authContext = new Microsoft.ADAL.AuthenticationContext("https://login.windows.net/common");
    authContext.tokenCache.clear();
1. Step2: make `XmlHttpRequest` (or open InAppBrowser instance) pointing to the sign out url.
In most cases the url should look like the following: `https://login.windows.net/{tenantid or "common"}/oauth2/logout?post_logout_redirect_uri={URL}`

## 'Class not registered' error on Windows

If you are using Visual Studio 2013 and see 'WinRTError: Class not registered' runtime error on Windows make sure Visual Studio [Update 5](https://www.visualstudio.com/news/vs2013-update5-vs) is installed.

## Multiple login windows issue

Multiple login dialog windows will be shown if `acquireTokenAsync` is called multiple times and the token could not be acquired silently (at the first run for example). Use a [promise queueing](https://www.npmjs.com/package/promise-queue)/semaphore logic in the app code to avoid this issue.

## Installation Instructions

### Prerequisites

* [NodeJS and NPM](https://nodejs.org/)

* [Cordova CLI](https://cordova.apache.org/)

  Cordova CLI can be easily installed via NPM package manager: `npm install -g cordova`

* Additional prerequisites for each target platform can be found at [Cordova platforms documentation](http://cordova.apache.org/docs/en/edge/guide_platforms_index.md.html#Platform%20Guides) page:
 * [Instructions for Android](http://cordova.apache.org/docs/en/edge/guide_platforms_android_index.md.html#Android%20Platform%20Guide)
 * [Instructions for iOS](http://cordova.apache.org/docs/en/edge/guide_platforms_ios_index.md.html#iOS%20Platform%20Guide)
 * [Instructions for Windows] (http://cordova.apache.org/docs/en/edge/guide_platforms_win8_index.md.html#Windows%20Platform%20Guide)

### To build and run sample application

  * Clone plugin repository into a directory of your choice

    `git clone https://github.com/AzureAD/azure-activedirectory-library-for-cordova.git`

  * Create a project and add the platforms you want to support

    `cordova create ADALSample --copy-from="azure-activedirectory-library-for-cordova/sample"`

    `cd ADALSample`

    `cordova platform add android`

    `cordova platform add ios`

    `cordova platform add windows`

  * Add the plugin to your project

    `cordova plugin add ../azure-activedirectory-library-for-cordova`

  * Build and run application: `cordova run`.


## Setting up an Application in Azure AD

You can find detailed instructions how to set up a new application in Azure AD [here](https://github.com/AzureADSamples/NativeClient-MultiTarget-DotNet#step-4--register-the-sample-with-your-azure-active-directory-tenant).

## Tests

This plugin contains test suite, based on [Cordova test-framework plugin](https://github.com/apache/cordova-plugin-test-framework). The test suite is placed under `tests` folder at the root or repo and represents a separate plugin.

To run the tests you need to create a new application as described in [Installation Instructions section](#installation-instructions) and then do the following steps:

  * Add test suite to application

    `cordova plugin add ../azure-activedirectory-library-for-cordova/tests`

  * Update application's config.xml file: change `<content src="index.html" />` to `<content src="cdvtests/index.html" />`
  * Change AD-specific settings for test application at the beginning of `plugins\cordova-plugin-ms-adal\www\tests.js` file. Update `AUTHORITY_URL`, `RESOURCE_URL`, `REDIRECT_URL`, `APP_ID` to values, provided by your Azure AD. For instructions how to setup an Azure AD application see [Setting up an Application in Azure AD section](#setting-up-an-application-in-azure-ad).
  * Build and run application.

## Windows Quirks ##
[There is currently a Cordova issue](https://issues.apache.org/jira/browse/CB-8615), which entails the need of the hook-based workaround.
The workaround is to be discarded after a fix is applied.

### Using ADFS/SSO
To use ADFS/SSO on Windows platform (Windows Phone 8.1 is not supported for now) add the following preference into `config.xml`:
`<preference name="adal-use-corporate-network" value="true" />`

`adal-use-corporate-network` is `false` by default.

It will add all needed application capabilities and toggle authContext to support ADFS. You can change its value to `false` and back later, or remove it from `config.xml` - call `cordova prepare` after it to apply the changes.

__Note__: You should not normally use `adal-use-corporate-network` as it adds capabilities, which prevents an app from being published in the Windows Store.

## Android Quirks ##
### Broker support
The following method should be used to enable broker component support (delivered with Intune's Company portal app). Read [ADAL for Android](https://github.com/AzureAD/azure-activedirectory-library-for-android) to understand broker concept in more details.

`Microsoft.ADAL.AuthenticationSettings.setUseBroker(true);`

__Note__: Developer needs to register special redirectUri for broker usage. RedirectUri is in the format of `msauth://packagename/Base64UrlencodedSignature`

## Copyrights ##
Copyright (c) Microsoft Open Technologies, Inc. All rights reserved.

Licensed under the Apache License, Version 2.0 (the "License"); you may not use these files except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
