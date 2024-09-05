import { Component } from '@angular/core';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthService } from "../../services/auth.service";
import { Router, RouterLink } from "@angular/router";

interface LoginResponse {
  message: string;
  user: {
    username: string;
    id: number;
    roles: string[]; // Add roles here
  };
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    HttpClientModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  username: string = '';
  password: string = '';

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) {}

  onSubmit() {
    const data = {
      username: this.username,
      password: this.password
    };

    this.http.post<LoginResponse>('http://localhost:3000/api/login', data).subscribe(
      (res: LoginResponse) => {
        console.log('User logged in successfully', res);
        this.authService.saveUserSessionData(res.user.username, res.user.id, res.user.roles);
        this.router.navigate(['/home']);
      },
      (err: HttpErrorResponse) => {
        console.log('There was an error during the login process', err.error);
      }
    );
  }
}
