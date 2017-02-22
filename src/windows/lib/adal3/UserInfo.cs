using System;
using OriginalUserInfo = Microsoft.IdentityModel.Clients.ActiveDirectory.UserInfo;

namespace ADAL3WinMDProxy
{
    public sealed class UserInfo
    {
        public UserInfo() { }

        internal void Initialize(OriginalUserInfo userInfo)
        {
            DisplayableId = userInfo.DisplayableId;
            UserId = userInfo.UniqueId;
            FamilyName = userInfo.FamilyName;
            GivenName = userInfo.GivenName;
            IdentityProvider = userInfo.IdentityProvider;
            PasswordChangeUrl = userInfo.PasswordChangeUrl != null ? userInfo.PasswordChangeUrl.ToString() : "";
            PasswordExpiresOn = userInfo.PasswordExpiresOn;
            UniqueId = userInfo.UniqueId;
        }

        public string DisplayableId { get; set; }
        public string UserId { get; set; }
        public string FamilyName { get; set; }
        public string GivenName { get; set; }
        public string IdentityProvider { get; set; }
        public string PasswordChangeUrl { get; set; }
        public DateTimeOffset? PasswordExpiresOn { get; set; }
        public string UniqueId { get; set; }

        internal static UserInfo From(OriginalUserInfo userInfo)
        {
            var result = new UserInfo();
            result.Initialize(userInfo);
            return result;
        }
    }
}
