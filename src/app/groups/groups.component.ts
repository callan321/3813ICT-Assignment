import { HttpClient } from "@angular/common/http";
import { AuthService } from "../../services/auth.service";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule, NgForOf } from "@angular/common";

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

  // Initialize newGroup object for creating groups
  newGroup: any = {
    groupName: '',
    createdBy: 0,
    admins: [],
    members: []
  };

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadGroups();
    this.loadUsers();
    this.newGroup.createdBy = this.authService.getUserId();
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

    this.http.post(this.apiGroupsUrl, this.newGroup).subscribe(
      () => {
        this.loadGroups();
        this.newGroup = { groupName: '', createdBy: this.authService.getUserId(), admins: [], members: [] }; // Reset form after creating
      },
      error => console.error('Error creating group', error)
    );
  }

  deleteGroup(groupId: number): void {
    this.http.delete(`${this.apiGroupsUrl}/${groupId}`).subscribe(
      () => this.loadGroups(),
      error => console.error('Error deleting group', error)
    );
  }

  addChannelToGroup(groupId: number, newChannelName: string): void {
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

  removeChannelFromGroup(groupId: number, channelId: number): void {
    this.http.put(`${this.apiGroupsUrl}/${groupId}/remove-channel/${channelId}`, {}).subscribe(
      () => this.loadGroups(),
      error => console.error('Error removing channel from group', error)
    );
  }

  removeUserFromGroup(groupId: number, userId: number, role: string): void {
    const endpoint = role === 'admin' ? 'remove-admin' : 'remove-member';
    this.http.put(`${this.apiGroupsUrl}/${groupId}/${endpoint}/${userId}`, {}).subscribe(
      () => this.loadGroups(),
      error => console.error(`Error removing ${role} from group`, error)
    );
  }

  // Upgrade a member to admin
  upgradeToAdmin(groupId: number, userId: number): void {
    this.http.put(`${this.apiGroupsUrl}/${groupId}/upgrade-to-admin/${userId}`, {}).subscribe(
      () => this.loadGroups(),
      error => console.error('Error upgrading member to admin', error)
    );
  }

  // Fetch username based on user ID
  getUsernameById(userId: number): string {
    const user = this.users.find(u => u.id === userId);
    return user ? user.username : 'Unknown';
  }
}
