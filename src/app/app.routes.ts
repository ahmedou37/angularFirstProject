import { Routes } from '@angular/router';

import { authGuard } from './services/guard/auth-guard';
import { LoginComponent } from './components/login-component/login-component';
import { DashboardComponent } from './components/dashboard-component/dashboard-component';
import { TaskComponent } from './components/task-component/task-component';
import { AdminComponent } from './components/admin-component/admin-component';
import { SignupComponent } from './components/signup-component/signup-component';
import { UserComponent } from './components/user-component/user-component';
import { MenuComponent } from './components/menu-component/menu-component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {path:'signup' ,component:SignupComponent},
  {path:'dashboard',component:DashboardComponent,canActivate:[authGuard]},
  {path:'tasks',component:TaskComponent,canActivate:[authGuard]},
  {path:'admin',component:AdminComponent,canActivate:[authGuard]},
  { path: '', redirectTo: 'tasks', pathMatch: 'full' },
  {path:'menu',component:MenuComponent , canActivate:[authGuard]},
  {path:'users' ,component:UserComponent,canActivate:[authGuard]},
];
