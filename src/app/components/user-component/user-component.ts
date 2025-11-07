import { Component, inject } from '@angular/core';
import { UserService } from '../../services/user-service/user-service';
import { User } from '../../model/User';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-user-component',
  imports: [MatCardModule, MatIconModule,RouterLink,MatButtonModule,
    CommonModule,MatMenuModule,MatInputModule,FormsModule,MatSelectModule,MatOptionModule],
  templateUrl: './user-component.html',
  styleUrl: './user-component.css'
})
export class UserComponent {
  userService=inject(UserService)

  users:User[]=[]
  searchedUser:User={
    name:'',
    password:'',
    email:''
  }
  searchedId:number|null=null

  displayUsers:boolean=false
  displayUser:boolean=false

  buttonDisplay:boolean=false

  numbers = new Array(100).fill(0).map((_, i) => i + 1);

  constructor(){
    this.getUsers()
  }

  getUsers(){
    this.userService.getUsers().subscribe(data=>{
      this.users=data,
      this.displayUsers=true,
      this.displayUser=false,
      this.searchedId=null
    })
  }

  getUser(){
    this.userService.getUser(this.searchedId).subscribe(data=>{
      this.searchedUser=data,
      this.displayUser=true,
      this.displayUsers=false
    })
  }

  updateUser(user:User){
    if(this.image){
      this.userService.addImage(this.image).subscribe({
      next: (data) => {
        user.imageName=data,
        console.log("Image added successfully:",user.imageName);
    },
    });
    }
    this.userService.updateUser(user).subscribe(data=>{
      this.getUsers(),
      this.image=null
    })
  }

  deleteUser(deletedId:number){
    this.userService.deleteUser(deletedId).subscribe(data=>this.getUsers())
  }


  getImageUrl(imageName:string){
    return this.userService.getImageUrl(imageName)
  }


  idChange(selectedValue: number) {
   if (selectedValue == 0) {
      this.getUsers();
    } else {
     this.getUser();
    }
  }  
  

  image?:File|null
  onImageSelected(event: any,user:User) {
  const file: File = event.target.files[0];
  if (file) {
    this.image = file;
    user.imageName=file.name
  }
  }
}
