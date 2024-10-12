import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink } from "@angular/router";
import { NgForOf, NgIf } from "@angular/common";
import { AuthService } from "../../../services/auth.service";
import {GroupService} from "../../../services/group.service";
import {Channel, Group} from "../../../models";


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
  userId: string | null = null;
  groups: Group[] = [];
  selectedGroup: Group | null = null;
  filteredChannels: Channel[] = [];

  constructor(
    private authService: AuthService,
    private groupService: GroupService,
  ) {}


  ngOnInit(): void {
    this.loadGroups();
  }

  // Use GroupService to load groups
  loadGroups(): void {
    this.groupService.getGroupsForUser().subscribe(
      (groupsData) => {
        this.groups = groupsData;
      }
    );
  }

  // Use GroupService to filter channels
  selectGroup(group: Group): void {
    this.selectedGroup = group;
    this.filteredChannels = this.groupService.getFilteredChannels(group);
  }

  isSuperAdmin(): boolean {
    return this.authService.isSuperAdmin();
  }

  Logout(): void {
    this.authService.Logout();
  }
}
