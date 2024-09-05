import { Component } from '@angular/core';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthService } from "../../services/auth.service";
import {Router, RouterLink} from "@angular/router";

interface LoginResponse {
  message: string;
  user: {
    username: string;
    id: number; // Add the user ID here
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
  styleUrls: ['./login.component.css'] // Corrected to 'styleUrls'
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
        // Call setUsernameAndId with both username and id
        this.authService.setUsernameAndId(res.user.username, res.user.id);
        this.router.navigate(['/home']);
      },
      (err: HttpErrorResponse) => {
        console.log('There was an error during the login process', err.error);
      }
    );
  }
}
