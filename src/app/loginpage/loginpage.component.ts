import { Component } from '@angular/core';
import {LoginComponent} from "../login/login.component";

@Component({
  selector: 'app-loginpage',
  standalone: true,
  imports: [LoginComponent],
  templateUrl: './loginpage.component.html',
  styleUrl: './loginpage.component.css'
})
export class LoginpageComponent {

}
