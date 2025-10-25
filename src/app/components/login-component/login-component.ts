import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';


import { jwtDecode } from 'jwt-decode';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

export interface JwtPayload {
  sub: string;   // the username (subject)
  authorities?: string[]; // optional role if you included it in the token
  roles?: string[]; // optional roles if you included them in the token
  role?: string; // optional role if you included it in the token
  exp?: number;
  iat?: number;
}



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule,MatButtonModule,MatInputModule],
  template: `
    <h2>Login</h2>
    <form >
      <mat-form-field>
        <mat-label>Username</mat-label>
        <input matInput [(ngModel)]="name" name="name" required />
      </mat-form-field>
      <mat-form-field>
        <mat-label>Password</mat-label>
        <input matInput [(ngModel)]="password" name="password" type="password" required />
      </mat-form-field>
      <button mat-raised-button color="primary" (click)="login()">Login</button>
    </form>
    <p>{{ response }}</p>
  `
})
export class LoginComponent {
  name = '';
  password = '';
  response = '';

  private http = inject(HttpClient);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  login() {
    localStorage.removeItem('token')
    this.http.post('http://localhost:8080/users/login', {
    name: this.name,
    password: this.password
  },{responseType:'text'}).subscribe({
    next: (token) => {
      localStorage.setItem('token', token);

      


      const decoded = jwtDecode<JwtPayload>(token);
      
         
      
      // Handle Spring Security role format
      let userRole: string | undefined;
      
      if (decoded.authorities && decoded.authorities.length > 0) {
        // Extract role from authorities array (remove "ROLE_" prefix)
        userRole = decoded.authorities[0].replace('ROLE_', '');
        console.log('Role from authorities:', userRole);
      } else if (decoded.role) {
        userRole = decoded.role;
        console.log('Role from role field:', userRole);
      } else if (decoded.roles && decoded.roles.length > 0) {
        userRole = decoded.roles[0];
        console.log('Role from roles array:', userRole);
      }
      
      console.log('Final User Role:', userRole);

      console.log("final role:", decoded.roles);

      
      const returnUrl = this.route.snapshot.queryParams['returnUrl'] ;//|| '/hello';
        this.router.navigate([returnUrl]);
      },
      error: () => this.response = 'Login failed'
    });
  }
}

// ActivatedRoute is Angular's way of giving you information about the current route/URL. It's like a "URL reader" that can tell you:
// What page you're on
// What parameters are in the URL
// What query string values exis
