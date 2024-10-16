import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from "@angular/router";
import { NgIf } from "@angular/common";
import { UserService } from '../services/user.service'; // Import UserService
import { User } from '../models/models'; // Import User model

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [
    FormsModule,
    NgIf
  ],
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent {
  user: User = {
    username: '',
    email: '',
    password: '',
    roles: ['user'],
    groups: []
  };

  creationError: boolean = false;

  constructor(private userService: UserService, private router: Router) {}

  onSubmit() {
    this.userService.createUser(this.user).subscribe({
      next: (response) => {
        console.log('User created successfully:', response);
        this.router.navigate(['/login'], { queryParams: { success: 'User created successfully. Please log in.' } });
      },
      error: (error) => {
        console.error('There was an error creating the user!', error);
        this.creationError = true;
      }
    });
  }
}
