using System;

namespace ADAL3WinMDProxy
{
    public sealed class PromptBehavior
    {
        public static int Auto { get { return 0; } }
        public static int Always { get { return 1; } }
        public static int Never { get { return 2; } }
        public static int RefreshSession { get { return 3; } }

        internal static Microsoft.IdentityModel.Clients.ActiveDirectory.PromptBehavior IntToEnum(int value)
        {
            return (Microsoft.IdentityModel.Clients.ActiveDirectory.PromptBehavior)
                Enum.Parse(typeof(Microsoft.IdentityModel.Clients.ActiveDirectory.PromptBehavior), value.ToString());
        }
    }
}
