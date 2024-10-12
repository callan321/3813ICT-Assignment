import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Group } from "../../models"; // Assuming your Group interface is here

@Injectable({
  providedIn: 'root'
})
export class GroupApiService {
  private apiGroupsUrl = 'http://localhost:3000/api/groups'; // API URL

  constructor(private http: HttpClient) {}

  // Fetch groups for a user
  getGroupsForUser(userId: string): Observable<Group[]> {
    return this.http.get<Group[]>(`${this.apiGroupsUrl}/${userId}`).pipe(
      catchError((error) => {
        console.error('Error fetching groups', error);
        return of([]); // Return an empty array in case of error
      })
    );
  }

  // Fetch a specific group by its ID
  getGroupById(groupId: string): Observable<Group | null> {
    return this.http.get<Group>(`${this.apiGroupsUrl}/group/${groupId}`).pipe(
      catchError((error) => {
        console.error(`Error fetching group ${groupId}`, error);
        return of(null); // Return null in case of error
      })
    );
  }
}
