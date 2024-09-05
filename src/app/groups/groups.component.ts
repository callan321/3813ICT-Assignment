import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgForOf } from '@angular/common';
import { AuthService } from '../../services/auth.service';  // Adjust path if necessary

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf
  ],
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {
  private apiGroupsUrl = 'http://localhost:3000/api/groups';
  private apiUsersUrl = 'http://localhost:3000/api/users';  // Add the users API endpoint
  groups: any[] = [];
  users: any[] = [];
  newGroup: any = { groupName: '', createdBy: 0, admins: [], members: [] };

  constructor(
    private http: HttpClient,
    private authService: AuthService  // Inject AuthService to get the logged-in user
  ) {}

  ngOnInit(): void {
    this.loadGroups();
    this.loadUsers();
    this.setCurrentUserAsCreator();  // Set the current logged-in user as group creator
  }

  // Fetch existing groups from the server
  loadGroups(): void {
    this.http.get<any[]>(this.apiGroupsUrl).subscribe(
      data => this.groups = data,
      error => console.error('Error fetching groups', error)
    );
  }

  // Fetch users (for displaying usernames)
  loadUsers(): void {
    this.http.get<any[]>(this.apiUsersUrl).subscribe(
      data => this.users = data,
      error => console.error('Error fetching users', error)
    );
  }

  // Create a new group
  createGroup(): void {
    if (!this.newGroup.groupName) {
      console.error('Group name is required!');
      return;
    }

    // Add the creator as admin and member
    this.newGroup.admins = [this.newGroup.createdBy];
    this.newGroup.members = [this.newGroup.createdBy];

    this.http.post(this.apiGroupsUrl, this.newGroup).subscribe(
      () => {
        this.loadGroups(); // Reload the groups after creating a new one
        this.newGroup = { groupName: '', createdBy: this.authService.getUserId(), admins: [], members: [] }; // Reset form
      },
      error => console.error('Error creating group', error)
    );
  }

  // Delete a group
  deleteGroup(groupId: number): void {
    this.http.delete(`${this.apiGroupsUrl}/${groupId}`).subscribe(
      () => this.loadGroups(),
      error => console.error('Error deleting group', error)
    );
  }

  // Fetch username based on ID
  getUsernameById(userId: number): string {
    const user = this.users.find(u => u.id === userId);
    return user ? user.username : 'Unknown';
  }

  // Get logged-in user's ID and set them as creator
  setCurrentUserAsCreator(): void {
    const userId = this.authService.getUserId();
    if (userId) {
      this.newGroup.createdBy = userId;
    } else {
      console.error('No user logged in!');
    }
  }
}
