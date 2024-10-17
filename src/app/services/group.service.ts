// group.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';


import { Group, Channel } from '../models/models';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private apiBaseUrl = 'http://localhost:3000/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // Fetch groups for the current user
  getGroupsForUser(): Observable<Group[]> {
    const userId = this.authService.getUserId();
    if (!userId) {
      return of([]); // Return empty array if not authenticated
    }
    return this.http.get<Group[]>(`${this.apiBaseUrl}/groups/user/${userId}`);
  }



  // Create a new group
  createGroup(groupName: string): Observable<Group> {
    const createdBy = this.authService.getUserId();
    const newGroup = {
      groupName: groupName,
      createdBy: createdBy,
      admins: [createdBy],
      members: [createdBy],
      channels: []
    };
    return this.http.post<Group>(`${this.apiBaseUrl}/groups`, newGroup);
  }

  // Delete a group
  deleteGroup(groupId: string): Observable<any> {
    return this.http.delete(`${this.apiBaseUrl}/groups/${groupId}`);
  }

  // Add a new channel to a group
  addChannelToGroup(groupId: string, channelName: string): Observable<any> {
    const createdBy = this.authService.getUserId();
    const channelData = {
      channelName: channelName,
      createdBy: createdBy
    };
    return this.http.post(`${this.apiBaseUrl}/groups/${groupId}/add-channel`, channelData);
  }

  // Remove a channel from a group
  removeChannelFromGroup(groupId: string, channelId: string): Observable<any> {
    return this.http.put(`${this.apiBaseUrl}/groups/${groupId}/remove-channel/${channelId}`, {});
  }

  // Remove a user from a group
  removeUserFromGroup(groupId: string, userId: string, role: string): Observable<any> {
    const endpoint = role === 'admin' ? 'remove-admin' : 'remove-member';
    return this.http.put(`${this.apiBaseUrl}/groups/${groupId}/${endpoint}/${userId}`, {});
  }

  // Upgrade a user to admin
  upgradeToAdmin(groupId: string, userId: string): Observable<any> {
    return this.http.put(`${this.apiBaseUrl}/groups/${groupId}/upgrade-to-admin/${userId}`, {});
  }

  // Fetch all groups
  getAllGroups(): Observable<Group[]> {
    return this.http.get<Group[]>(`${this.apiBaseUrl}/groups`);
  }

  // Add a user to a group
  addUserToGroup(groupId: string, userId: string): Observable<any> {
    return this.http.put(`${this.apiBaseUrl}/groups/${groupId}/add-user/${userId}`, {});
  }
}
