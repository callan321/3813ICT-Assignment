import {Component, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {AuthService} from "../../../services/auth.service";
import {GroupService} from "../../../services/group.service";
import {NgIf} from "@angular/common";



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FormsModule,
    NgIf
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  groupId: string = '';
  message: string = '';
  username: string | null = '';

  constructor(
    private authService: AuthService,
    private groupService: GroupService
  ) {}

  ngOnInit(): void {
    this.username = this.authService.getUsername(); // Get the logged-in username
  }

  // Function to handle joining a group
  joinGroup(): void {
    const userId = this.authService.getUserId(); // Get the logged-in user ID

    if (!userId) {
      this.message = 'You must be logged in to join a group.';
      return;
    }

    if (!this.groupId) {
      this.message = 'Please enter a valid group ID.';
      return;
    }

    // Call the GroupService to add the user to the group
    this.groupService.addUserToGroup(this.groupId, userId).subscribe(
      (response) => {
        this.message = 'You have successfully joined the group!';
      },
      (error) => {
        this.message = 'Error joining the group: ' + error.message;
      }
    );
  }
}
