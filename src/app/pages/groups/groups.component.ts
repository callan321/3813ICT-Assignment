import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule, NgForOf } from "@angular/common";
import {AuthService} from "../../../services/auth.service";

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    CommonModule
  ],
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {
  private apiGroupsUrl = 'http://localhost:3000/api/groups';
  private apiUsersUrl = 'http://localhost:3000/api/users';

  groups: any[] = [];
  users: any[] = [];


  newGroup: any = {
    groupName: '',
    createdBy: '',
    admins: [],
    members: [],
    channels: []
  };

  constructor(
    private http: HttpClient,
    protected authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadGroups();
    this.loadUsers();
    this.newGroup.createdBy = this.authService.getUserId();
  }

  isSuperAdmin(): boolean {
    return this.authService.isSuperAdmin();
  }

  loadGroups(): void {
    this.http.get<any[]>(this.apiGroupsUrl).subscribe(
      data => {
        this.groups = data;
        this.groups.forEach(group => group.newChannelName = '');
      },
      error => console.error('Error fetching groups', error)
    );
  }

  loadUsers(): void {
    this.http.get<any[]>(this.apiUsersUrl).subscribe(
      data => this.users = data,
      error => console.error('Error fetching users', error)
    );
  }

  createGroup(): void {
    if (!this.newGroup.groupName) {
      console.error('Group name is required!');
      return;
    }

    this.newGroup.admins = [this.newGroup.createdBy];
    this.newGroup.members = [this.newGroup.createdBy];
    this.newGroup.channels = [];

    this.http.post(this.apiGroupsUrl, this.newGroup).subscribe(
      () => {
        this.loadGroups();
        // Reset form after creating
        this.newGroup = {
          groupName: '',
          createdBy: this.authService.getUserId(),
          admins: [],
          members: [],
          channels: []
        };
      },
      error => console.error('Error creating group', error)
    );
  }

  deleteGroup(groupId: string): void {
    this.http.delete(`${this.apiGroupsUrl}/${groupId}`).subscribe(
      () => this.loadGroups(),
      error => console.error('Error deleting group', error)
    );
  }

  addChannelToGroup(groupId: string, newChannelName: string): void {
    if (!newChannelName) {
      console.error('Channel name is required!');
      return;
    }

    const channelData = {
      channelName: newChannelName,
      createdBy: this.authService.getUserId()
    };

    this.http.post(`${this.apiGroupsUrl}/${groupId}/add-channel`, channelData).subscribe(
      () => this.loadGroups(),
      error => console.error('Error adding channel', error)
    );
  }

  removeChannelFromGroup(groupId: string, channelId: string): void {
    this.http.put(`${this.apiGroupsUrl}/${groupId}/remove-channel/${channelId}`, {}).subscribe(
      () => this.loadGroups(),
      error => console.error('Error removing channel from group', error)
    );
  }

  removeUserFromGroup(groupId: string, userId: string, role: string): void {
    const endpoint = role === 'admin' ? 'remove-admin' : 'remove-member';
    this.http.put(`${this.apiGroupsUrl}/${groupId}/${endpoint}/${userId}`, {}).subscribe(
      () => this.loadGroups(),
      error => console.error(`Error removing ${role} from group`, error)
    );
  }

  // Upgrade a member to admin
  upgradeToAdmin(groupId: string, userId: string): void {
    this.http.put(`${this.apiGroupsUrl}/${groupId}/upgrade-to-admin/${userId}`, {}).subscribe(
      () => this.loadGroups(),
      error => console.error('Error upgrading member to admin', error)
    );
  }

  // Fetch username based on user ID
  getUsernameById(userId: string): string {
    const user = this.users.find(u => u._id === userId);
    return user ? user.username : 'Unknown';
  }
}
