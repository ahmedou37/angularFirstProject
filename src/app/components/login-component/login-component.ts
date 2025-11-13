import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface JwtUser {
  sub: string;   
  roles?: string[];
}


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule,MatButtonModule,
    MatInputModule,MatIconModule],
  templateUrl: `login-component.html`,
  styleUrl:`login-component.css`
})
export class LoginComponent {
  name = '';
  password = '';
  response = '';
  blank='';

  private http = inject(HttpClient);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  login() {
    this.checkNote()
    localStorage.removeItem('token')
    this.http.post('http://localhost:8080/users/login', {
    name: this.name,
    password: this.password
  },{responseType:'text'}).subscribe({
    next: (token) => {

      localStorage.setItem('token', token);
      
      const returnUrl = this.route.snapshot.queryParams['returnUrl'] ;//|| '/hello';
        this.router.navigate([returnUrl]);
      },
      error: () =>{
       this.response = 'Login failed',
       this.errorSnackbar(this.response)
      }
    });
  }
  constructor(private snackbar:MatSnackBar){}
  
  errorSnackbar(error:string){
    this.snackbar.open(error,`close`,{
      duration:1000,
    })
  }

  nameNote=''
  passwordNote=''
  checkNote(){
    this.nameNote=''
    this.passwordNote=''
    if(this.name.length==0){
      this.nameNote='*username requiered'
    }
    if(this.password.length<4){
      this.passwordNote='*password should contains minimum 4 letters'
    }
  }

  onSubmit(event: Event) {
  event.preventDefault();
  const form = event.target as HTMLFormElement;
  const passwordInput = document.getElementById('password') as HTMLInputElement;

  if (passwordInput.value.length < 6) {
    passwordInput.setCustomValidity('Password must be at least 4 characters');
  } else {
    passwordInput.setCustomValidity('');
  }

  if (!form.checkValidity()) {
    event.preventDefault();
  }
  
  form.classList.add('was-validated');
}
passsword:string=''

showButton: boolean = false;

}

// ActivatedRoute is Angular's way of giving you information about the current route/URL. It's like a "URL reader" that can tell you:
// What page you're on
// What parameters are in the URL
// What query string values exis
