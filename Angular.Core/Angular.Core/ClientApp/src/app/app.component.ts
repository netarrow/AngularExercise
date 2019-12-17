import { Component, OnInit } from '@angular/core';
import { environment } from "../environments/environment";
import * as signalR from "@aspnet/signalr";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  ngOnInit(): void {
    this.registerAndInitSw();

    let connection = new signalR.HubConnectionBuilder()
      .withUrl("/notifyhub")
      .build();

    connection.on("pong", data => {
      console.log(data);
    });

    connection.start()
      .then(() => connection.invoke("ping", "Hello"));

  }

    private registerAndInitSw() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('sw.js').then(registration => {
                    console.log(`Service Worker registered! Scope: ${registration.scope}`);
                    if (typeof Notification !== 'undefined') {
                        Notification.requestPermission();
                    }
                    registration.active.postMessage({ type: 'setBaseUrl', url: environment.baseUrl });
                    registration.active.postMessage({ type: 'checknewposts' });
                })
                    .catch(err => {
                        console.log(`Service Worker registration failed: ${err}`);
                    });
            });
        }
    }
}
