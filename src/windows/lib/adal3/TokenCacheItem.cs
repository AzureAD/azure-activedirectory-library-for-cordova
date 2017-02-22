using System;
using OriginalTokenCacheItem = Microsoft.IdentityModel.Clients.ActiveDirectory.TokenCacheItem;

namespace ADAL3WinMDProxy
{
    public sealed class TokenCacheItem
    {
        internal void Initialize(OriginalTokenCacheItem item)
        {
            AccessToken = item.AccessToken;
            Authority = item.Authority;
            ClientId = item.ClientId;
            DisplayableId = item.DisplayableId;
            ExpiresOn = item.ExpiresOn;
            Resource = item.Resource;
            TenantId = item.TenantId;
            IdToken = item.IdToken;
            UniqueId = item.UniqueId;

            UserInfo = new UserInfo();
            UserInfo.GivenName = item.GivenName;
            UserInfo.FamilyName = item.FamilyName;
            UserInfo.IdentityProvider = item.IdentityProvider;
            UserInfo.UniqueId = item.UniqueId;
            UserInfo.UserId = item.DisplayableId ?? item.UniqueId;
            UserInfo.DisplayableId = item.DisplayableId;
        }

        public string AccessToken { get; set; }
        public string Authority { get; set; }
        public string ClientId { get; set; }
        public string DisplayableId { get; set; }
        public DateTimeOffset ExpiresOn { get; set; }
        public string Resource { get; set; }
        public string TenantId { get; set; }
        public string UniqueId { get; set; }
        public UserInfo UserInfo { get; set; }
        public string IdToken { get; set; }

        internal static TokenCacheItem From(OriginalTokenCacheItem item)
        {
            TokenCacheItem result = new TokenCacheItem();
            result.Initialize(item);
            return result;
        }
    }
}
