import { Routes } from '@angular/router';
import {SidebarComponent} from "./sidebar/sidebar.component";
import {LoginComponent} from "./login/login.component";
import {AuthGuard} from "../services/auth.guard";

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'sidebar', component: SidebarComponent, canActivate: [AuthGuard] },

];
