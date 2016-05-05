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
