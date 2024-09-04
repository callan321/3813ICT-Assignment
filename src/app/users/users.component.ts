import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from "@angular/forms";
import { NgForOf } from "@angular/common";
import { Modal } from 'bootstrap';  // Import Bootstrap Modal

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
  confirmedUserId: number | null = null;  // Store the user ID for deletion confirmation

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  // Fetch all users from the backend
  loadUsers(): void {
    this.http.get<any[]>(this.apiUsersUrl).subscribe(
      data => this.users = data,
      error => console.error('Error fetching users', error)
    );
  }

  // Create a new user
  createUser(): void {
    this.http.post(this.apiUsersUrl, this.newUser).subscribe(
      () => {
        this.loadUsers();
        this.newUser = { username: '', email: '', password: '', roles: ['User'], groups: [] };
      },
      error => console.error('Error creating user', error)
    );
  }

  // Set the user ID and open confirmation modal
  confirmDelete(userId: number): void {
    this.confirmedUserId = userId;
    const modalElement = document.getElementById('deleteConfirmationModal') as HTMLElement;
    const modal = new Modal(modalElement);  // Use Bootstrap's JS modal API to show the modal
    modal.show();
  }

  // Delete a user after confirmation
  deleteUser(userId: number | null): void {
    if (userId !== null) {
      this.http.delete(`${this.apiUsersUrl}/${userId}`).subscribe(
        () => this.loadUsers(),
        error => console.error('Error deleting user', error)
      );
    }
  }

  // Update the user role
  changeUserRole(userId: number, newRole: string[]): void {
    const updatedUser = { roles: newRole };

    this.http.put(`${this.apiUsersUrl}/${userId}`, updatedUser).subscribe(
      () => {
        console.log(`User ${userId} roles updated to: ${newRole}`);
        this.loadUsers();
      },
      error => console.error('Error updating user role', error)
    );
  }
}
