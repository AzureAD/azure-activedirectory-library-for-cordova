// Type definitions for Active Directory Authentication Library (ADAL) plugin for Apache Cordova apps
// Project: https://github.com/AzureAD/azure-activedirectory-library-for-cordova
// Definitions by: [AUTHOR NAME] <[AUTHOR URL]>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

declare namespace Microsoft {

    namespace ADAL {

        interface IUserInfo {
            displayableId: string,
            userId: string,
            familyName: string,
            givenName: string,
            identityProvider: string,
            passwordChangeUrl: string,
            passwordExpiresOn: Date,
            uniqueId: string,
        }

        interface ITokenCacheItem {
            accessToken: string,
            authority: string,
            clientId: string,
            displayableId: string,
            expiresOn: Date,
            isMultipleResourceRefreshToken: boolean,
            resource: string,
            tenantId: string,
            userInfo: IUserInfo
        }

        interface ITokenCache {
            contextAuthority: string
        }

        interface IPromiseTokenCacheItems {
            then(doneCallBack: (tokenCacheItems: ITokenCacheItem[]) => void, failCallBack?: (message: string) => void);
        }

        class TokenCache implements ITokenCache {
            contextAuthority: string

            /**
            * Gets all cached items.
            *
            * @returns {Promise} Promise either fulfilled with array of cached items or rejected with error.
            */
            readItems(): IPromiseTokenCacheItems;
        }

        interface IAuthenticationResult {
            accessToken: string,
            accessTokenType: string,
            expiresOn: Date,
            idToken: string,
            isMultipleResourceRefreshToken: boolean,
            status: string,
            statusCode: string,
            tenantId: string,
            userInfo: IUserInfo
        }

        interface IPromiseAuthenticationResult {
            then(doneCallBack: (context: IAuthenticationResult) => void, failCallBack?: (message: string) => void);
        }

        interface IAuthenticationContext {
            authority: string,
            validateAuthority: boolean,
            tokenCache: TokenCache

            /**
            * Acquires token using interactive flow if needed. It checks the cache to return existing result
            * if not expired. It tries to use refresh token if available. If it fails to get token with
            * refresh token, it will remove this refresh token from cache and start authentication.
            *
            * @param   {String}  resourceUrl Resource identifier
            * @param   {String}  clientId    Client (application) identifier
            * @param   {String}  redirectUrl Redirect url for this application
            * @param   {String}  userId      User identifier (optional)
            * @param   {String}  extraQueryParameters
            *                                Extra query parameters (optional)
            *                                Parameters should be escaped before passing to this method (e.g. using 'encodeURI()')
            *
            * @returns {Promise} Promise either fulfilled with AuthenticationResult object or rejected with error
            */
            acquireTokenAsync(resourceUrl: string, clientId: string, redirectUrl: string, userId?: string, extraQueryParameters?: string): IPromiseAuthenticationResult;

            /**
             * Acquires token WITHOUT using interactive flow. It checks the cache to return existing result
             * if not expired. It tries to use refresh token if available. If it fails to get token without
             * displaying UI it will fail. This method guarantees that no UI will be shown to user.
             *
             * @param   {String}  resourceUrl Resource identifier
             * @param   {String}  clientId    Client (application) identifier
             * @param   {String}  userId      User identifier (optional)
             *
             * @returns {Promise} Promise either fulfilled with AuthenticationResult object or rejected with error
             */
            acquireTokenSilentAsync(resourceUrl: string, clientId: string, userId: string): IPromiseAuthenticationResult;

        }

        interface IPromiseAuthenticationContext {
            then(doneCallBack: (context: IAuthenticationContext) => void, failCallBack?: (message: string) => void);
        }

        class AuthenticationContext implements IAuthenticationContext {
            authority: string
            validateAuthority: boolean
            tokenCache: TokenCache

            constructor(Authority: string, ValidateAuthority?: boolean);

            /**
            * Constructs context asynchronously to use with known authority to get the token.
            * It reuses existing context for this authority URL in native proxy or creates a new one if it doesn't exists.
            *
            * @param   {String}   authority         Authority url to send code and token requests
            * @param   {Boolean}  validateAuthority Validate authority before sending token request. True by default
            *
            * @returns {Promise}  Promise either fulfilled with newly created authentication context or rejected with error
            */
            static createAsync(authority: string, validateAuthority?: boolean): IPromiseAuthenticationContext;

            /**
            * Acquires token using interactive flow if needed. It checks the cache to return existing result
            * if not expired. It tries to use refresh token if available. If it fails to get token with
            * refresh token, it will remove this refresh token from cache and start authentication.
            *
            * @param   {String}  resourceUrl Resource identifier
            * @param   {String}  clientId    Client (application) identifier
            * @param   {String}  redirectUrl Redirect url for this application
            * @param   {String}  userId      User identifier (optional)
            * @param   {String}  extraQueryParameters
            *                                Extra query parameters (optional)
            *                                Parameters should be escaped before passing to this method (e.g. using 'encodeURI()')
            *
            * @returns {Promise} Promise either fulfilled with AuthenticationResult object or rejected with error
            */
            acquireTokenAsync(resourceUrl: string, clientId: string, redirectUrl: string, userId?: string, extraQueryParameters?: string): IPromiseAuthenticationResult;

            /**
             * Acquires token WITHOUT using interactive flow. It checks the cache to return existing result
             * if not expired. It tries to use refresh token if available. If it fails to get token without
             * displaying UI it will fail. This method guarantees that no UI will be shown to user.
             *
             * @param   {String}  resourceUrl Resource identifier
             * @param   {String}  clientId    Client (application) identifier
             * @param   {String}  userId      User identifier (optional)
             *
             * @returns {Promise} Promise either fulfilled with AuthenticationResult object or rejected with error
             */
            acquireTokenSilentAsync(resourceUrl: string, clientId: string, userId: string): IPromiseAuthenticationResult;

        }
    }
}



