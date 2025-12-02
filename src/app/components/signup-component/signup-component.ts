import { Component, inject, NgModule } from '@angular/core';
import { UserService } from '../../services/user-service/user-service';
import { User } from '../../model/User';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { FormsModule} from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { FileUploadModule } from 'primeng/fileupload';



@Component({
  selector: 'app-signup-component',
  imports: [CommonModule, FormsModule ,ButtonModule,
    InputTextModule,TableModule ,ToggleSwitchModule ,
    FloatLabelModule,FileUploadModule,ButtonModule],
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
    this.addImage()
    this.checkUsername()
    this.checkEmail()
    this.checkPassword()
    if(this.checkUsername()===true&&this.checkEmail()===true&&this.checkPassword()===true&&this.addImage()==true){
    //   this.userService.createUser(this.addedUser).subscribe(u=>{
    //     this.signupSnackbar()
    //     this.addedUser.name=''
    //     this.addedUser.password=''
    //     this.addedUser.email=''
    //     this.imageUrl=null})
    console.log("completeeeeeeeeeeeeeeeeeee")
     }
  }

  users?:User[]
  nameNote=''
  passwordNote=''
  emailNote=''
  blank=''

  constructor(){
    this.userService.getUsers().subscribe(data=>this.users=data)
  }
  
 
  checkUsername():boolean{
    console.log("method called 3")
    console.log("users",this.users)
    this.nameNote=''
    if(this.addedUser.name?.length==0){
      this.nameNote='*username requiered'
      return false 
    }
    else if (this.users?.some(user => user.name === this.addedUser.name)) {
      this.nameNote='*username already existe' 
      return false
    } 
  return true
  }

  checkPassword():boolean{
    this.passwordNote=''
    if(this.addedUser.password?.length==0){
      this.passwordNote='*Password requiered'
      return false
    }
    else if(this.addedUser.password?.length<4){
      this.passwordNote='*password should contains minimum 4 letters'
      return false
    }
    return true
  }


  checkEmail():boolean{
    console.log("method called 1")
    this.emailNote=''
    if(this.addedUser.email.length==0){
      this.emailNote="*email requiered"
      console.log(this.emailNote)
      return false
    }
    if(!(this.addedUser.email.includes('@')&&this.addedUser.email.includes('.'))){
      this.emailNote='*email invalid'
      return false
    }
    return true
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
    console.log("okk")
    this.image = file;
    this.addedUser.imageName=file.name
    console.log('Image selected:', this.addedUser.imageName);


    //create url for the image
    if (this.imageUrl) {
      URL.revokeObjectURL(this.imageUrl); //clean up previous url
    }
    this.imageUrl = URL.createObjectURL(file);
    console.log("imageUrl:"+this.imageUrl)
    } else {
    this.imageUrl = ''; 
  }
  }

}
