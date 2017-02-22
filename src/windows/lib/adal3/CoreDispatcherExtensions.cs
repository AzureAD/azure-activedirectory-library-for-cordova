using System;
using System.Threading.Tasks;
using Windows.UI.Core;

namespace ADAL3WinMDProxy
{
    internal static class CoreDispatcherExtensions
    {
        public static async Task<T> RunAndAwaitAsync<T>(this CoreDispatcher dispatcher, CoreDispatcherPriority priority, Func<Task<T>> asyncFunction)
        {
            var taskCompletionSource = new TaskCompletionSource<T>();

            await dispatcher.RunAsync(priority, async () =>
            {
                try
                {
                    var result = await asyncFunction().ConfigureAwait(false);

                    taskCompletionSource.TrySetResult(result);
                }
                catch (Exception ex)
                {
                    taskCompletionSource.TrySetException(ex);
                }
            });

            return await taskCompletionSource.Task.ConfigureAwait(false);
        }
    }
}
