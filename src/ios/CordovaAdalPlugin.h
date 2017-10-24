/*******************************************************************************
 * Copyright (c) Microsoft Open Technologies, Inc.
 * All Rights Reserved
 * See License in the project root for license information.
 ******************************************************************************/

#import <Foundation/Foundation.h>
#import <Cordova/CDVPlugin.h>

#import <ADAL/ADAuthenticationContext.h>

// Implements Apache Cordova plugin for Microsoft Azure ADAL
@interface CordovaAdalPlugin : CDVPlugin

- (void)pluginInitialize;

// AuthenticationContext methods
- (void)createAsync:(CDVInvokedUrlCommand *)command;
- (void)acquireTokenAsync:(CDVInvokedUrlCommand *)command;
- (void)acquireTokenSilentAsync:(CDVInvokedUrlCommand *)command;

// TokenCache methods
- (void)tokenCacheClear:(CDVInvokedUrlCommand *)command;
- (void)tokenCacheReadItems:(CDVInvokedUrlCommand *)command;
- (void)tokenCacheDeleteItem:(CDVInvokedUrlCommand *)command;

- (void)setLogger:(CDVInvokedUrlCommand *)command;
- (void)setLogLevel:(CDVInvokedUrlCommand *) command;
@end
