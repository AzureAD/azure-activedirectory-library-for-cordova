using System.Linq;
using OriginalTokenCache = Microsoft.IdentityModel.Clients.ActiveDirectory.TokenCache;

namespace ADAL3WinMDProxy
{
    public sealed class TokenCache
    {
        private OriginalTokenCache _cache;

        internal TokenCache() { }

        internal void Initialize(OriginalTokenCache tokenCache)
        {
            _cache = tokenCache;
        }

        public TokenCacheItem[] ReadItems()
        {
            return _cache.ReadItems().Select(item => TokenCacheItem.From(item)).ToArray();
        }

        public void Clear()
        {
            _cache.Clear();
        }

        public void DeleteItem(TokenCacheItem item)
        {
            var itemToDelete = _cache.ReadItems().FirstOrDefault(i => i.ClientId == item.ClientId
                && i.Resource == item.Resource
                && i.UniqueId == item.UniqueId
                && i.Authority == item.Authority);

            if (itemToDelete != null) {
                _cache.DeleteItem(itemToDelete);
            }
        }

        internal static TokenCache From(OriginalTokenCache cache)
        {
            var result = new TokenCache();
            result.Initialize(cache);
            return result;
        }
    }
}
