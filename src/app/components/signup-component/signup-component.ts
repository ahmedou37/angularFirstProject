import { Component, inject, NgModule } from '@angular/core';
import { UserService } from '../../services/user-service/user-service';
import { User } from '../../model/User';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { FormsModule} from '@angular/forms';

@Component({
  selector: 'app-signup-component',
  imports: [CommonModule,FormsModule ],
  templateUrl: './signup-component.html',
  styleUrl: './signup-component.css'
})
export class SignupComponent {
  userService=inject(UserService);
  snackbar=inject(MatSnackBar)

  addedUser:User={
    name:'',
    password:''
  }

  createUser(){
    this.checkNote()
    this.checkUserName(this.addedUser.name)
    if(this.checkNote()===true&&this.checkUserName(this.addedUser.name)===true){
      this.userService.createUser(this.addedUser).subscribe(u=>this.signupSnackbar())
    }
  }

  users?:User[]
  nameNote=''
  passwordNote=''
  blank=''
  nameExistNote=''
  checkNote():boolean{
    this.nameNote=''
    this.passwordNote=''
    if(this.addedUser.name?.length==0&&this.addedUser.password?.length<4){
      this.nameNote='*username requiered' 
      this.passwordNote='*password should contains minimum 4 letters'
      return false
    }
    if(this.addedUser.name?.length==0){
      this.nameNote='*username requiered' 
      return false
    }
    if(this.addedUser.password?.length<4){
      this.passwordNote='*password should contains minimum 4 letters'
      return false
    }
     return true
  }
  checkUserName(name:string):boolean{
    this.nameExistNote=''
    this.userService.getUsers().subscribe(data=>this.users=data)
    const usernameExists = this.users?.some(user => user.name === name);
    if (usernameExists) {
      this.nameExistNote='*username already existe' 
      return false
    } 
  return true
  }
  constructor(){
    this.checkUserName(this.addedUser.name)
  }
  signupSnackbar(){
    this.snackbar.open(`signing up succes! return to the login page and login`,`close`,{
      duration:3000,
      panelClass:'snackbar'
    })
  }
}
