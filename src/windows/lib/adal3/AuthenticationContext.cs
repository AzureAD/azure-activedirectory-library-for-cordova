using Microsoft.IdentityModel.Clients.ActiveDirectory;
using System;
using System.Threading.Tasks;
using Windows.Foundation;
using Windows.UI.Core;
using OriginalAuthenticationContext = Microsoft.IdentityModel.Clients.ActiveDirectory.AuthenticationContext;
using OriginalAuthenticationResult = Microsoft.IdentityModel.Clients.ActiveDirectory.AuthenticationResult;

namespace ADAL3WinMDProxy
{
    public sealed class AuthenticationContext
    {
        private OriginalAuthenticationContext _context;
        public TokenCache TokenCache { get; set; }

        public AuthenticationContext(string authority, bool validateAuthority)
        {
            _context = new OriginalAuthenticationContext(authority, validateAuthority);
            TokenCache = TokenCache.From(_context.TokenCache);
        }

        public bool UseCorporateNetwork { get; set; }

        public IAsyncOperation<AuthenticationResult> AcquireTokenAsync(string resourceUrl, string clientId,
            Uri redirectUrl, int promptBehavior, UserIdentifier userIdentifier, string extraQueryParameters)
        {
            return CoreWindow.GetForCurrentThread().Dispatcher.RunAndAwaitAsync(CoreDispatcherPriority.Normal,
                async () =>
                {
                    return await AcquireTokenAsyncInternal(resourceUrl, clientId,
                        redirectUrl, promptBehavior, userIdentifier, extraQueryParameters);
                }).AsAsyncOperation();
        }

        public IAsyncOperation<AuthenticationResult> AcquireTokenSilentAsync(string resourceUrl, string clientId, UserIdentifier userIdentifier)
        {
            return CoreWindow.GetForCurrentThread().Dispatcher.RunAndAwaitAsync(CoreDispatcherPriority.Normal,
                async () =>
                {
                    return await AcquireTokenSilentAsyncInternal(resourceUrl, clientId, userIdentifier);
                }).AsAsyncOperation();
        }

        private async Task<AuthenticationResult> AcquireTokenAsyncInternal(string resourceUrl, string clientId,
            Uri redirectUrl, int promptBehavior, UserIdentifier userIdentifier, string extraQueryParameters)
        {
            OriginalAuthenticationResult authResult = null;
            AuthenticationResult result;

            var platformParameters = new PlatformParameters(PromptBehavior.IntToEnum(promptBehavior), UseCorporateNetwork);

            try
            {
                authResult = await _context.AcquireTokenAsync(resourceUrl, clientId, redirectUrl, platformParameters, userIdentifier.GetOriginalUserIdentifier(), extraQueryParameters);
                result = AuthenticationResult.From(authResult);
            }
            catch (Exception ex)
            {
                result = new AuthenticationResult(ex);
            }

            return result;
        }

        private async Task<AuthenticationResult> AcquireTokenSilentAsyncInternal(string resourceUrl, string clientId,
            UserIdentifier userIdentifier)
        {
            OriginalAuthenticationResult authResult = null;
            AuthenticationResult result;

            try
            {
                authResult = await _context.AcquireTokenSilentAsync(resourceUrl, clientId, userIdentifier.GetOriginalUserIdentifier());
                result = AuthenticationResult.From(authResult);
            }
            catch (Exception ex)
            {
                result = new AuthenticationResult(ex);
            }

            return result;
        }
    }
}
