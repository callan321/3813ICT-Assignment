import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import { Observable } from 'rxjs';
import {Router} from "@angular/router";

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
    HttpClientModule
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

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    this.createUser(this.user).subscribe({
      next: (response) => {
        console.log('User created successfully:', response);
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('There was an error!', error);
      }
    });
  }


  createUser(user: User): Observable<any> {
    const url = 'http://localhost:3000/api/users';
    return this.http.post(url, user);
  }
}
