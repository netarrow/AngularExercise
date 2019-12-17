using System.Threading.Tasks;
using Angular.Core.NotifyService;
using Microsoft.AspNetCore.SignalR;

namespace Angular.Core
{
    public class GlobalHostSignalr
    {
        private readonly IHubContext<NotifyHub> _hubContext;

        public GlobalHostSignalr(IHubContext<NotifyHub> hubContext)
        {
            _hubContext = hubContext;   
        }

        public Task SendToAll(string msg)
        {
            return _hubContext.Clients.All.SendAsync("pong", msg);
        }
    }
}