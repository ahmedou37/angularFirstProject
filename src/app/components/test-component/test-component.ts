import { Component, OnInit, OnDestroy, inject, NgModule} from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
import { WebsocketService } from '../../services/socket-service/socket-service';
import { UserService } from '../../services/user-service/user-service';

@Component({
  selector: 'app-test-component',
  imports: [CommonModule,FormsModule ],
  templateUrl: './test-component.html',
  styleUrl: './test-component.css'
})
export class TestComponent implements OnInit, OnDestroy {
  messages: string[] = [];
  newMessage = '';
  sub!: Subscription;
  service=inject(UserService)

  constructor(private ws: WebsocketService ) {}

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
  image?:File
  loadedImage?:File
  imageName=''

  addImage() {
    if (!this.image) {
      alert('Please select an image first');
      return;
    }  
    this.service.addImage(this.image).subscribe({
      next: (data) => {
        console.log("Image added successfully:", data);
      },
      
    });
  }
}


