import { Component, OnInit, OnDestroy} from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WebsocketService } from '../../services/socket-service/socket-service';

@Component({
  selector: 'app-test-component',
  imports: [CommonModule,FormsModule],
  templateUrl: './message-component.html',
  styleUrl: './message-component.css'
})
export class MessageComponent implements OnInit, OnDestroy {
  messages: string[] = [];
  newMessage = '';
  sub!: Subscription;

  constructor(private ws: WebsocketService) {}

  ngOnInit() {
    this.ws.connect();
    this.sub = this.ws.messages$.subscribe((msg) => {
      this.messages.push(msg);
    });
    console.log("msg:"+this.messages)
  }

  send() {
    this.ws.sendMessage(this.newMessage);
    console.log("msg:"+this.messages)
    this.newMessage = '';
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.ws.disconnect();
  }
}

