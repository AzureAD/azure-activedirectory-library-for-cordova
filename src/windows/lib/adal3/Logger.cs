using System;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using Windows.UI.Core;

namespace ADAL3WinMDProxy
{
    public delegate void EventCallback(LogItem message, LogOptions options);

    public sealed class LogItem
    {
        public string message { get; set; }
        public int level { get; set; }

        public LogItem(string message, int level)
        {
            this.message = message;
            this.level = level;
        }
    }

    public struct LogOptions
    {
        public bool keepCallback;
    };

    internal class CallbackHandler : IAdalLogCallback
    {
        EventCallback eventCB;

        public CallbackHandler(EventCallback eventCB)
        {
            this.eventCB = eventCB;
        }

        public async void Log(LogLevel level, string message)
        {
            var window = Windows.ApplicationModel.Core.CoreApplication.MainView.CoreWindow;
            var dispatcher = window.Dispatcher;

            await dispatcher.RunAsync(CoreDispatcherPriority.Normal, () =>
            {
                this.eventCB(new LogItem(message, (int)level), new LogOptions { keepCallback = true });
            });
        }
    }

    public sealed class Logger
    {
        public static bool setLogger(EventCallback successCB)
        {
            LoggerCallbackHandler.Callback = new CallbackHandler(successCB);
            return true;
        }
    }
}
