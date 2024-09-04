import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from '../services/auth.guard';
import { SidebarComponent } from './sidebar/sidebar.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent }, // No sidebar for login
  {
    path: '',
    component: SidebarComponent, // Sidebar layout for all other routes
    canActivate: [AuthGuard],
    children: [
      { path: 'home', component: HomeComponent },
      // Add more routes here as needed
    ]
  },
];
