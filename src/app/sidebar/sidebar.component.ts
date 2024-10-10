import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { RouterOutlet, Router, RouterLink } from "@angular/router";
import { NgForOf, NgIf } from "@angular/common";

interface Channel {
  channelId: string;
  channelName: string;
  groupId: string;
  messages: any[];
}

interface Group {
  _id: string; // MongoDB ObjectId as string
  groupName: string;
  admins: string[];
  members: string[];
  channels: Channel[];
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  standalone: true,
  imports: [
    RouterOutlet,
    NgForOf,
    RouterLink,
    NgIf
  ],
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  private apiGroupsUrl = 'http://localhost:3000/api/groups'; // Updated route
  userId: string | null = null;
  groups: Group[] = [];
  selectedGroup: Group | null = null;
  filteredChannels: Channel[] = [];

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    if (userId) {
      this.userId = userId;
      this.getGroupsForUser(userId);
    }
  }

  canAccessUsers(): boolean {
    return this.authService.isSuperAdmin();
  }

  // Only show the "Groups" section for Admin users
  canAccessGroups(): boolean {
    return this.authService.isSuperAdmin() || this.authService.isGroupAdmin();
  }

  // Fetch groups and relevant data for the user
  getGroupsForUser(userId: string): void {
    this.http.get<Group[]>(`${this.apiGroupsUrl}/${userId}`).subscribe(
      (groupsData) => {
        console.log('Fetched Groups:', groupsData);  // Log fetched data
        this.groups = groupsData;  // Assign the groups to be displayed
      },
      (error) => {
        console.error('Error fetching groups', error);
      }
    );
  }


  // When a group is selected, filter and display its channels
  selectGroup(group: Group): void {
    this.selectedGroup = group;
    this.filteredChannels = group.channels;  // Filter the channels of the selected group
    console.log('Selected Group:', this.selectedGroup._id, 'Channels:', this.filteredChannels);
  }

  // Logout the user
  confirmLogout(): void {
    this.authService.clearAuthData();
    this.router.navigate(['/login']); // Redirect to login page after logout
  }
}
