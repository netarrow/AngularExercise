importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.5.0/workbox-sw.js");

function checknewposts() {
    console.log('checknewposts called');
    fetch('api/SampleData/CheckNewPost').then((response) => {
        response.json().then(posts => {
            console.log('posts: ' + posts);
            if (posts && posts.length > 0) showNotification('New Post');
        });
    }).finally(() => setTimeout(checknewposts, 30000));
    
};

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

    self.addEventListener('message', event => {
        if (event.data.type === 'checknewposts') {
            console.log('checknewpost event');
            setTimeout(checknewposts, 1000);
        } else if (event.data.type === 'setBaseUrl') {
            self.registration.baseUrl = event.data.url;
        }
    });

    self.addEventListener('notificationclick', event => {
        console.log('notification clicked');

        console.log(self.registration.baseUrl);

        var url = self.registration.baseUrl;
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
            }));
    });

} else {
    console.log('Boo! Workbox not loaded');
}