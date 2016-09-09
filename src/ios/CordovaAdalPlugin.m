/*******************************************************************************
 * Copyright (c) Microsoft Open Technologies, Inc.
 * All Rights Reserved
 * See License in the project root for license information.
 ******************************************************************************/

#import "CordovaAdalPlugin.h"
#import "CordovaAdalUtils.h"

#import <ADAL/ADAL.h>

@implementation CordovaAdalPlugin

- (void)createAsync:(CDVInvokedUrlCommand *)command
{
    [self.commandDelegate runInBackground:^{
        @try
        {
            NSString *authority = ObjectOrNil([command.arguments objectAtIndex:0]);
            BOOL validateAuthority = [[command.arguments objectAtIndex:1] boolValue];

            [CordovaAdalPlugin getOrCreateAuthContext:authority
                                    validateAuthority:validateAuthority];

            CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];

            [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
        }
        @catch (ADAuthenticationError *error)
        {
            CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR
                                                          messageAsDictionary:[CordovaAdalUtils ADAuthenticationErrorToDictionary:error]];
            [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
        }
    }];
}

- (void)acquireTokenAsync:(CDVInvokedUrlCommand *)command
{
    [self.commandDelegate runInBackground:^{
        @try
        {
            NSString *authority = ObjectOrNil([command.arguments objectAtIndex:0]);
            BOOL validateAuthority = [[command.arguments objectAtIndex:1] boolValue];
            NSString *resourceId = ObjectOrNil([command.arguments objectAtIndex:2]);
            NSString *clientId = ObjectOrNil([command.arguments objectAtIndex:3]);
            NSURL *redirectUri = [NSURL URLWithString:[command.arguments objectAtIndex:4]];
            NSString *userId = ObjectOrNil([command.arguments objectAtIndex:5]);
            NSString *extraQueryParameters = ObjectOrNil([command.arguments objectAtIndex:6]);

            ADAuthenticationContext *authContext = [CordovaAdalPlugin getOrCreateAuthContext:authority
                                                                           validateAuthority:validateAuthority];
            // `x-msauth-` redirect url prefix means we should use brokered authentication
            // https://github.com/AzureAD/azure-activedirectory-library-for-objc#brokered-authentication
            authContext.credentialsType = (redirectUri.scheme && [redirectUri.scheme hasPrefix: @"x-msauth-"]) ?
                AD_CREDENTIALS_AUTO : AD_CREDENTIALS_EMBEDDED;

            // TODO iOS sdk requires user name instead of guid so we should map provided id to a known user name
            userId = [CordovaAdalUtils mapUserIdToUserName:authContext
                                                    userId:userId];
            dispatch_async(dispatch_get_main_queue(), ^{
                [authContext
                 acquireTokenWithResource:resourceId
                 clientId:clientId
                 redirectUri:redirectUri
                 promptBehavior:AD_PROMPT_ALWAYS
                 userId:userId
                 extraQueryParameters:extraQueryParameters
                 completionBlock:^(ADAuthenticationResult *result) {

                     NSMutableDictionary *msg = [CordovaAdalUtils ADAuthenticationResultToDictionary: result];
                     CDVCommandStatus status = (AD_SUCCEEDED != result.status) ? CDVCommandStatus_ERROR : CDVCommandStatus_OK;
                     CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:status messageAsDictionary: msg];
                     [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
                 }];
            });
        }
        @catch (ADAuthenticationError *error)
        {
            CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR
                                                          messageAsDictionary:[CordovaAdalUtils ADAuthenticationErrorToDictionary:error]];
            [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
        }
    }];
}

- (void)acquireTokenSilentAsync:(CDVInvokedUrlCommand *)command
{
    [self.commandDelegate runInBackground:^{
        @try
        {
            NSString *authority = ObjectOrNil([command.arguments objectAtIndex:0]);
            BOOL validateAuthority = [[command.arguments objectAtIndex:1] boolValue];
            NSString *resourceId = ObjectOrNil([command.arguments objectAtIndex:2]);
            NSString *clientId = ObjectOrNil([command.arguments objectAtIndex:3]);
            NSString *userId = ObjectOrNil([command.arguments objectAtIndex:4]);

            ADAuthenticationContext *authContext = [CordovaAdalPlugin getOrCreateAuthContext:authority
                                                                           validateAuthority:validateAuthority];

            // TODO iOS sdk requires user name instead of guid so we should map provided id to a known user name
            userId = [CordovaAdalUtils mapUserIdToUserName:authContext
                                                    userId:userId];

            [authContext acquireTokenSilentWithResource:resourceId
                                               clientId:clientId
                                            redirectUri:nil
                                                 userId:userId
                                        completionBlock:^(ADAuthenticationResult *result) {
                                            NSMutableDictionary *msg = [CordovaAdalUtils ADAuthenticationResultToDictionary: result];
                                            CDVCommandStatus status = (AD_SUCCEEDED != result.status) ? CDVCommandStatus_ERROR : CDVCommandStatus_OK;
                                            CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:status messageAsDictionary: msg];
                                            [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
                                        }];
        }
        @catch (ADAuthenticationError *error)
        {
            CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR
                                                          messageAsDictionary:[CordovaAdalUtils ADAuthenticationErrorToDictionary:error]];
            [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
        }
    }];
}

