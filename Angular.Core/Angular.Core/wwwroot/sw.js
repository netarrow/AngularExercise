importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.5.0/workbox-sw.js");

if (workbox) {
  console.log('Yay! Workbox is loaded 🎉');

  var showNotification = (msg) => {
      if (self.registration.showNotification) {
          console.log('showing');

          self.registration.showNotification('Background sync success!', {
              body: msg
      });
           
          console.log('shown');
          
    }
    };

    self.addEventListener('activate', event => {
        console.log('activate');
    });

    self.addEventListener('message', event => {
        if (event.data.type === 'notify') {
            showNotification(event.data.msg);
        }
    });

    self.addEventListener('notificationclick', function (event) {
        console.log('notification clicked');
        var url = "https://localhost:44384/";
        event.notification.close(); // Android needs explicit close.
        event.waitUntil(
            clients.matchAll({ type: 'window' }).then(windowClients => {
                // Check if there is already a window/tab open with the target URL
                for (var i = 0; i < windowClients.length; i++) {
                    var client = windowClients[i];
                    // If so, just focus it.
                    if (client.url === url && 'focus' in client) {
                        return client.focus();
                    }
                }
                // If not, then open the target URL in a new window/tab.
                if (clients.openWindow) {
                    return clients.openWindow(url);
                }
            })
        );
    });

} else {
  console.log('Boo! Workbox not loaded');
}