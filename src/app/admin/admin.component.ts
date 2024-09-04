import { Component, OnInit } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [HttpClientModule, CommonModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  private apiGroupsUrl = 'http://localhost:3000/api/groups';
  private apiUsersUrl = 'http://localhost:3000/api/users'; // API for fetching users
  groups: any[] = [];
  users: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Fetch both groups and users in parallel
    forkJoin([this.getGroups(), this.getUsers()]).subscribe(
      ([groupsData, usersData]) => {
        this.groups = groupsData;
        this.users = usersData;
      },
      (error) => {
        console.error('Error fetching data', error);
      }
    );
  }

  getGroups(): Observable<any[]> {
    return this.http.get<any[]>(this.apiGroupsUrl);
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUsersUrl);
  }

  getUsernameById(userId: number): string {
    const user = this.users.find(u => u.id === userId);
    return user ? user.username : 'Unknown';
  }
}
