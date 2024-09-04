import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {FormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf
  ],
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  private apiUsersUrl = 'http://localhost:3000/api/users';
  users: any[] = [];
  newUser: any = { username: '', email: '', password: '', roles: ['User'], groups: [] };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.http.get<any[]>(this.apiUsersUrl).subscribe(
      data => this.users = data,
      error => console.error('Error fetching users', error)
    );
  }

  createUser(): void {
    this.http.post(this.apiUsersUrl, this.newUser).subscribe(
      () => {
        this.loadUsers();
        this.newUser = { username: '', email: '', password: '', roles: ['User'], groups: [] };
      },
      error => console.error('Error creating user', error)
    );
  }

  deleteUser(userId: number): void {
    this.http.delete(`${this.apiUsersUrl}/${userId}`).subscribe(
      () => this.loadUsers(),
      error => console.error('Error deleting user', error)
    );
  }
}
