import { Component, OnInit } from '@angular/core';
import {RouterLink, RouterOutlet} from "@angular/router";
import { NgForOf, NgIf } from "@angular/common";
import { AuthService } from "../../../services/auth.service";
import { GroupService } from "../../../services/group.service";
import { Group } from "../../../models";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  standalone: true,
  imports: [
    NgForOf,
    RouterLink,
    NgIf,
    RouterOutlet
  ],
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  groups: Group[] = [];
  selectedGroup: Group | null = null;
  filteredChannels: string[] = []; // Array of channel IDs

  constructor(
    private authService: AuthService,
    private groupService: GroupService,
  ) {}

  ngOnInit(): void {
    this.loadGroups();
  }

  // Load groups for the user
  loadGroups(): void {
    this.groupService.getGroupsForUser().subscribe(
      (groupsData: Group[]) => {
        this.groups = groupsData;
      },
      error => {
        console.error('Error fetching groups:', error);
      }
    );
  }

  // Filter channels when a group is selected
  selectGroup(group: Group): void {
    this.selectedGroup = group;
    this.filteredChannels = group.channels; // Since channels are IDs, we use them directly
  }

  isSuperAdmin(): boolean {
    return this.authService.isSuperAdmin();
  }

  Logout(): void {
    this.authService.Logout();
  }
}
