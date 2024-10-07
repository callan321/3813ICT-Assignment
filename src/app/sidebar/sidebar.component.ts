import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { RouterOutlet, Router, RouterLink } from "@angular/router";
import {NgForOf, NgIf} from "@angular/common";
import * as bootstrap from 'bootstrap';  // Import Bootstrap Modal

interface Channel {
  channelId: number;
  channelName: string;
  groupId: number;
  messages: any[];
}

interface Group {
  groupId: number;
  groupName: string;
  admins: number[];
  members: number[];
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
  private apiGroupsUrl = 'http://localhost:3000/api/groups';
  userId: number | null = null;
  groups: Group[] = [];
  selectedGroup: Group | null = null;
  filteredChannels: Channel[] = [];

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    if (this.userId) {
      this.getGroupsForUser(this.userId);
    }
  }

  canAccessUsers(): boolean {
    return this.authService.isSuperAdmin();
  }


  getGroupsForUser(userId: number): void {
    this.http.get<Group[]>(this.apiGroupsUrl).subscribe(
      (groupsData) => {
        console.log('Fetched Groups:', groupsData); // Add this for debugging
        this.groups = groupsData.filter(group =>
          group.members.includes(userId) || group.admins.includes(userId)
        );
        console.log('Filtered Groups for User:', this.groups); // Log filtered groups
      },
      (error) => {
        console.error('Error fetching groups', error);
      }
    );
  }

  selectGroup(group: Group): void {
    this.selectedGroup = group;
    this.filteredChannels = group.channels;
    console.log('Selected Group:', this.selectedGroup.groupId, 'Channels:', this.filteredChannels);
  }

  openLogoutModal(): void {
    const modalElement = document.getElementById('logoutConfirmationModal') as HTMLElement;
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  }

  confirmLogout(): void {
    this.authService.clearAuthData();
    this.router.navigate(['/login']); // Redirect to login page after logout
  }
}
