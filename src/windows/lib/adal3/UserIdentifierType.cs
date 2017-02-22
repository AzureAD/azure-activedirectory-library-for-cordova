using System;

namespace ADAL3WinMDProxy
{
    public sealed class UserIdentifierType
    {
        public static int UniqueId { get { return 0; } }
        public static int OptionalDisplayableId { get { return 1; } }
        public static int RequiredDisplayableId { get { return 2; } }

        internal static Microsoft.IdentityModel.Clients.ActiveDirectory.UserIdentifierType IntToEnum(int value)
        {
            return (Microsoft.IdentityModel.Clients.ActiveDirectory.UserIdentifierType)
                Enum.Parse(typeof(Microsoft.IdentityModel.Clients.ActiveDirectory.UserIdentifierType), value.ToString());
        }
    }
}
