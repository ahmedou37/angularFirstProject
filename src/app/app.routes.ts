import { Routes } from '@angular/router';

import { authGuard } from './services/guard/auth-guard';
import { LoginComponent } from './components/login-component/login-component';
import { DashboardComponent } from './components/dashboard-component/dashboard-component';
import { TaskComponent } from './components/task-component/task-component';
import { AdminComponent } from './components/admin-component/admin-component';
import { SignupComponent } from './components/signup-component/signup-component';
import { TestComponent } from './components/test-component/test-component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {path:'signup' ,component:SignupComponent},
  {path:'dashboard',component:DashboardComponent,canActivate:[authGuard]},
  {path:'tasks',component:TaskComponent,canActivate:[authGuard]},
  {path:'admin',component:AdminComponent,canActivate:[authGuard]},
  { path: '', redirectTo: 'login/tasks', pathMatch: 'full' },
  {path:'test',component:TestComponent, canActivate:[authGuard]},
  // { path: '**', redirectTo: 'login' },
];
