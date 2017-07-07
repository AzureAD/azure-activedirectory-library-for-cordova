0.10.1 - July 5, 2017
* windows: added compatibility with VS2017
* android: upgraded ADAL native SDK version to 1.12.0 

0.10.0 - May 12, 2017
* Add logger for consuming internal logs from native libraries
* Bump .NET SDK version to 3.13.8
* Bump iOS version to 2.3.1
* Resolve build issue with AZME plugin
* Fix Appveyor CI

0.9.0 - February 8, 2017
* Use alternative sources to populate 'userInfo' in case if 'idToken' is not defined
* Make AuthenticationSettings.setUseBroker available across platforms
* Bump Android version to 1.10.0
* windows: Fix login issues on Windows when user id is specified
* android: Fix silent token acquisition using broker component
* ios: Put ADAL CODE_SIGN_ENTITLEMENTS according to ios@4.3.0 Api

0.8.1 - September 22, 2016
* added `cordovaDependencies` section to package.json
* ios: bump and rebuild ADAL SDK to 2.2.6

0.8.0 - September, 2016
* ios: fix login on `iOS10`
* ios: switched from native SDK `1.x` to `2.x` (`2.2.5`)
* ios: token cache delete method should compare with unique name
* android: prevent refreshing on screen rotation
* windows: upgraded native SDK to `2.28.1`
* windows: adding Windows native libs without hooks
* windows: replaced deprecated `pre_package` hook with `after_prepare`
* added support of native error codes: [`err.code`](https://github.com/AzureAD/azure-activedirectory-library-for-cordova#handling-errors)
* fixed #84 User display id looks bad with utf8 characters
* added engine tags to specify min cordova platforms versions supported
* correctly report userId for not synced users

0.7.1 - May 5, 2016
* android: bump ADAL SDK version to 1.18
* android: Fixing build error caused by improper type casting #62

0.7.0 - April 27, 2016

* fixed incorrect token expiring issue (#28)
* android: dropped ant support
* android: added setUseBroker method support (broker is now disabled by default)
* android: fixed broker permissions issue when targeting Api 23 or higher
* android: upgraded ADAL native SDK version (1.1.17)
* android: made cache working on Android 4.2.x and below
* windows: fixed missing capability in package.windows10.appxmanifest in case of SSO enabled

0.6.2 - March 10, 2016

* ios: upgraded ADAL native SDK version (1.2.5)
* android: upgraded ADAL native SDK version (1.1.12)
* windows: upgraded ADAL native SDK version (2.22.302111727)
* windows: fixed Windows Phone 8.1 arm build architecture compatibility issue
* windows: fixed Windows Phone 8.1 deploy from Visual Studio issue
* include TypeScript definition file

0.6.1 - February 12, 2016

* ios: fixed #16 The file `ADALiOS.entitlements` couldn’t be opened
* ios: fixed #35 `acquireTokenSilentAsync` fails to return a token after a successful login
* ios: node version 5.6.0 support

0.6.0 - June 10, 2015

* ios: correctly support projects with a space in their name
* android: ant support
* Add Android permissions for broker.
* windows: `sso` support enhancements and bug fixes
* windows: Windows10 support and the latest native libs
* fixes #9 Failure to Load Resource (utility.js.map)

0.5.0 - April 28, 2015

* Initial version
