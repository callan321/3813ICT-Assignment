import { Routes } from '@angular/router';
import { AuthGuard } from './services/guards/auth.guard';
import {SuperAdminGuard} from "./services/guards/super.admin.guard";
import {LoginComponent} from "./pages/login/login.component";
import {CreateUserComponent} from "./pages/create-user/create-user.component";
import {SidebarComponent} from "./layouts/sidebar/sidebar.component";
import {HomeComponent} from "./pages/home/home.component";
import {UsersComponent} from "./pages/users/users.component";
import {GroupsComponent} from "./pages/groups/groups.component";
import {ChannelComponent} from "./pages/channel/channel.component";
import {LoginGuard} from "./services/guards/login.guard";
import {ProfileComponent} from "./pages/profile/profile.component";


export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate : [LoginGuard] },
  {path: 'register', component: CreateUserComponent, canActivate : [LoginGuard] },
  {
    path: '',
    component: SidebarComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'home', component: HomeComponent },
      // { path: 'users', component: UsersComponent, canActivate: [SuperAdminGuard] },
      { path: 'profile', component: ProfileComponent },
      { path: 'groups', component: GroupsComponent },
      { path: 'channel/:channelId', component: ChannelComponent }
    ]
  },
];
