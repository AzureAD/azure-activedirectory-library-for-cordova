using OriginalUserIdentifier = Microsoft.IdentityModel.Clients.ActiveDirectory.UserIdentifier;

namespace ADAL3WinMDProxy
{
    public sealed class UserIdentifier
    {
        private OriginalUserIdentifier _userIdentifier;

        public UserIdentifier() { }

        public UserIdentifier(string id, int type)
        {
            _userIdentifier = new OriginalUserIdentifier(id, UserIdentifierType.IntToEnum(type));
        }

        private void Initialize(OriginalUserIdentifier userIdentifier)
        {
            _userIdentifier = userIdentifier;
        }

        private static UserIdentifier _anyUser;
        public static UserIdentifier AnyUser
        {
            get
            {
                if (_anyUser == null)
                {
                    _anyUser = UserIdentifier.From(OriginalUserIdentifier.AnyUser);
                }

                return _anyUser;
            }
        }

        internal OriginalUserIdentifier GetOriginalUserIdentifier()
        {
            return _userIdentifier;
        }

        internal static UserIdentifier From(OriginalUserIdentifier userId)
        {
            var result = new UserIdentifier();
            result.Initialize(userId);
            return result;
        }
    }
}
