import { Component, inject, NgModule } from '@angular/core';
import { UserService } from '../../services/user-service/user-service';
import { User } from '../../model/User';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { FormsModule} from '@angular/forms';

@Component({
  selector: 'app-signup-component',
  imports: [CommonModule, FormsModule],
  templateUrl: './signup-component.html',
  styleUrl: './signup-component.css'
})
export class SignupComponent {
  userService=inject(UserService);
  snackbar=inject(MatSnackBar)

  addedUser:User={
    name:'',
    password:'',
    email:''
  }

  createUser(){
    this.checkNote()
    this.checkUserName(this.addedUser.name)
    this.checkEmail()
    console.log("emailLenght:"+this.addedUser.email.length)
    this.addImage()
    console.log(this.emailNote)
    if(this.checkNote()===true&&this.checkUserName(this.addedUser.name)===true&&this.checkEmail()===true&&this.addImage()==true){
      this.userService.createUser(this.addedUser).subscribe(u=>{
        this.signupSnackbar()
        this.addedUser.name=''
        this.addedUser.password=''
        this.addedUser.email=''
        this.imageUrl=null})
    }
  }

  users?:User[]
  nameNote=''
  passwordNote=''
  emailNote=''
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
  checkEmail():boolean{
    this.emailNote=''
    if(this.addedUser.email.length==0){
      this.emailNote="*email requiered"
      console.log(this.emailNote)
      return false
    }
    if(!(this.addedUser.email.includes('@')&&this.addedUser.email.includes('.'))){
      this.emailNote='*email is invalid'
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


  image?:File|null
  imageUrl: string | null = null; 
  imageNote:string=''


  addImage():boolean {
    this.imageNote=''
    if (!this.image) {
      this.imageNote='*image requiered'
      return false;
    }
    this.userService.addImage(this.image).subscribe({
      next: (data) => {
        this.addedUser.imageName=data,
        console.log("Image added successfully:",this.addedUser.imageName);
        return true
      },
      
    });
    return true;
  }


  onImageSelected(event: any) {
  const file: File = event.target.files[0];
  if (file) {
    this.image = file;
    this.addedUser.imageName=file.name
    console.log('Image selected:', this.addedUser.imageName);


    //create url for the image
    if (this.imageUrl) {
      URL.revokeObjectURL(this.imageUrl); //clean up previous url
    }
    this.imageUrl = URL.createObjectURL(file);
    } else {
    this.imageUrl = null; 
  }
  }

}
