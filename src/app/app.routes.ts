import { Routes } from '@angular/router';
import {SidebarComponent} from "./sidebar/sidebar.component";
import {LoginComponent} from "./login/login.component";
import {AuthGuard} from "../services/auth.guard";
import {HomeComponent} from "./home/home.component";

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'sidebar', component: SidebarComponent, canActivate: [AuthGuard] },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
];
