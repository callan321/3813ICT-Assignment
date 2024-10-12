import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import {Router, ActivatedRoute, RouterLink} from "@angular/router";
import {NgIf} from "@angular/common";
import {AuthService} from "../../../services/auth.service";

interface LoginResponse {
  message: string;
  user: {
    username: string;
    id: number;
    roles: string[];
  };
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    HttpClientModule,
    NgIf,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: string = '';
  password: string = '';
  loginError: boolean = false;
  successMessage: string | null = null;  // Add this to handle success messages

  constructor(private http: HttpClient, private authService: AuthService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    // Check for success message in query parameters (e.g., after registration)
    this.route.queryParams.subscribe(params => {
      if (params['success']) {
        this.successMessage = params['success'];
        this.router.navigate([], {
          queryParams: {},
          replaceUrl: true,  // Prevent navigation history clutter
        });
      }
    });
  }

  onSubmit() {
    const data = {
      username: this.username,
      password: this.password
    };

    console.log('Login attempt with data:', data);

    this.http.post<LoginResponse>('http://localhost:3000/api/login', data).subscribe(
      (res: LoginResponse) => {
        console.log('User logged in successfully', res);
        this.authService.saveUserSessionData(res.user.username, res.user.id.toString(), res.user.roles);

        this.router.navigate(['/home']);
        this.loginError = false;
      },
      (err: HttpErrorResponse) => {
        console.error('There was an error during the login process', err.error);
        this.loginError = true;
      }
    );
  }
}
