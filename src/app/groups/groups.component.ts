import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {FormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";

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
  users: any[] = [];  // Add the users array to the GroupsComponent
  newGroup: any = { groupName: '', createdBy: 0, admins: [], members: [] };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadGroups();
    this.loadUsers();  // Load the users so we can use getUsernameById
  }

  loadGroups(): void {
    this.http.get<any[]>(this.apiGroupsUrl).subscribe(
      data => this.groups = data,
      error => console.error('Error fetching groups', error)
    );
  }

  loadUsers(): void {  // Load users method
    this.http.get<any[]>(this.apiUsersUrl).subscribe(
      data => this.users = data,
      error => console.error('Error fetching users', error)
    );
  }

  createGroup(): void {
    this.http.post(this.apiGroupsUrl, this.newGroup).subscribe(
      () => {
        this.loadGroups();
        this.newGroup = { groupName: '', createdBy: 0, admins: [], members: [] };
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

  getUsernameById(userId: number): string {
    const user = this.users.find(u => u.id === userId);
    return user ? user.username : 'Unknown';
  }
}
