import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from '../services/auth.guard';
import { SidebarComponent } from './sidebar/sidebar.component';
import { GroupsComponent} from "./groups/groups.component";
import {UsersComponent} from "./users/users.component";


export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent }, // No sidebar for login
  {
    path: '',
    component: SidebarComponent, // Protected routes with sidebar
    canActivate: [AuthGuard],
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'users', component: UsersComponent },  //
      { path: 'groups', component: GroupsComponent },
    ]
  },
];
