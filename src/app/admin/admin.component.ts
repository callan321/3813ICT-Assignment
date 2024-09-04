import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [HttpClientModule, CommonModule],  // Import HttpClientModule and CommonModule
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']  // Corrected the typo to 'styleUrls'
})
export class AdminComponent implements OnInit {
  private apiUrl = 'http://localhost:3000/api/users'; // The Express API endpoint
  users: any[] = []; // Array to store the fetched users

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getUsers().subscribe(
      (data) => {
        this.users = data; // Store the response in the users array
      },
      (error) => {
        console.error('Error fetching users', error); // Handle error
      }
    );
  }

  // Fetch all users from the API
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
