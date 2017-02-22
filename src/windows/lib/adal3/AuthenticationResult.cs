using Microsoft.IdentityModel.Clients.ActiveDirectory;
using System;
using OriginalAuthenticationResult = Microsoft.IdentityModel.Clients.ActiveDirectory.AuthenticationResult;

namespace ADAL3WinMDProxy
{
    public sealed class AuthenticationResult
    {
        public AuthenticationResult() { }

        enum AuthenticationStatus
        {
            Success = 0,
            ClientError = -1,
            ServiceError = -2
        }

        internal void Initialize(OriginalAuthenticationResult authResult)
        {
            AccessToken = authResult.AccessToken;
            AccessTokenType = authResult.AccessTokenType;
            ExpiresOn = authResult.ExpiresOn;
            IdToken = authResult.IdToken;
            TenantId = authResult.TenantId;
            UserInfo = UserInfo.From(authResult.UserInfo);

            Status = (int)AuthenticationStatus.Success;

            ReplaceNullStringPropertiesWithEmptyString();
        }

        internal AuthenticationResult(Exception ex)
        {
            this.Status = (int)AuthenticationStatus.ClientError;
            this.StatusCode = 0;

            if (ex is ArgumentNullException)
            {
                this.Code = AdalError.InvalidArgument;
                this.Message = string.Format("Parameter '{0}' cannot be null", ((ArgumentNullException)ex).ParamName);
            }
            else if (ex is ArgumentException)
            {
                this.Code = AdalError.InvalidArgument;
                this.Message = ex.Message;
            }
            else if (ex is AdalException)
            {
                this.Code = ((AdalException)ex).ErrorCode;
                this.Message = (ex.InnerException != null) ? ex.Message + ". " + ex.InnerException.Message : ex.Message;
                AdalServiceException serviceException = ex as AdalServiceException;
                if (serviceException != null)
                {
                    this.Status = (int)AuthenticationStatus.ServiceError;
                    this.StatusCode = serviceException.StatusCode;
                }
            }
            else
            {
                this.Code = AdalError.AuthenticationFailed;
                this.Message = ex.Message;
            }

            ReplaceNullStringPropertiesWithEmptyString();
        }

        public string AccessToken { get; set; }
        public string AccessTokenType { get; set; }
        public DateTimeOffset ExpiresOn { get; set; }
        public string IdToken { get; set; }
        public string TenantId { get; set; }
        public UserInfo UserInfo { get; set; }

        public int Status { get; set; }
        public int StatusCode { get; set; }
        public string Message { get; set; }
        public string Code { get; set; }

        /// <summary>
        /// The Windows Runtime string type is a value type and has no null value. 
        /// The .NET projection prohibits passing a null .NET string across the Windows Runtime ABI boundary for this reason.
        /// </summary>
        internal void ReplaceNullStringPropertiesWithEmptyString()
        {
            this.AccessToken = this.AccessToken ?? string.Empty;
            this.AccessTokenType = this.AccessTokenType ?? string.Empty;
            this.Code = this.Code ?? string.Empty;
            this.Message = this.Message ?? string.Empty;
            this.IdToken = this.IdToken ?? string.Empty;
            this.TenantId = this.TenantId ?? string.Empty;
            if (this.UserInfo != null)
            {
                this.UserInfo.DisplayableId = this.UserInfo.DisplayableId ?? string.Empty;
                this.UserInfo.FamilyName = this.UserInfo.FamilyName ?? string.Empty;
                this.UserInfo.GivenName = this.UserInfo.GivenName ?? string.Empty;
                this.UserInfo.IdentityProvider = this.UserInfo.IdentityProvider ?? string.Empty;
            }
        }

        internal static AuthenticationResult From(OriginalAuthenticationResult originalAuthResult)
        {
            var result = new AuthenticationResult();
            result.Initialize(originalAuthResult);
            return result;
        }
    }
}
