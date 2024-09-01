import { Component } from '@angular/core';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

interface LoginResponse {
  message: string;
  user: {
    username: string;
  };
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    HttpClientModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] // Corrected to 'styleUrls'
})
export class LoginComponent {

  username: string = '';
  password: string = '';

  constructor(private http: HttpClient) {}

  onSubmit() {
    const data = {
      username: this.username,
      password: this.password
    };

    this.http.post<LoginResponse>('http://localhost:3000/api/login', data).subscribe(
      (res: LoginResponse) => {
        console.log('User logged in successfully', res);
        localStorage.setItem('username', res.user.username);
      },
      (err: HttpErrorResponse) => {
        console.log('There was an error during the login process', err.error);
      }
    );
  }
}
