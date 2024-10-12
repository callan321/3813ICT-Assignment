import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { GroupApiService } from './api/group-api.service';
import {Channel, Group} from "../models"; // Import the API service


@Injectable({
  providedIn: 'root'
})
export class GroupService {
  constructor(
    private groupApiService: GroupApiService, // API service for fetching data
    private authService: AuthService          // AuthService for authentication logic
  ) {}


  // Fetch groups for the logged-in user using GroupApiService
  getGroupsForUser(): Observable<Group[]> {
    const userId = this.authService.getUserId(); // Get userId from AuthService
    if (!userId) {
      throw new Error('User is not authenticated'); // Handle missing userId (optional)
    }
    return this.groupApiService.getGroupsForUser(userId); // Use GroupApiService to fetch groups
  }

  // Get filtered channels for a selected group
  getFilteredChannels(group: Group): Channel[] {
    return group.channels; // Delegate filtering logic
  }


}
