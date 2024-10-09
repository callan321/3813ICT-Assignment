import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from '../services/auth.guard';
import { SidebarComponent } from './sidebar/sidebar.component';
import { GroupsComponent} from "./groups/groups.component";
import {UsersComponent} from "./users/users.component";
import {CreateUserComponent} from "./create-user/create-user.component";
import {SuperAdminGuard} from "../services/group.admin.guard";
import {ChannelComponent} from "./channel/channel.component";


export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {path: 'register', component: CreateUserComponent },
  {
    path: '',
    component: SidebarComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'users', component: UsersComponent, canActivate: [SuperAdminGuard] },
      { path: 'groups', component: GroupsComponent },
      { path: 'group/:groupId/channel/:channelId', component: ChannelComponent }
    ]
  },
];
