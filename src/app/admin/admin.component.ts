import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {FormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf
  ],
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  private apiGroupsUrl = 'http://localhost:3000/api/groups';
  private apiUsersUrl = 'http://localhost:3000/api/users';
  groups: any[] = [];
  users: any[] = [];

  newGroup: any = { groupName: '', createdBy: 0, admins: [], members: [] };
  newUser: any = { username: '', email: '', password: '', roles: ['User'], groups: [] };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadGroups();
    this.loadUsers();
  }

  // Fetch groups and users individually (simplified)
  loadGroups(): void {
    this.http.get<any[]>(this.apiGroupsUrl).subscribe(
      data => this.groups = data,
      error => console.error('Error fetching groups', error)
    );
  }

  loadUsers(): void {
    this.http.get<any[]>(this.apiUsersUrl).subscribe(
      data => this.users = data,
      error => console.error('Error fetching users', error)
    );
  }

  // Get username by ID
  getUsernameById(userId: number): string {
    const user = this.users.find(u => u.id === userId);
    return user ? user.username : 'Unknown';
  }

  // CRUD Operations for Groups
  createGroup(): void {
    this.http.post(this.apiGroupsUrl, this.newGroup).subscribe(
      () => {
        this.loadGroups();  // Reload groups after creation
        this.newGroup = { groupName: '', createdBy: 0, admins: [], members: [] }; // Reset form
      },
      error => console.error('Error creating group', error)
    );
  }

  updateGroup(groupId: number, updatedGroup: any): void {
    this.http.put(`${this.apiGroupsUrl}/${groupId}`, updatedGroup).subscribe(
      () => this.loadGroups(),  // Reload groups after update
      error => console.error('Error updating group', error)
    );
  }

  deleteGroup(groupId: number): void {
    this.http.delete(`${this.apiGroupsUrl}/${groupId}`).subscribe(
      () => this.loadGroups(),  // Reload groups after deletion
      error => console.error('Error deleting group', error)
    );
  }

  // CRUD Operations for Users
  createUser(): void {
    this.http.post(this.apiUsersUrl, this.newUser).subscribe(
      () => {
        this.loadUsers();  // Reload users after creation
        this.newUser = { username: '', email: '', password: '', roles: ['User'], groups: [] }; // Reset form
      },
      error => console.error('Error creating user', error)
    );
  }

  updateUser(userId: number, updatedUser: any): void {
    this.http.put(`${this.apiUsersUrl}/${userId}`, updatedUser).subscribe(
      () => this.loadUsers(),  // Reload users after update
      error => console.error('Error updating user', error)
    );
  }

  deleteUser(userId: number): void {
    this.http.delete(`${this.apiUsersUrl}/${userId}`).subscribe(
      () => this.loadUsers(),  // Reload users after deletion
      error => console.error('Error deleting user', error)
    );
  }
}
