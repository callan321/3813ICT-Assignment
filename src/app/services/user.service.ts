import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { User } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUsersUrl = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) {}

  // Fetch all users
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUsersUrl);
  }

  // Create a new user
  createUser(userData: User): Observable<User> {
    return this.http.post<User>(this.apiUsersUrl, userData);
  }

  // Update a user
  updateUser(userId: string, userData: Partial<User>): Observable<any> {
    return this.http.put(`${this.apiUsersUrl}/${userId}`, userData);
  }

  // Delete a user
  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${this.apiUsersUrl}/${userId}`);
  }

}
