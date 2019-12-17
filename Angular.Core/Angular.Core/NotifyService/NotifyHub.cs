using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace Angular.Core.NotifyService
{
    public class NotifyHub : Hub
    {
        public Task Ping(string message)
        {
            return Clients.All.SendAsync("pong", message);
        }
    }
}
