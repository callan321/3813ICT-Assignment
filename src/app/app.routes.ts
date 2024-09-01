import { Routes } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {SidebarComponent} from "./sidebar/sidebar.component";

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {path: 'sidebar', component: SidebarComponent},
];
