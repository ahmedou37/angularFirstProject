import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { MenuModule } from 'primeng/menu';
import { JwtUser } from '../login-component/login-component';
import { UserService } from '../../services/user-service/user-service';
import { User } from '../../model/User';

@Component({
  selector: 'app-menu-component',
  imports: [RouterLink,MenuModule,AvatarModule,BadgeModule,FormsModule],
  templateUrl: './menu-component.html',
  styleUrl: './menu-component.css',
})
export class MenuComponent {

  route=inject(ActivatedRoute)

  items: MenuItem[] = [
  {
    label: 'Management',
    icon: 'pi pi-check-square',
    items: [
      {
        label: 'Task',
        icon: 'pi pi-list',
        routerLink: ['/tasks']
      },
      {
        label: 'Users',
        icon: 'pi pi-users',
        routerLink: ['/users']
      }
    ]
  },
  {
    label: 'Account',
    icon: 'pi pi-user',
    items: [
      {
        label: 'Sign In',
        icon: 'pi pi-sign-in',
        routerLink: '/signup'
    },      
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        href:[this.route]
      }
    ]
  }
];
  logout(){

    console.log(console.log("imageUrl",this.user.imageName))
    console.log(console.log("this image", this.imageUrl))
  }

    user:User={name:'',password:'',email:''}
    token=localStorage.getItem('token')??'';
    jwtuser=jwtDecode<JwtUser>(this.token);
    imageUrl=''





   constructor(private userService:UserService){
      // this.getImage("Screenshot (1).png")

    userService.getUserByName(this.jwtuser.sub).subscribe(data=>{this.user=data,console.log('data',this.user),   console.log(userService.getImageUrl("this"+this.user.imageName)),console.log("imageUrl",this.imageUrl),console.log("image",this.user.imageName)})
   }

   getImageUrl(){
    return this.userService.getImageUrl(this.user.imageName);
   }

   imageTest: string | null = null; // Store the URL, not the blob

// getImage(imageName: string) {
//   this.userService.getImage(imageName).subscribe({
//     next: (blob: Blob) => {
//       // Create a URL from the blob
//       const imageUrl = URL.createObjectURL(blob);
//       this.imageTest = imageUrl;
//     },
//     error: (error) => {
//       console.error('Error loading image:', error);
//     }
//   });
// }
 

}

