/*******************************************************************************
 * Copyright (c) Microsoft Open Technologies, Inc.
 * All Rights Reserved
 * See License in the project root for license information.
 ******************************************************************************/

#import "CordovaAdalUtils.h"

@implementation CordovaAdalUtils

+ (id)ADUserInformationToDictionary:(ADUserInformation *)obj
{
    if (!obj)
    {
        return [NSNull null];
    }
    
    NSMutableDictionary *dict = [NSMutableDictionary dictionaryWithCapacity:1];
    
    [dict setObject:ObjectOrNull(obj.userId) forKey:@"userId"];
    if ([obj userIdDisplayable])
    {
        [dict setObject:ObjectOrNull(obj.userId) forKey:@"displayableId"];
    }
    [dict setObject:ObjectOrNull([obj userId]) forKey:@"uniqueId"];
    [dict setObject:ObjectOrNull([obj familyName]) forKey:@"familyName"];
    [dict setObject:ObjectOrNull([obj givenName]) forKey:@"givenName"];
    [dict setObject:ObjectOrNull([obj identityProvider]) forKey:@"identityProvider"];
    [dict setObject:ObjectOrNull([obj tenantId]) forKey:@"tenantId"];
    return dict;
}

+ (NSMutableDictionary *)ADAuthenticationResultToDictionary:(ADAuthenticationResult *)obj
{
    NSMutableDictionary *dict = (obj.status == AD_SUCCEEDED) ? [CordovaAdalUtils ADTokenCacheStoreItemToDictionary:obj.tokenCacheItem] : [CordovaAdalUtils ADAuthenticationErrorToDictionary:obj.error];
    
    [dict setObject:[NSNumber numberWithInt:obj.status] forKey:@"statusCode"];
    
    return dict;
}


+ (NSMutableDictionary *)ADAuthenticationErrorToDictionary:(ADAuthenticationError *)obj
{
    NSMutableDictionary *dict = [NSMutableDictionary dictionaryWithCapacity:1];
    [dict setObject:[NSNumber numberWithInteger: obj.code] forKey:@"errorCode"];
    [dict setObject:ObjectOrNull(obj.protocolCode) forKey:@"error"];
    [dict setObject:ObjectOrNull(obj.errorDetails) forKey:@"errorDescription"];
    return dict;
}

+ (NSMutableDictionary *)ADTokenCacheStoreItemToDictionary:(ADTokenCacheItem *)obj
{
    NSMutableDictionary *dict = [NSMutableDictionary dictionaryWithCapacity:1];
    
    [dict setObject:ObjectOrNull(obj.resource) forKey:@"resource"];
    [dict setObject:ObjectOrNull(obj.authority) forKey:@"authority"];
    [dict setObject:ObjectOrNull(obj.clientId) forKey:@"clientId"];
    [dict setObject:ObjectOrNull(obj.accessToken) forKey:@"accessToken"];
    [dict setObject:ObjectOrNull(obj.accessTokenType) forKey:@"accessTokenType"];
    [dict setObject:[NSNumber numberWithBool:obj.refreshToken != nil] forKey:@"isMultipleResourceRefreshToken"];
    
    if (obj.expiresOn) // could be nil
    {
        [dict setObject:[NSNumber numberWithDouble:[obj.expiresOn timeIntervalSince1970] * 1000] forKey:@"expiresOn"];
    }
    
    if (obj.userInformation)
    {
        [dict setObject:[CordovaAdalUtils ADUserInformationToDictionary:obj.userInformation] forKey:@"userInfo"];
        [dict setObject:ObjectOrNull([obj.userInformation tenantId]) forKey:@"tenantId"];
        [dict setObject:ObjectOrNull(obj.userInformation.rawIdToken) forKey:@"idToken"];
    }
    
    return dict;
}

static id ObjectOrNull(id object)
{
    return object ?: [NSNull null];
}

+ (NSString *)mapUserIdToUserName:(ADAuthenticationContext *)authContext
                           userId:(NSString *)userId
{
    // not nil or empty string
    if (userId && [userId length] > 0)
    {
        ADAuthenticationError *error;
        
        ADKeychainTokenCache* cacheStore = [ADKeychainTokenCache new];
        NSArray *cacheItems = [cacheStore allItems:&error];
        
        if (error == nil)
        {
            for (ADTokenCacheItem *obj in cacheItems)
            {
                if ([userId isEqualToString:obj.userInformation.userObjectId])
                {
                    return obj.userInformation.userId;
                }
            }
        }
    }
    return userId;
}

@end
