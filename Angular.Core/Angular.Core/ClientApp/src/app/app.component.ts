import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  ngOnInit(): void {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').then(registration => {

          console.log(`Service Worker registered! Scope: ${registration.scope}`);

          if (typeof Notification !== 'undefined') {
            Notification.requestPermission();
          }

          navigator.serviceWorker.controller.postMessage({ type: 'checknewposts' });

        })
          .catch(err => {
            console.log(`Service Worker registration failed: ${err}`);
          });
      });
    }
  }
}
