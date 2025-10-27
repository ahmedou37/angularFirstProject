import { Component, OnInit, OnDestroy, NgModule } from '@angular/core';
import { Subscription } from 'rxjs';
import { WebsocketService } from '../../services/test/test-service/test';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-test-component',
  imports: [CommonModule,FormsModule],
  templateUrl: './test-component.html',
  styleUrl: './test-component.css'
})
export class ChatComponent implements OnInit, OnDestroy {
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

