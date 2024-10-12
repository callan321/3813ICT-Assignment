import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from "@angular/router";
import {NgIf} from "@angular/common";

export interface User {
  id?: number;
  username: string;
  email: string;
  password: string;
  roles: string[];
  groups?: number[];
}

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [
    FormsModule,
    HttpClientModule,
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

  creationError: boolean = false;  // Add this for tracking user creation errors

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    this.createUser(this.user).subscribe({
      next: (response) => {
        console.log('User created successfully:', response);
        // Navigate to login page with a success message in query params
        this.router.navigate(['/login'], { queryParams: { success: 'User created successfully. Please log in.' } });
      },
      error: (error) => {
        console.error('There was an error creating the user!', error);
        this.creationError = true;
      }
    });
  }



  createUser(user: User): Observable<any> {
    const url = 'http://localhost:3000/api/users';
    return this.http.post(url, user);
  }
}
