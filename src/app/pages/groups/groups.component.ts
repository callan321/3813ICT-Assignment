import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { AuthService } from "../../../services/auth.service";
import { Group, User } from "../../../models";
import { GroupService } from "../../../services/group.service";
import { UserService } from "../../../services/user.service";

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {
  groups: Group[] = [];
  users: User[] = [];
  newGroupName: string = '';

  constructor(
    private groupService: GroupService,
    private userService: UserService,
    protected authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadGroups();
    this.loadUsers();
  }

  isSuperAdmin(): boolean {
    return this.authService.isSuperAdmin();
  }

  loadGroups(): void {
    this.groupService.getAllGroups().subscribe(
      (data: Group[]) => {
        this.groups = data;
      },
      (error: any) => console.error('Error fetching groups', error)
    );
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe(
      (data: User[]) => {
        this.users = data;
      },
      (error: any) => console.error('Error fetching users', error)
    );
  }

  createGroup(): void {
    if (!this.newGroupName) {
      console.error('Group name is required!');
      return;
    }

    this.groupService.createGroup(this.newGroupName).subscribe(
      () => {
        this.loadGroups();
        this.newGroupName = '';
      },
      (error: any) => console.error('Error creating group', error)
    );
  }

  deleteGroup(groupId: string): void {
    this.groupService.deleteGroup(groupId).subscribe(
      () => this.loadGroups(),
      (error: any) => console.error('Error deleting group', error)
    );
  }

  addChannelToGroup(groupId: string, channelName: string): void {
    if (!channelName) {
      console.error('Channel name is required!');
      return;
    }

    this.groupService.addChannelToGroup(groupId, channelName).subscribe(
      () => this.loadGroups(),
      (error: any) => console.error('Error adding channel', error)
    );
  }

  removeChannelFromGroup(groupId: string, channelId: string): void {
    this.groupService.removeChannelFromGroup(groupId, channelId).subscribe(
      () => this.loadGroups(),
      (error: any) => console.error('Error removing channel from group', error)
    );
  }

  removeUserFromGroup(groupId: string, userId: string, role: string): void {
    this.groupService.removeUserFromGroup(groupId, userId, role).subscribe(
      () => this.loadGroups(),
      (error: any) => console.error(`Error removing ${role} from group`, error)
    );
  }

  upgradeToAdmin(groupId: string, userId: string): void {
    this.groupService.upgradeToAdmin(groupId, userId).subscribe(
      () => this.loadGroups(),
      (error: any) => console.error('Error upgrading member to admin', error)
    );
  }

  // Fetch username based on user ID using UserService
  getUsernameById(userId: string): string {
    const user = this.users.find(u => u._id === userId);
    return user ? user.username : 'Unknown';
  }
}
