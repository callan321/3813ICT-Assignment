import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import {RouterOutlet} from "@angular/router";
import {NgForOf} from "@angular/common";

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
    NgForOf
  ],
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  private apiGroupsUrl = 'http://localhost:3000/api/groups';
  userId: number | null = null;
  groups: Group[] = [];
  selectedGroup: Group | null = null;
  filteredChannels: Channel[] = [];

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    if (this.userId) {
      this.getGroupsForUser(this.userId);
    }
  }

  getGroupsForUser(userId: number): void {
    this.http.get<Group[]>(this.apiGroupsUrl).subscribe(
      (groupsData) => {
        this.groups = groupsData.filter(group =>
          group.members.includes(userId) || group.admins.includes(userId)
        );
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
}
