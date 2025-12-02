import { Injectable } from '@angular/core';
import { Client, Message } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private stompClient!: Client;
  private notificationSubject = new Subject<any>();//Subject is both an Observable and an Observer."Observer" part means it can RECEIVE data, not just emit
  public notifications$ = this.notificationSubject.asObservable();//Turns the subject into a read-only Observable.

  private messageSubject = new Subject<string>();
  public messages$ = this.messageSubject.asObservable();

  connect() {
    //“Use SockJS to make the connection,and use STOMP to talk over it.”
    this.stompClient = new Client({
      // Use SockJS as the underlying WebSocket
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),

      reconnectDelay: 5000, // auto-reconnect after 5s if connection drops

      onConnect: () => {
        console.log('✅ Connected to WebSocket');
        //Subscribe to backend topic
        this.stompClient.subscribe('/topic/notification', (message: Message) => {
          const body = message.body ? JSON.parse(message.body) : null;
          this.notificationSubject.next(body);//pushes a new value to all subscribers
        });


        this.stompClient.subscribe('/topic/messages', (message: Message) => {
          const body = message.body ? JSON.parse(message.body) : null;
          this.messageSubject.next(body);
        });
      }
    });
    // Activate connection
    this.stompClient.activate();
  }

  sendMessage(msg: string) {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.publish({
        destination: '/app/sendMessage',
        body: JSON.stringify(msg),
      });
    }
  }


  disconnect() {
    if (this.stompClient && this.stompClient.active) {
      this.stompClient.deactivate();
      console.log('🔌 Disconnected from WebSocket');
    }
  }
}