- (void)tokenCacheClear:(CDVInvokedUrlCommand *)command
{
    [self.commandDelegate runInBackground:^{
        @try
        {
            ADAuthenticationError *error;

            ADKeychainTokenCache* cacheStore = [ADKeychainTokenCache new];

            NSArray *cacheItems = [cacheStore allItems:&error];

            for (int i = 0; i < cacheItems.count; i++)
            {
                [cacheStore removeItem: cacheItems[i] error: &error];
            }

            if (error != nil)
            {
                @throw(error);
            }

            CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];

            [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
        }
        @catch (ADAuthenticationError *error)
        {
            CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR
                                                          messageAsDictionary:[CordovaAdalUtils ADAuthenticationErrorToDictionary:error]];
            [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
        }
    }];
}

- (void)tokenCacheReadItems:(CDVInvokedUrlCommand *)command
{
    [self.commandDelegate runInBackground:^{
        @try
        {
            ADAuthenticationError *error;

            ADKeychainTokenCache* cacheStore = [ADKeychainTokenCache new];

            //get all items from cache
            NSArray *cacheItems = [cacheStore allItems:&error];

            NSMutableArray *items = [NSMutableArray arrayWithCapacity:cacheItems.count];

            if (error != nil)
            {
                @throw(error);
            }

            for (id obj in cacheItems)
            {
                [items addObject:[CordovaAdalUtils ADTokenCacheStoreItemToDictionary:obj]];
            }

            CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                                               messageAsArray:items];

            [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
        }
        @catch (ADAuthenticationError *error)
        {
            CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR
                                                          messageAsDictionary:[CordovaAdalUtils ADAuthenticationErrorToDictionary:error]];
            [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
        }
    }];
}
- (void)tokenCacheDeleteItem:(CDVInvokedUrlCommand *)command
{
    [self.commandDelegate runInBackground:^{
        @try
        {
            ADAuthenticationError *error;

            NSString *authority = ObjectOrNil([command.arguments objectAtIndex:0]);
            BOOL validateAuthority = [[command.arguments objectAtIndex:1] boolValue];
            NSString *itemAuthority = ObjectOrNil([command.arguments objectAtIndex:2]);
            NSString *resourceId = ObjectOrNil([command.arguments objectAtIndex:3]);
            NSString *clientId = ObjectOrNil([command.arguments objectAtIndex:4]);
            NSString *userId = ObjectOrNil([command.arguments objectAtIndex:5]);

            ADAuthenticationContext *authContext = [CordovaAdalPlugin getOrCreateAuthContext:authority
                                                                           validateAuthority:validateAuthority];

            // TODO iOS sdk requires user name instead of guid so we should map provided id to a known user name
            userId = [CordovaAdalUtils mapUserIdToUserName:authContext
                                                    userId:userId];

            ADKeychainTokenCache* cacheStore = [ADKeychainTokenCache new];

            //get all items from cache
            NSArray *cacheItems = [cacheStore allItems:&error];

            if (error != nil)
            {
                @throw(error);
            }

            for (ADTokenCacheItem*  item in cacheItems)
            {
                NSDictionary *itemAllClaims = [[item userInformation] allClaims];

                NSString * userUniqueName = (itemAllClaims && itemAllClaims[@"unique_name"]) ? itemAllClaims[@"unique_name"] : nil;

                if ([itemAuthority isEqualToString:[item authority]]
                    && ((userUniqueName != nil && [userUniqueName isEqualToString:userId])
                        || [userId isEqualToString:[[item userInformation] userId]])
                    && [clientId isEqualToString:[item clientId]]
                    // resource could be nil which is fine
                    && ((!resourceId && ![item resource]) || [resourceId isEqualToString:[item resource]])) {

                    //remove item
                    [cacheStore removeItem:item error: &error];

                    if (error != nil)
                    {
                        @throw(error);
                    }
                }

            }

            CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
            [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
        }
        @catch (ADAuthenticationError *error)
        {
            CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR
                                                          messageAsDictionary:[CordovaAdalUtils ADAuthenticationErrorToDictionary:error]];
            [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
        }
    }];
}

static NSMutableDictionary *existingContexts = nil;

+ (ADAuthenticationContext *)getOrCreateAuthContext:(NSString *)authority
                                  validateAuthority:(BOOL)validate
{
    if (!existingContexts)
    {
        existingContexts = [NSMutableDictionary dictionaryWithCapacity:1];
    }

    ADAuthenticationContext *authContext = [existingContexts objectForKey:authority];

    if (!authContext)
    {
        ADAuthenticationError *error;

        authContext = [ADAuthenticationContext authenticationContextWithAuthority:authority
                                                                validateAuthority:validate
                                                                            error:&error];
        if (error != nil)
        {
            @throw(error);
        }

        [existingContexts setObject:authContext forKey:authority];
    }

    return authContext;
}

static id ObjectOrNil(id object)
{
    return [object isKindOfClass:[NSNull class]] ? nil : object;
}

@end
