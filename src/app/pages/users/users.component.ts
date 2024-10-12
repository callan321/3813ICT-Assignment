import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from "@angular/forms";
import { NgForOf } from "@angular/common";
import { Modal } from 'bootstrap';

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
  confirmedUserId: number | null = null;

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


  confirmDelete(userId: number): void {
    this.confirmedUserId = userId;
    const modalElement = document.getElementById('deleteConfirmationModal') as HTMLElement;
    const modal = new Modal(modalElement);  // Use Bootstrap's JS modal API to show the modal
    modal.show();
  }


  deleteUser(userId: number | null): void {
    if (userId !== null) {
      this.http.delete(`${this.apiUsersUrl}/${userId}`).subscribe(
        () => this.loadUsers(),
        error => console.error('Error deleting user', error)
      );
    }
  }


  changeUserRole(userId: number, newRole: string): void {
    const updatedUser = { roles: [newRole] };

    this.http.put(`${this.apiUsersUrl}/${userId}`, updatedUser).subscribe(
      () => {
        console.log(`User ${userId} role updated to: ${newRole}`);
        this.loadUsers();
      },
      error => console.error('Error updating user role', error)
    );
  }
}
